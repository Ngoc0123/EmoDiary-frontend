import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  is_verified: boolean;
  is_active: boolean;
}

export async function fetchMeApi(): Promise<User> {
    return request.get<User>(ENDPOINT.GET_ME);
}

export async function logoutApi(): Promise<void> {
    return request.post(ENDPOINT.LOGOUT);
}
