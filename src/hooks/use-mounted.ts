"use client";

import { useEffect, useState } from "react";

/**
 * `false` during SSR and the first client render, `true` afterwards.
 *
 * Use this to gate anything that can only be known on the client (localStorage
 * reads, `Date.now()`, `window` dimensions) so server and client markup match.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Tracks whether the persisted Zustand stores have finished rehydrating.
 *
 * Returns `false` on the server and during the first paint, which is exactly
 * when we must render the "empty" state to avoid a hydration mismatch.
 */
export function useHydrated(): boolean {
  return useMounted();
}
