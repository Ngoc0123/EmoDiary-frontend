import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface DrawingItem {
  drawing_id: string;
  user_id: string;
  image_url: string | null;
  daily_mood: string | null;
  visibility: boolean;
  favorited: boolean;
  created_at: string;
}

export interface DrawingListResponse {
  items: DrawingItem[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export async function fetchDrawingsApi(
  page: number = 1,
  size: number = 9
): Promise<DrawingListResponse> {
  return request.get<DrawingListResponse>(ENDPOINT.LIST_DRAWINGS, {
    params: { page, size },
  });
}
