"use client";

import { useState, useEffect } from "react";

/**
 * Debounces a value — only updates after `delay` ms of no changes.
 * Use this to avoid firing API calls on every keystroke.
 *
 * @example
 * const debouncedQuery = useDebounce(searchInput, 300);
 * useEffect(() => { fetch("/api/search?q=" + debouncedQuery); }, [debouncedQuery]);
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
