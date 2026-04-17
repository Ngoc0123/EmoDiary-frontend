"use client";

import { useState, useEffect } from "react";
import { ENDPOINT } from "@/components/endpoint_config/endpoint_config";

interface Analysis {
  wellness_analysis: string | null;
  inspiring_quote: string | null;
  actionable_advice: string | null;
}

interface DrawingData {
  drawing_id: string;
  image_url: string | null;
  analysis: {
    wellness_analysis: string | null;
    inspiring_quote: string | null;
    generated_advice: string | null;
  } | null;
}

export function useAnalysis(drawingId: string | null) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [drawingImageUrl, setDrawingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!drawingId) {
      setLoading(false);
      return;
    }

    const fetchDrawingWithAnalysis = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching drawing and analysis data for ID:", drawingId);

        // Fetch drawing with all related data using the endpoint config
        const url = ENDPOINT.GET_DRAWING(drawingId);
        console.log("Fetching from URL:", url);

        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            window.dispatchEvent(new Event("auth:unauthorized"));
          }
          const err = await response.json().catch(() => null);
          throw new Error(err?.detail ?? "Failed to fetch drawing");
        }

        const drawingData: DrawingData = await response.json();
        console.log("Drawing data fetched:", drawingData);

        // Set image URL
        if (drawingData.image_url) {
          setDrawingImageUrl(drawingData.image_url);
        }

        // Set analysis data
        if (drawingData.analysis) {
          setAnalysis({
            wellness_analysis: drawingData.analysis.wellness_analysis,
            inspiring_quote: drawingData.analysis.inspiring_quote,
            actionable_advice: drawingData.analysis.generated_advice,
          });
        }
      } catch (err) {
        console.error("Failed to fetch drawing and analysis:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load drawing and analysis. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDrawingWithAnalysis();
  }, [drawingId]);

  return { analysis, drawingImageUrl, loading, error };
}

