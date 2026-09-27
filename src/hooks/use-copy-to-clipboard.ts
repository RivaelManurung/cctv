"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

/**
 * Clipboard helper that degrades gracefully:
 *   1. `navigator.clipboard` (requires a secure context)
 *   2. a hidden `<textarea>` + `document.execCommand("copy")`
 *   3. an error toast
 */
export function useCopyToClipboard(resetAfterMs = 2000) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const copy = useCallback(
    async (value: string, successMessage = "Link berhasil disalin") => {
      const fallback = () => {
        const textarea = document.createElement("textarea");
        textarea.value = value;
        textarea.setAttribute("readonly", "");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          return document.execCommand("copy");
        } catch {
          return false;
        } finally {
          document.body.removeChild(textarea);
        }
      };

      let ok = false;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(value);
          ok = true;
        } else {
          ok = fallback();
        }
      } catch {
        ok = fallback();
      }

      if (ok) {
        setCopied(true);
        toast.success(successMessage);
        if (timerRef.current !== null) window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setCopied(false), resetAfterMs);
      } else {
        toast.error("Gagal menyalin ke papan klip");
      }

      return ok;
    },
    [resetAfterMs],
  );

  return { copied, copy } as const;
}
