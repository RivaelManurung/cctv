"use client";

import { useEffect, useState } from "react";

/**
 * Returns a value that only updates after `delay` ms of silence.
 * Used by the search inputs so filtering does not run on every keystroke.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
