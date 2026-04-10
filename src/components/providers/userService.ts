import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

// Matches UserResponse schema from the API
export interface User {
  user_id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export async function fetchMeApi(): Promise<User> {
    return request.get<User>(ENDPOINT.GET_ME);
}

export async function logoutApi(): Promise<void> {
    return request.post(ENDPOINT.LOGOUT);
}
