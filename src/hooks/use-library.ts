"use client";

import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import { cctvById, cctvData } from "@/data/cctv";
import {
  selectFavoriteIds,
  selectRecentIds,
  selectRecentSearches,
  useLibraryStore,
} from "@/stores/use-library-store";
import type { CCTV } from "@/types/cctv";

/**
 * Favourite toggling with user feedback.
 *
 * Returns `undefined` for `isFavorite` until the store has hydrated, which
 * lets callers render a neutral state instead of flashing "not favourited"
 * and then correcting itself.
 */
export function useFavorites() {
  const favoriteIds = useLibraryStore(selectFavoriteIds);
  const toggleFavoriteAction = useLibraryStore((state) => state.toggleFavorite);
  const removeFavoriteAction = useLibraryStore((state) => state.removeFavorite);
  const clearFavorites = useLibraryStore((state) => state.clearFavorites);

  const favoriteSet = useMemo(() => new Set(favoriteIds), [favoriteIds]);

  const toggleFavorite = useCallback(
    (id: string, name?: string) => {
      const added = toggleFavoriteAction(id);
      if (added) {
        toast.success("CCTV ditambahkan ke favorit", {
          description: name,
        });
      } else {
        toast.success("CCTV dihapus dari favorit", {
          description: name,
        });
      }
    },
    [toggleFavoriteAction],
  );

  const removeFavorite = useCallback(
    (id: string, name?: string) => {
      removeFavoriteAction(id);
      toast.success("CCTV dihapus dari favorit", { description: name });
    },
    [removeFavoriteAction],
  );

  return {
    favoriteIds,
    favoriteSet,
    count: favoriteIds.length,
    isFavorite: (id: string) => favoriteSet.has(id),
    toggleFavorite,
    removeFavorite,
    clearFavorites,
  } as const;
}

/** Favourite cameras resolved to full objects, preserving saved order. */
export function useFavoriteCameras(): CCTV[] {
  const favoriteIds = useLibraryStore(selectFavoriteIds);
  return useMemo(
    () =>
      favoriteIds
        .map((id) => cctvById.get(id))
        .filter((camera): camera is CCTV => Boolean(camera)),
    [favoriteIds],
  );
}

/** Records a camera as recently viewed. Safe to call on every detail view. */
export function useTrackRecent() {
  const pushRecent = useLibraryStore((state) => state.pushRecent);
  return useCallback((id: string) => pushRecent(id), [pushRecent]);
}

/** Recently viewed cameras, most recent first. */
export function useRecentlyViewed(): CCTV[] {
  const recentIds = useLibraryStore(selectRecentIds);
  return useMemo(
    () =>
      recentIds
        .map((id) => cctvById.get(id))
        .filter((camera): camera is CCTV => Boolean(camera)),
    [recentIds],
  );
}

/** Recent search terms with a clear action. */
export function useRecentSearches() {
  const recentSearches = useLibraryStore(selectRecentSearches);
  const pushSearch = useLibraryStore((state) => state.pushSearch);
  const clearSearches = useLibraryStore((state) => state.clearSearches);

  const addSearch = useCallback((query: string) => pushSearch(query), [pushSearch]);

  return { recentSearches, addSearch, clearSearches } as const;
}

/** Resolves a list of camera ids to cameras, skipping unknown ids. */
export function resolveCameras(ids: string[]): CCTV[] {
  return ids
    .map((id) => cctvById.get(id))
    .filter((camera): camera is CCTV => Boolean(camera));
}

/** Convenience: the featured cameras, for the homepage rail. */
export function useFeaturedCameras(limit = 8): CCTV[] {
  return useMemo(
    () => cctvData.filter((camera) => camera.isFeatured).slice(0, limit),
    [limit],
  );
}
