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
    const response = await fetch(fullUrl, config);

    // Initial check for network errors or non-2xx status
    if (!response.ok) {
      // Try to parse error response as JSON
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = null;
      }

      // Check for Not authenticated error to trigger logout
      if (errorData?.detail === "Not authenticated") {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
      }
      
      throw new ApiError(
        response.status,
        response.statusText || 'An error occurred while fetching the data.',
        errorData
      );
    }

    // Identify if response has content (e.g. 204 No Content)
    if (response.status === 204) {
        return {} as T;
    }

    // Try to parse success response as JSON
    try {
        return await response.json();
    } catch {
        // If parsing JSON fails, and it was a success, maybe return text or null?
        // For now, assume generic T implies JSON. If parsing fails on 200, it's weird.
        // We'll return the text as T (cast) if it's not JSON.
        const text = await response.text();
        return text as unknown as T;
    }

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Re-throw other errors (e.g., proper network errors)
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
