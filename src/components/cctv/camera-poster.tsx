import { Camera, MapPin } from "lucide-react";

import { cn, hashString } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

/**
 * Deterministic poster for cameras that have no thumbnail.
 *
 * Renders a restrained gradient + the camera glyph + the location, so a grid
 * never shows an empty grey box. The gradient is derived from the camera id,
 * which keeps it stable between server and client renders.
 */

/**
 * Tints are drawn from the shared categorical accent palette (`--cat-*`, see
 * `globals.css`) rather than raw Tailwind hues, so the poster tracks the theme
 * in both light and dark mode without per-tint `dark:` overrides.
 */
const GRADIENTS = [
  "from-cat-road/20 via-cat-road/5 to-transparent",
  "from-cat-intersection/20 via-cat-intersection/5 to-transparent",
  "from-cat-highway/20 via-cat-highway/5 to-transparent",
  "from-cat-traffic/20 via-cat-traffic/5 to-transparent",
  "from-cat-public-space/20 via-cat-public-space/5 to-transparent",
  "from-cat-port/20 via-cat-port/5 to-transparent",
  "from-cat-airport/20 via-cat-airport/5 to-transparent",
  "from-cat-other/20 via-cat-other/5 to-transparent",
];

export function CameraPoster({
  camera,
  className,
  compact = false,
}: {
  camera: CCTV;
  className?: string;
  compact?: boolean;
}) {
  const gradient = GRADIENTS[hashString(camera.id) % GRADIENTS.length];

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-muted",
        className,
      )}
      aria-hidden="true"
    >
      {/* Subtle topographic grid, drawn with gradients so there is no asset cost. */}
      <div className="absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />

      <div className="relative flex flex-col items-center gap-2 px-4 text-center">
        <span
          className={cn(
            "grid place-items-center rounded-full border border-border bg-background/80 text-muted-foreground backdrop-blur",
            compact ? "h-9 w-9" : "h-12 w-12",
          )}
        >
          <Camera
            className={compact ? "h-4 w-4" : "h-5 w-5"}
            strokeWidth={1.75}
          />
        </span>
        {!compact ? (
          <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {camera.city}
          </span>
        ) : null}
      </div>
    </div>
  );
}
