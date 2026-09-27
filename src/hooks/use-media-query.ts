"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe `matchMedia`. Always returns `false` on the server so markup is
 * deterministic, then corrects itself on mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** Tailwind `md` breakpoint and up. */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** True when the user has asked for reduced motion. */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
