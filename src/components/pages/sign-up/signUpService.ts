import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface UserRead {
  id: string;
  email: string | null;
  is_verified: boolean;
  is_active: boolean;
}

export type SignUpResponse = UserRead;

export async function signUpApi(data: SignUpRequest): Promise<SignUpResponse> {
  return request.post<SignUpResponse>(ENDPOINT.SIGN_UP, data);
}
