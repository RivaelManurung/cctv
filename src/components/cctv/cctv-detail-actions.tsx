"use client";

import { ExternalLink, Heart, Share2 } from "lucide-react";

import { CCTVShare } from "@/components/cctv/cctv-share";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/hooks/use-library";
import { useMounted } from "@/hooks/use-mounted";
import { cn, sanitizeExternalUrl } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

/**
 * Controls injected into the player's `actions` slot.
 *
 * They sit on top of the video chrome, so they use the white-on-dark styling
 * from `CCTVPlayer` rather than the semantic tokens. The favourite state is
 * gated behind `useMounted()` so the server render (always "not favourited")
 * matches the first client render — the persisted store only rehydrates after
 * mount.
 */
export function CCTVDetailActions({ camera }: { camera: CCTV }) {
  const mounted = useMounted();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = mounted && isFavorite(camera.id);

  const overlayButton =
    "h-8 w-8 text-white hover:bg-white/20 hover:text-white";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip key="favorite">
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => toggleFavorite(camera.id, camera.name)}
            aria-pressed={favorited}
            aria-label={
              favorited
                ? `Hapus ${camera.name} dari favorit`
                : `Simpan ${camera.name} ke favorit`
            }
            className={overlayButton}
          >
            <Heart
              className={cn("h-4 w-4", favorited && "fill-current")}
              aria-hidden="true"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {favorited ? "Hapus dari favorit" : "Simpan ke favorit"}
        </TooltipContent>
      </Tooltip>

      <CCTVShare
        camera={camera}
        trigger={
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={overlayButton}
            aria-label={`Bagikan ${camera.name}`}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        }
      />
    </TooltipProvider>
  );
}

/**
 * Larger, non-overlay action row rendered underneath the player.
 *
 * Unlike {@link CCTVDetailActions} this one uses the standard semantic tokens,
 * because it sits on the page background rather than on video chrome.
 */
export function CCTVDetailActionBar({
  camera,
  className,
}: {
  camera: CCTV;
  className?: string;
}) {
  const mounted = useMounted();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = mounted && isFavorite(camera.id);
  const sourceHref = sanitizeExternalUrl(camera.sourceUrl);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        type="button"
        variant={favorited ? "default" : "outline"}
        size="sm"
        onClick={() => toggleFavorite(camera.id, camera.name)}
        aria-pressed={favorited}
        className="gap-1.5"
      >
        <Heart
          className={cn("h-4 w-4", favorited && "fill-current")}
          aria-hidden="true"
        />
        {favorited ? "Tersimpan" : "Favorit"}
      </Button>

      <CCTVShare
        camera={camera}
        trigger={
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            aria-label={`Bagikan ${camera.name}`}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Bagikan
          </Button>
        }
      />

      {sourceHref ? (
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <a
            href={sourceHref}
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Buka sumber
          </a>
        </Button>
      ) : null}
    </div>
  );
}
