"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import {
  buildQueryString,
  countActiveFilters,
  parseFilters,
  type RawSearchParams,
} from "@/lib/cctv-query";
import type { CCTVFilters } from "@/types/cctv";

export interface UseFiltersResult {
  filters: CCTVFilters;
  activeCount: number;
  /** Merge a partial patch into the URL. Resets to page 1 unless `page` is patched. */
  setFilters: (patch: Partial<CCTVFilters>) => void;
  /** Replace a single value, toggling it off when it is already active. */
  toggleFilter: (key: keyof CCTVFilters, value: string) => void;
  /** Clear everything back to defaults. */
  resetFilters: () => void;
  /** Remove one filter (used by the active-filter chips). */
  clearFilter: (key: keyof CCTVFilters) => void;
  /** True when at least one filter is applied. */
  isFiltered: boolean;
}

/**
 * Reads filter state from the URL and writes changes back with `router.replace`.
 *
 * The URL is the single source of truth: refreshing, sharing and using the
 * browser back button all behave correctly for free.
 */
export function useFilters(): UseFiltersResult {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = useMemo<RawSearchParams>(() => {
    const entries: RawSearchParams = {};
    searchParams.forEach((value, key) => {
      entries[key] = value;
    });
    return entries;
  }, [searchParams]);

  const filters = useMemo(() => parseFilters(raw), [raw]);

  const commit = useCallback(
    (next: CCTVFilters) => {
      const query = buildQueryString(next);
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const setFilters = useCallback(
    (patch: Partial<CCTVFilters>) => {
      const next: CCTVFilters = { ...filters, ...patch };
      // Any change other than paging invalidates the current page.
      if (!("page" in patch)) next.page = 1;
      commit(next);
    },
    [commit, filters],
  );

  const toggleFilter = useCallback(
    (key: keyof CCTVFilters, value: string) => {
      const current = filters[key];
      if (key === "featured") {
        setFilters({ featured: !filters.featured });
        return;
      }
      setFilters({ [key]: current === value ? "" : value } as Partial<CCTVFilters>);
    },
    [filters, setFilters],
  );

  const clearFilter = useCallback(
    (key: keyof CCTVFilters) => {
      if (key === "featured") {
        setFilters({ featured: false });
        return;
      }
      setFilters({ [key]: "" } as Partial<CCTVFilters>);
    },
    [setFilters],
  );

  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  const activeCount = countActiveFilters(filters);

  return {
    filters,
    activeCount,
    setFilters,
    toggleFilter,
    clearFilter,
    resetFilters,
    isFiltered: activeCount > 0,
  };
}
