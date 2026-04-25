"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { MedicineResult } from "@/lib/fuse-indexes";
import type { LabTestResult } from "@/lib/fuse-indexes";
import type { DietPlanResult } from "@/lib/fuse-indexes";

export type SearchCategory = "all" | "doctors" | "medicines" | "lab-tests" | "nutrition";

export type DoctorSearchResult = {
  id: string;
  name: string;
  specialization: string;
  city: string;
  rating: number;
  fees: number;
  experience: number;
};

export type SearchResults = {
  doctors: DoctorSearchResult[];
  medicines: MedicineResult[];
  labTests: LabTestResult[];
  dietPlans: DietPlanResult[];
};

export type UseSearchReturn = {
  results: SearchResults;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  hasMore: boolean;
  setPage: (page: number) => void;
};

const EMPTY_RESULTS: SearchResults = {
  doctors: [],
  medicines: [],
  labTests: [],
  dietPlans: [],
};

export function useSearch(
  query: string,
  category: SearchCategory = "all",
  pageSize: number = 20
): UseSearchReturn {
  const [results, setResults] = useState<SearchResults>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchResults = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(EMPTY_RESULTS);
      setTotal(0);
      setHasMore(false);
      setLoading(false);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: trimmed,
        category,
        page: String(page),
        limit: String(pageSize),
      });

      const res = await fetch(`/api/search?${params}`, {
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error(`Search failed: ${res.status}`);
      const data = await res.json();

      setResults(data.results ?? EMPTY_RESULTS);
      setTotal(data.total ?? 0);
      setHasMore(data.hasMore ?? false);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Search failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [query, category, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [query, category]);

  useEffect(() => {
    fetchResults();
    return () => abortRef.current?.abort();
  }, [fetchResults]);

  return { results, loading, error, total, page, hasMore, setPage };
}
