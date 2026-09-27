"use client";

import { useEffect, useRef } from "react";

import { useTrackRecent } from "@/hooks/use-library";

/**
 * Records a camera visit in the "recently viewed" store.
 *
 * Renders nothing. Mounted once per detail page, so the store only ever
 * receives the id after hydration — never during SSR — which keeps the
 * persisted (and therefore client-only) store out of the server render.
 */
export function CCTVRecentTracker({ id }: { id: string }) {
  const trackRecent = useTrackRecent();
  const trackedRef = useRef<string | null>(null);

  useEffect(() => {
    // Guard against React 18/19 strict-mode double invocation so a single
    // visit does not push the same camera twice.
    if (trackedRef.current === id) return;
    trackedRef.current = id;
    trackRecent(id);
  }, [id, trackRecent]);

  return null;
}
