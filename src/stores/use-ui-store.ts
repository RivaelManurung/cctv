"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ViewMode } from "@/types/cctv";

/**
 * Ephemeral + light-preference UI state.
 *
 * Filter state deliberately lives in the URL (see `useFilters`) so that
 * filtered views are shareable and survive a refresh. Only genuinely
 * client-local preferences are kept here.
 */

interface UIState {
  /** Grid / list / map — persisted so the choice survives navigation. */
  viewMode: ViewMode;
  /** Split map+list layout on /map. */
  mapSplit: boolean;
  /** Mobile filter drawer. */
  filterSheetOpen: boolean;
  /** Camera currently focused on the map (marker click / hover). */
  focusedCameraId: string | null;

  setViewMode: (mode: ViewMode) => void;
  setMapSplit: (split: boolean) => void;
  setFilterSheetOpen: (open: boolean) => void;
  setFocusedCameraId: (id: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      viewMode: "grid",
      mapSplit: true,
      filterSheetOpen: false,
      focusedCameraId: null,

      setViewMode: (viewMode) => set({ viewMode }),
      setMapSplit: (mapSplit) => set({ mapSplit }),
      setFilterSheetOpen: (filterSheetOpen) => set({ filterSheetOpen }),
      setFocusedCameraId: (focusedCameraId) => set({ focusedCameraId }),
    }),
    {
      name: "cctv-id:ui",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      // Only preferences are persisted — never transient UI state.
      partialize: (state) => ({
        viewMode: state.viewMode,
        mapSplit: state.mapSplit,
      }),
      merge: (persisted, current) => {
        const value = (persisted ?? {}) as Partial<UIState>;
        const modes: ViewMode[] = ["grid", "list", "map"];
        return {
          ...current,
          viewMode: modes.includes(value.viewMode as ViewMode)
            ? (value.viewMode as ViewMode)
            : "grid",
          mapSplit:
            typeof value.mapSplit === "boolean" ? value.mapSplit : true,
        };
      },
    },
  ),
);

export const selectViewMode = (state: UIState) => state.viewMode;
export const selectMapSplit = (state: UIState) => state.mapSplit;
