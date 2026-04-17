import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

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

export interface AnalysisResponse {
  analysis_id: string;
  drawing_id: string;
  detected_emotions: string | null;
  generated_advice: string | null;
  wellness_analysis: string | null;
  inspiring_quote: string | null;
  created_at: string;
}

/**
 * Upload the canvas image + metadata as multipart form data.
 * The backend uploads the image to S3 first, then persists the drawing.
 */
export async function saveDrawingApi(
  imageBlob: Blob,
  opts?: {
    drawingData?: Record<string, unknown>;
    dailyMood?: string;
    visibility?: boolean;
    favorited?: boolean;
  }
): Promise<SaveDrawingResponse> {
  const form = new FormData();
  form.append("image", imageBlob, "drawing.png");

  if (opts?.drawingData !== undefined) {
    form.append("drawing_data", JSON.stringify(opts.drawingData));
  }
  if (opts?.dailyMood !== undefined) {
    form.append("daily_mood", opts.dailyMood);
  }
  if (opts?.visibility !== undefined) {
    form.append("visibility", String(opts.visibility));
  }
  if (opts?.favorited !== undefined) {
    form.append("favorited", String(opts.favorited));
  }

  // Use fetch directly — the shared httpRequest helper force-sets
  // Content-Type to application/json, which breaks multipart uploads.
  const res = await fetch(ENDPOINT.CREATE_DRAWING, {
    method: "POST",
    credentials: "include",
    body: form,
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Failed to save drawing");
  }

  return res.json();
}

/**
 * Analyze a drawing using the wellness AI service.
 */
export async function analyzeDrawingApi(drawingId: string): Promise<AnalysisResponse> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const res = await fetch(`${backendUrl}/api/v1/wellness/analyze-drawing`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ drawing_id: drawingId }),
  });

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Failed to analyze drawing");
  }

  return res.json();
}

