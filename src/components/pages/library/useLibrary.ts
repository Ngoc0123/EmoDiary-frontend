"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { fetchDrawingsApi, type DrawingListResponse } from "./libraryService";

export function useLibrary() {
  const { t } = useLanguage();

  const [data, setData] = useState<DrawingListResponse | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFavoriteOnly, setShowFavoriteOnly] = useState(false);

  const PAGE_SIZE = 9;

  const fetchPage = useCallback(
    async (p: number) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchDrawingsApi(p, PAGE_SIZE);
        setData(result);
        setPage(p);
      } catch {
        setError(t.library.errorLoad);
      } finally {
        setIsLoading(false);
      }
    },
    [t.library.errorLoad]
  );

  useEffect(() => {
    fetchPage(1);
  }, [fetchPage]);

  const goToPage = useCallback(
    (p: number) => {
      if (p < 1 || (data && p > data.pages)) return;
      fetchPage(p);
    },
    [data, fetchPage]
  );

  const drawings = useMemo(() => {
    const items = data?.items ?? [];
    if (showFavoriteOnly) return items.filter((d) => d.favorited);
    return items;
  }, [data, showFavoriteOnly]);

  return {
    drawings,
    page,
    totalPages: data?.pages ?? 0,
    total: data?.total ?? 0,
    isLoading,
    error,
    goToPage,
    showFavoriteOnly,
    toggleFavoriteOnly: () => setShowFavoriteOnly((prev) => !prev),
    t: t.library,
  };
}
