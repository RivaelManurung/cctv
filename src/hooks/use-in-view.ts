"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  /** Fire once and then stop observing. */
  once?: boolean;
  /** Margin around the viewport, e.g. "200px" to preload before visible. */
  rootMargin?: string;
  threshold?: number;
  /** Skip observation entirely (e.g. when the element is already active). */
  enabled?: boolean;
}

/**
 * Observes an element and reports whether it is (or has been) visible.
 *
 * Note that camera previews do **not** use this: `CCTVCard` deliberately waits
 * for an explicit play press before attaching a stream, which is stricter than
 * scroll-triggered activation. The one consumer today is `CCTVPlayer`, which
 * uses it to stop polling snapshot (`image`) cameras once the player scrolls
 * out of view.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const {
    once = true,
    rootMargin = "200px",
    threshold = 0,
    enabled = true,
  } = options;

  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;

    // Without IntersectionObserver support, just show the content.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled, once, rootMargin, threshold]);

  return { ref, inView } as const;
}
