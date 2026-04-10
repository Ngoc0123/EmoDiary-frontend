import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

// Matches AccountCreate schema from the API
export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

// Matches AccountResponse schema from the API
export interface SignUpResponse {
  user_id: string;
  email: string;
  username: string;
  is_active: boolean;
}

export async function signUpApi(data: SignUpRequest): Promise<SignUpResponse> {
  return request.post<SignUpResponse>(ENDPOINT.SIGN_UP, data);
}
