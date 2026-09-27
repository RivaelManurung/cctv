import { CircleHelp, ExternalLink, Wifi, WifiOff } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CameraStatus, StreamType } from "@/types/cctv";

const STATUS_CONFIG: Record<
  CameraStatus,
  { label: string; icon: typeof Wifi; dot: string; chip: string }
> = {
  online: {
    label: "Online",
    icon: Wifi,
    dot: "bg-success",
    chip: "border-success/30 bg-success/10 text-success",
  },
  offline: {
    label: "Offline",
    icon: WifiOff,
    dot: "bg-destructive",
    chip: "border-destructive/30 bg-destructive/10 text-destructive",
  },
  unknown: {
    label: "Tidak diketahui",
    icon: CircleHelp,
    dot: "bg-warning",
    chip: "border-warning/30 bg-warning/10 text-warning",
  },
};

/** Online / offline / unknown indicator. */
export function CCTVStatusBadge({
  status,
  className,
  showLabel = true,
  size = "default",
}: {
  status: CameraStatus;
  className?: string;
  showLabel?: boolean;
  size?: "default" | "sm";
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs",
        config.chip,
        className,
      )}
      title={`Status: ${config.label}`}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
        {status === "online" ? (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
              config.dot,
            )}
          />
        ) : null}
      </span>
      {showLabel ? config.label : <span className="sr-only">{config.label}</span>}
      {!showLabel ? <Icon className="hidden" aria-hidden="true" /> : null}
    </span>
  );
}

/** The "● LIVE" pill shown on a playing stream. */
export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-destructive px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-destructive-foreground shadow-subtle",
        className,
      )}
    >
      <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 rounded-full bg-destructive-foreground" />
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-destructive-foreground opacity-75" />
      </span>
      Live
    </span>
  );
}

const STREAM_LABELS: Record<StreamType, string> = {
  hls: "HLS",
  mjpeg: "MJPEG",
  iframe: "Embed",
  image: "Snapshot",
  youtube: "YouTube",
  external: "Sumber Resmi",
};

/**
 * Shows how a camera is presented. "Sumber Resmi" is deliberately distinct
 * from the embeddable types so a link is never mistaken for a live embed.
 */
export function StreamTypeBadge({
  streamType,
  className,
  size = "default",
}: {
  streamType: StreamType;
  className?: string;
  size?: "default" | "sm";
}) {
  const isExternal = streamType === "external";
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-border/80 bg-background/80 font-medium backdrop-blur",
        size === "sm" ? "px-1.5 py-0 text-[10px]" : "text-xs",
        isExternal ? "text-muted-foreground" : "text-foreground",
        className,
      )}
    >
      {isExternal ? (
        <ExternalLink className="h-3 w-3" aria-hidden="true" />
      ) : null}
      {STREAM_LABELS[streamType]}
    </Badge>
  );
}

/** Marks a demonstration entry so it is never mistaken for real CCTV. */
export function SampleBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-warning/40 bg-warning/10 text-[10px] font-semibold uppercase tracking-wide text-warning",
        className,
      )}
      title="Entri demonstrasi — bukan CCTV Indonesia"
    >
      Contoh
    </Badge>
  );
}
