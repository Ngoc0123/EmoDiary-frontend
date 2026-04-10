import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface SignInRequest {
  email: string;
  password: string;
}

// Matches Token schema from the API
export interface SignInResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export async function signInApi(data: SignInRequest): Promise<SignInResponse> {
  // The login endpoint uses OAuth2 password flow — must send application/x-www-form-urlencoded.
  // The `username` field is the account email (FastAPI OAuth2 convention).
  const body = new URLSearchParams({
    username: data.email,
    password: data.password,
  });

  const response = await fetch(ENDPOINT.SIGN_IN, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = null;
    }
    const { ApiError } = await import("@/components/http_request");
    throw new ApiError(response.status, response.statusText, errorData);
  }

  return response.json();
}

