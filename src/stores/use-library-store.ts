"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * User library: favourites, recently viewed, recent searches.
 *
 * Persisted to localStorage. Hydration is skipped and triggered explicitly
 * from `<Providers>` after mount, because reading localStorage during render
 * would produce a server/client markup mismatch.
 */

const MAX_RECENT = 10;
const MAX_SEARCHES = 8;

interface LibraryState {
  favoriteIds: string[];
  recentIds: string[];
  recentSearches: string[];

  toggleFavorite: (id: string) => boolean;
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;

  pushRecent: (id: string) => void;
  clearRecent: () => void;

  pushSearch: (query: string) => void;
  clearSearches: () => void;
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      recentIds: [],
      recentSearches: [],

      toggleFavorite: (id) => {
        const { favoriteIds } = get();
        const isFavorite = favoriteIds.includes(id);
        set({
          favoriteIds: isFavorite
            ? favoriteIds.filter((value) => value !== id)
            : [id, ...favoriteIds],
        });
        return !isFavorite;
      },

      addFavorite: (id) => {
        const { favoriteIds } = get();
        if (favoriteIds.includes(id)) return;
        set({ favoriteIds: [id, ...favoriteIds] });
      },

      removeFavorite: (id) =>
        set({ favoriteIds: get().favoriteIds.filter((value) => value !== id) }),

      clearFavorites: () => set({ favoriteIds: [] }),

      pushRecent: (id) => {
        const next = [id, ...get().recentIds.filter((value) => value !== id)];
        set({ recentIds: next.slice(0, MAX_RECENT) });
      },

      clearRecent: () => set({ recentIds: [] }),

      pushSearch: (query) => {
        const trimmed = query.trim();
        if (trimmed.length < 2) return;
        const next = [
          trimmed,
          ...get().recentSearches.filter(
            (value) => value.toLowerCase() !== trimmed.toLowerCase(),
          ),
        ];
        set({ recentSearches: next.slice(0, MAX_SEARCHES) });
      },

      clearSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "cctv-id:library",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Defensive: storage may have been hand-edited or written by an older
      // version. Never trust its shape.
      merge: (persisted, current) => {
        const value = (persisted ?? {}) as Partial<LibraryState>;
        return {
          ...current,
          favoriteIds: Array.isArray(value.favoriteIds)
            ? value.favoriteIds.filter((id): id is string => typeof id === "string")
            : [],
          recentIds: Array.isArray(value.recentIds)
            ? value.recentIds
                .filter((id): id is string => typeof id === "string")
                .slice(0, MAX_RECENT)
            : [],
          recentSearches: Array.isArray(value.recentSearches)
            ? value.recentSearches
                .filter((q): q is string => typeof q === "string")
                .slice(0, MAX_SEARCHES)
            : [],
        };
      },
    },
  ),
);

/* ------------------------------------------------------------------ *
 * Selectors — import these instead of inlining arrow functions so
 * components subscribe to the narrowest possible slice.
 * ------------------------------------------------------------------ */

export const selectFavoriteIds = (state: LibraryState) => state.favoriteIds;
export const selectRecentIds = (state: LibraryState) => state.recentIds;
export const selectRecentSearches = (state: LibraryState) => state.recentSearches;
