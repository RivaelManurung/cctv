"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type StreamState =
  | "idle"
  | "loading"
  | "playing"
  | "error"
  | "unsupported";

interface UseHlsStreamOptions {
  url: string | undefined;
  /** Only attach the stream once this becomes true (visibility / selection). */
  enabled: boolean;
  autoPlay?: boolean;
}

/**
 * Owns the entire HLS lifecycle for a single `<video>` element.
 *
 * Guarantees:
 *  - `hls.js` is loaded with a dynamic `import()`, so it never lands in the
 *    initial bundle for users who never open a stream.
 *  - exactly one `Hls` instance per mounted element, always destroyed on
 *    unmount / url change / disable — no leaked instances, no leaked
 *    network activity, no detached event listeners.
 *  - Safari (and any browser with native HLS) bypasses hls.js entirely.
 *  - a rejected `play()` (autoplay policy) is treated as "ready", not an
 *    error, so the UI can show a tap-to-play affordance.
 */
export function useHlsStream({
  url,
  enabled,
  autoPlay = true,
}: UseHlsStreamOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [state, setState] = useState<StreamState>("idle");
  const [attempt, setAttempt] = useState(0);
  const [needsGesture, setNeedsGesture] = useState(false);

  const retry = useCallback(() => {
    setState("loading");
    setAttempt((value) => value + 1);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!enabled || !url) {
      setState("idle");
      return;
    }

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- hls.js instance type differs between static/dynamic import
    let hls: any = null;

    const attemptPlay = () => {
      const promise = video.play();
      if (promise === undefined) return;
      promise.catch(() => {
        // Autoplay was blocked. Not an error — surface a play button instead.
        if (!cancelled) setNeedsGesture(true);
      });
    };

    setState("loading");
    setNeedsGesture(false);

    const startNative = () => {
      video.src = url;
      video.addEventListener("loadedmetadata", () => {
        if (cancelled) return;
        setState("playing");
        if (autoPlay) attemptPlay();
      });
      video.addEventListener("error", () => {
        if (!cancelled) setState("error");
      });
    };

    void (async () => {
      try {
        const mod = await import("hls.js");
        if (cancelled) return;
        const Hls = mod.default;

        // Prefer native playback (Safari, iOS) — it is more efficient and
        // avoids a second buffering layer.
        if (!Hls.isSupported()) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            startNative();
          } else {
            setState("unsupported");
          }
          return;
        }

        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: false,
          // Keep memory bounded for long-running wall displays.
          maxBufferLength: 12,
          maxMaxBufferLength: 30,
          backBufferLength: 30,
          manifestLoadingTimeOut: 12_000,
          manifestLoadingMaxRetry: 2,
          levelLoadingMaxRetry: 2,
          fragLoadingMaxRetry: 3,
        });

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (cancelled) return;
          setState("playing");
          if (autoPlay) attemptPlay();
        });

        hls.on(Hls.Events.ERROR, (_event: unknown, data: { fatal?: boolean; type?: string }) => {
          if (cancelled || !data?.fatal) return;
          switch (data.type) {
            case "networkError":
              // Try a single recovery before giving up.
              try {
                hls?.startLoad();
              } catch {
                setState("error");
              }
              break;
            case "mediaError":
              try {
                hls?.recoverMediaError();
              } catch {
                setState("error");
              }
              break;
            default:
              setState("error");
          }
        });

        hls.attachMedia(video);
        hls.loadSource(url);
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
      if (hls) {
        try {
          hls.destroy();
        } catch {
          /* already torn down */
        }
        hls = null;
      }
      // Detach native sources so the browser stops downloading immediately.
      video.removeAttribute("src");
      try {
        video.load();
      } catch {
        /* ignore */
      }
    };
  }, [url, enabled, autoPlay, attempt]);

  /** Manual play, used by the tap-to-play overlay. */
  const play = useCallback(() => {
    setNeedsGesture(false);
    const promise = videoRef.current?.play();
    if (promise) promise.catch(() => setNeedsGesture(true));
  }, []);

  return { videoRef, state, needsGesture, retry, play } as const;
}
