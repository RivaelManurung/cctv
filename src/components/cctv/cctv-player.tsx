"use client";

import {
  ExternalLink,
  Loader2,
  Maximize2,
  Minimize2,
  Play,
  RefreshCw,
  TriangleAlert,
  Volume2,
  VolumeX,
  WifiOff,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

import { CameraPoster } from "@/components/cctv/camera-poster";
import { LiveBadge, SampleBadge, StreamTypeBadge } from "@/components/cctv/cctv-status";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHlsStream } from "@/hooks/use-hls-stream";
import { useInView } from "@/hooks/use-in-view";
import { useMounted } from "@/hooks/use-mounted";
import { cn, sanitizeExternalUrl, toYouTubeEmbed } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

export interface CCTVPlayerProps {
  camera: CCTV;
  /**
   * When `false` the stream is never attached. This is the lazy-loading
   * mechanism — a card in a grid keeps `active` false until the user asks
   * for the preview, so 100 cards never open 100 connections.
   */
  active?: boolean;
  autoPlay?: boolean;
  className?: string;
  /** Extra controls (favourite, share) injected by the host page. */
  actions?: ReactNode;
  /** Snapshot refresh interval in seconds, for `streamType: "image"`. */
  refreshSeconds?: number;
}

/** Where a camera's feed actually lives, or why it cannot be embedded. */
type Mode = "embed" | "external" | "offline";

function resolveMode(camera: CCTV): Mode {
  if (camera.streamType === "external" || !camera.streamUrl) return "external";
  if (camera.status === "offline") return "offline";
  return "embed";
}

/* ------------------------------------------------------------------ *
 * State panels
 * ------------------------------------------------------------------ */

function StatePanel({
  icon,
  title,
  description,
  action,
  tone = "neutral",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  tone?: "neutral" | "danger" | "warning";
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/40 px-6 text-center">
      <span
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full border",
          tone === "danger"
            ? "border-destructive/25 bg-destructive/10 text-destructive"
            : tone === "warning"
              ? "border-warning/25 bg-warning/10 text-warning"
              : "border-border bg-background text-muted-foreground",
        )}
      >
        {icon}
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

/**
 * The "this feed lives elsewhere" panel.
 *
 * Used for every camera whose operator does not publish an embeddable public
 * stream — which, honestly, is most Indonesian traffic operators. We link to
 * the official source rather than pretending to embed a live feed.
 */
