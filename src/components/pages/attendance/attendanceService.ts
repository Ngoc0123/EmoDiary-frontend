import { request } from "@/components/http_request";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

export interface SaveDrawingRequest {
  image_url?: string;
  drawing_data?: Record<string, unknown>;
  daily_mood?: string;
  visibility?: boolean;
  favorited?: boolean;
}

export interface SaveDrawingResponse {
  drawing_id: string;
  user_id: string;
  image_url: string | null;
  drawing_data: Record<string, unknown> | null;
  daily_mood: string | null;
  visibility: boolean;
  favorited: boolean;
  created_at: string;
  analysis: unknown | null;
}

export async function saveDrawingApi(
  data: SaveDrawingRequest
): Promise<SaveDrawingResponse> {
  return request.post<SaveDrawingResponse>(ENDPOINT.CREATE_DRAWING, data);
}
