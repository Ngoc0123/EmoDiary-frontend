import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

type RequestOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

// ── Token refresh queue ──────────────────────────────────────────────────────
// When multiple requests 401 at the same time, only one refresh call is made.
// All others wait for the same promise.
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const res = await fetch(ENDPOINT.REFRESH, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function forceLogout() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('auth:unauthorized'));
  }
}

// ── Core request function ────────────────────────────────────────────────────

async function httpRequest<T>(url: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...restOptions } = options;

  // Handle query parameters
  const queryString = params
    ? '?' + new URLSearchParams(Object.entries(params).map(([key, val]) => [key, String(val)])).toString()
    : '';

  const fullUrl = `${url}${queryString}`;

  const config: RequestInit = {
    ...restOptions,
    credentials: 'include',
    headers: {
      ...DEFAULT_HEADERS,
      ...headers,
    },
  };

  try {
    let response = await fetch(fullUrl, config);

    // On 401, attempt a silent token refresh and retry once
    if (response.status === 401) {
      // Don't try to refresh if the failing request IS the refresh endpoint
      const isRefreshUrl = fullUrl === ENDPOINT.REFRESH;
      if (!isRefreshUrl) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          // Retry the original request with the new cookies
          response = await fetch(fullUrl, config);
        } else {
          forceLogout();
          throw new ApiError(401, 'Session expired');
        }
      }
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      // If still 401 after refresh attempt, force logout
      if (response.status === 401) {
        forceLogout();
      }

      throw new ApiError(
        response.status,
        response.statusText || 'An error occurred while fetching the data.',
        errorData
      );
    }

    if (response.status === 204) {
        return {} as T;
    }

    try {
        return await response.json();
    } catch {
        const text = await response.text();
        return text as unknown as T;
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw error;
  }
}

export const request = {
  get: <T>(url: string, options?: RequestOptions) => httpRequest<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: RequestOptions) =>
    httpRequest<T>(url, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(url: string, body?: any, options?: RequestOptions) =>
    httpRequest<T>(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(url: string, body?: any, options?: RequestOptions) =>
    httpRequest<T>(url, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(url: string, options?: RequestOptions) => httpRequest<T>(url, { ...options, method: 'DELETE' }),
};