export function ExternalSourceCard({
  camera,
  className,
  compact = false,
}: {
  camera: CCTV;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/40 px-6 text-center",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-muted-foreground">
        <WifiOff className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-semibold text-foreground">
          Feed belum tersedia untuk diputar di sini
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {compact
            ? camera.sourceName
            : `${camera.sourceName} belum menyediakan URL stream publik yang bisa diputar langsung di web ini.`}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Player
 * ------------------------------------------------------------------ */

export function CCTVPlayer({
  camera,
  active = true,
  autoPlay = true,
  className,
  actions,
  refreshSeconds = 30,
}: CCTVPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Snapshot cameras poll on an interval. Pausing that poll while the player is
  // scrolled out of view keeps a backgrounded page from re-fetching a still
  // image nobody is looking at.
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>({
    once: false,
    rootMargin: "0px",
  });

  /** Single DOM node, two refs: fullscreen target + visibility observer. */
  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      inViewRef.current = node;
    },
    [inViewRef],
  );
  const mounted = useMounted();

  const mode = resolveMode(camera);
  const embeddable = mode === "embed";

  const { videoRef, state, needsGesture, retry, play } = useHlsStream({
    url: camera.streamUrl,
    enabled: embeddable && active && camera.streamType === "hls",
    autoPlay,
  });

  // Non-HLS sources track their own readiness.
  const [mediaState, setMediaState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [snapshotKey, setSnapshotKey] = useState(0);

  // Reset per-camera transient state when the camera changes.
  useEffect(() => {
    setMediaState("idle");
    setSnapshotKey(0);
  }, [camera.id]);

  // Attach non-HLS media only once active.
  useEffect(() => {
    if (!embeddable || !active) return;
    if (camera.streamType === "hls" || camera.streamType === "external") return;
    setMediaState("loading");
  }, [active, camera.streamType, camera.id, embeddable]);

  // Snapshot cameras refresh on an interval, but only while active and visible.
  useEffect(() => {
    if (camera.streamType !== "image" || !active || !inView) return;
    const timer = window.setInterval(
      () => setSnapshotKey((key) => key + 1),
      Math.max(refreshSeconds, 5) * 1000,
    );
    return () => window.clearInterval(timer);
  }, [active, camera.streamType, refreshSeconds, inView]);

  // Fullscreen state, with listener cleanup.
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const element = containerRef.current;
    if (!element) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await element.requestFullscreen();
      }
    } catch {
      // Fullscreen can be blocked (permissions policy / iframe). Fail quietly.
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, [videoRef]);

  const sourceHref = sanitizeExternalUrl(camera.sourceUrl);
  const youTubeSrc = camera.streamType === "youtube"
    ? toYouTubeEmbed(camera.streamUrl ?? "")
    : null;
  const iframeSrc = camera.streamType === "iframe"
    ? sanitizeExternalUrl(camera.streamUrl)
    : null;
  const imageSrc = (camera.streamType === "image" || camera.streamType === "mjpeg")
    ? sanitizeExternalUrl(camera.streamUrl)
    : null;

  // Audio controls only make sense for formats that can carry audio.
  const supportsAudio = camera.streamType === "hls" || camera.streamType === "youtube";
  const isPlaying = camera.streamType === "hls" ? state === "playing" : mediaState === "ready";
  // YouTube/iframe must be rendered while loading so the browser can fire
  // their load event. Showing the loading panel first would create a
  // deadlock: the iframe is never mounted, therefore it can never finish
  // loading. Native image/MJPEG streams also render immediately.
  const isLoading = active && embeddable && camera.streamType === "hls"
    ? state === "loading"
    : false;

  const hasError = embeddable && (
    camera.streamType === "hls"
      ? state === "error" || state === "unsupported"
      : mediaState === "error"
  );

  /* ---------------- body ---------------- */

  let body: ReactNode;

  if (mode === "external") {
    body = <ExternalSourceCard camera={camera} />;
  } else if (mode === "offline") {
    body = (
      <StatePanel
        tone="danger"
        icon={<WifiOff className="h-5 w-5" aria-hidden="true" />}
        title="Kamera sedang offline"
        description="Sumber melaporkan kamera ini tidak aktif. Ketersediaan kamera dapat berubah sewaktu-waktu."
        action={
          sourceHref ? (
            <Button asChild size="sm" variant="outline" className="gap-1.5">
              <a href={sourceHref} target="_blank" rel="noopener noreferrer nofollow">
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                Buka sumber resmi
              </a>
            </Button>
          ) : null
        }
      />
    );
  } else if (hasError) {
    body = (
      <StatePanel
        tone="warning"
        icon={<TriangleAlert className="h-5 w-5" aria-hidden="true" />}
        title="Kamera tidak tersedia"
        description="Sumber mungkin sedang offline atau format stream tidak didukung. Coba muat ulang, atau buka sumber resminya."
        action={
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Button size="sm" variant="outline" onClick={retry} className="gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Coba lagi
            </Button>
            {sourceHref ? (
              <Button asChild size="sm" variant="ghost" className="gap-1.5">
                <a href={sourceHref} target="_blank" rel="noopener noreferrer nofollow">
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  Sumber resmi
                </a>
              </Button>
            ) : null}
          </div>
        }
      />
    );
  } else if (!active) {
    body = (
      <button
        type="button"
        onClick={() => undefined}
        className="group relative block h-full w-full"
        aria-label={`Aktifkan pratinjau ${camera.name}`}
      >
        <CameraPoster camera={camera} />
        <span className="absolute inset-0 grid place-items-center bg-background/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
          <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-elevated">
            <Play className="h-3.5 w-3.5" aria-hidden="true" />
            Aktifkan pratinjau
          </span>
        </span>
      </button>
    );
  } else if (isLoading) {
    body = (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-muted/40">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
        <p className="text-xs font-medium text-muted-foreground">
          Menghubungkan ke kamera…
        </p>
      </div>
    );
  } else if (camera.streamType === "hls") {
    body = (
      <>
        <video
          ref={videoRef}
          className="h-full w-full bg-black object-contain"
          muted={isMuted}
          playsInline
          controls={false}
          preload="none"
          aria-label={`Stream ${camera.name}`}
        />
        {needsGesture && mounted ? (
          <button
            type="button"
            onClick={play}
            className="absolute inset-0 grid place-items-center bg-background/50 backdrop-blur-[2px]"
            aria-label="Putar stream"
          >
            <span className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-elevated">
              <Play className="h-3.5 w-3.5" aria-hidden="true" />
              Putar
            </span>
          </button>
        ) : null}
      </>
    );
  } else if (camera.streamType === "youtube") {
    body = youTubeSrc ? (
      <iframe
        src={youTubeSrc}
        title={`Stream YouTube ${camera.name}`}
        className="h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        // allow-same-origin is required by the YouTube player; the URL comes
        // from our validated static dataset, never from user input.
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        onLoad={() => setMediaState("ready")}
        onError={() => setMediaState("error")}
      />
    ) : (
      <StatePanel
        title="URL YouTube tidak valid"
        description="Tautan video tidak dapat disematkan."
        icon={<TriangleAlert className="h-5 w-5" aria-hidden="true" />}
        tone="warning"
      />
    );
  } else if (camera.streamType === "iframe") {
    body = iframeSrc ? (
      <iframe
        src={iframeSrc}
        title={`Konten tersemat ${camera.name}`}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
        // Same reasoning as above: the src is curated, validated and http(s).
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
        onLoad={() => setMediaState("ready")}
        onError={() => setMediaState("error")}
      />
    ) : (
      <StatePanel
        title="Konten tidak dapat disematkan"
        description="URL tersemat tidak valid atau tidak diizinkan."
        icon={<TriangleAlert className="h-5 w-5" aria-hidden="true" />}
        tone="warning"
      />
    );
  } else if (imageSrc) {
    // Covers both `image` (snapshot) and `mjpeg` (multipart stream), which are
    // both rendered by the browser's native <img> pipeline.
    body = (
      // eslint-disable-next-line @next/next/no-img-element -- MJPEG and snapshot endpoints cannot be optimised by next/image
      <img
        key={snapshotKey}
        src={imageSrc}
        alt={`Pratinjau ${camera.name}`}
        className="h-full w-full bg-black object-contain"
        onLoad={() => setMediaState("ready")}
        onError={() => setMediaState("error")}
      />
    );
  } else {
    body = (
      <StatePanel
        title="Stream tidak tersedia"
        description="Kamera ini belum memiliki sumber yang dapat ditampilkan."
        icon={<WifiOff className="h-5 w-5" aria-hidden="true" />}
      />
    );
  }

  /* ---------------- chrome ---------------- */

  return (
    <div
      ref={setContainerRef}
      className={cn(
        "group/player relative isolate aspect-video w-full overflow-hidden rounded-xl border border-border bg-background",
        isFullscreen && "rounded-none border-0",
        className,
      )}
    >
      {body}

      {/* Top-left status chips */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
        {isPlaying ? <LiveBadge /> : null}
        <StreamTypeBadge streamType={camera.streamType} size="sm" />
        {camera.isSample ? <SampleBadge /> : null}
      </div>

      {/* Bottom control bar — revealed on hover/focus, always visible on touch */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-center justify-end gap-1 bg-gradient-to-t from-black/70 to-transparent p-3",
          "opacity-0 transition-opacity duration-200 focus-within:opacity-100 group-hover/player:opacity-100",
          "max-md:opacity-100",
        )}
      >
        {supportsAudio && isPlaying ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                aria-label={isMuted ? "Nyalakan suara" : "Bisukan suara"}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isMuted ? "Nyalakan suara" : "Bisukan suara"}</TooltipContent>
          </Tooltip>
        ) : null}

        {embeddable && camera.streamType === "hls" && state === "error" ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={retry}
                className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                aria-label="Muat ulang stream"
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Muat ulang</TooltipContent>
          </Tooltip>
        ) : null}

        {actions}

        {sourceHref ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
              >
                <a
                  href={sourceHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Buka sumber resmi"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Buka sumber resmi</TooltipContent>
          </Tooltip>
        ) : null}

        {mounted ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="h-8 w-8 text-white hover:bg-white/20 hover:text-white"
                aria-label={isFullscreen ? "Keluar dari layar penuh" : "Layar penuh"}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Maximize2 className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
            </TooltipContent>
          </Tooltip>
        ) : null}
      </div>
    </div>
  );
}
