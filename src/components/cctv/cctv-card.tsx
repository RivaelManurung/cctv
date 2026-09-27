"use client";

import { ExternalLink, Heart, Maximize2, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { CameraPoster } from "@/components/cctv/camera-poster";
import { CCTVPlayer } from "@/components/cctv/cctv-player";
import {
  CCTVStatusBadge,
  SampleBadge,
  StreamTypeBadge,
} from "@/components/cctv/cctv-status";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/data/categories";
import { useFavorites } from "@/hooks/use-library";
import { useMounted } from "@/hooks/use-mounted";
import { getIcon } from "@/lib/icons";
import { cn, sanitizeExternalUrl } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

export interface CCTVCardProps {
  camera: CCTV;
  className?: string;
  /** Above-the-fold cards get eager image loading. */
  priority?: boolean;
}

/**
 * The primary camera card.
 *
 * Deliberately does NOT autoplay: the preview area shows a poster (or the
 * operator thumbnail) and the stream is only attached when the user presses
 * play. This is what keeps a 24-card grid from opening 24 connections.
 */
export function CCTVCard({ camera, className, priority = false }: CCTVCardProps) {
  const [previewActive, setPreviewActive] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const mounted = useMounted();

  const category = getCategory(camera.category);
  const CategoryIcon = getIcon(category?.icon);
  const favorited = mounted && isFavorite(camera.id);
  const canPreview = camera.streamType !== "external" && camera.status !== "offline";
  const sourceHref = sanitizeExternalUrl(camera.sourceUrl);

  return (
    <article
      className={cn(
        "group/card relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground",
        "transition-[box-shadow,transform,border-color] duration-200",
        "hover:border-border/80 hover:shadow-elevated",
        "focus-within:border-primary/40 focus-within:shadow-elevated",
        className,
      )}
    >
      {/* ---------------- Preview ---------------- */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {previewActive && canPreview ? (
          <CCTVPlayer
            camera={camera}
            active
            autoPlay
            className="h-full w-full rounded-none border-0"
          />
        ) : camera.thumbnailUrl ? (
          <Image
            src={camera.thumbnailUrl}
            alt={`Pratinjau ${camera.name}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
            onError={() => undefined}
          />
        ) : (
          <CameraPoster camera={camera} />
        )}

        {/* Status chips */}
        <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-wrap items-center gap-1.5">
          <CCTVStatusBadge status={camera.status} size="sm" />
          {camera.isSample ? <SampleBadge /> : null}
        </div>

        {/* Favourite */}
        <div className="absolute right-2.5 top-2.5">
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
            className={cn(
              "h-8 w-8 rounded-full border border-border/60 bg-background/80 backdrop-blur transition-colors",
              "hover:bg-background",
              favorited && "text-destructive",
            )}
          >
            <Heart
              className={cn("h-4 w-4", favorited && "fill-current")}
              aria-hidden="true"
            />
          </Button>
        </div>

        {/* Centre affordances */}
        {!previewActive ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-background/0 opacity-0 transition-opacity duration-200 group-hover/card:bg-background/35 group-hover/card:opacity-100 focus-within:opacity-100">
            {canPreview ? (
              <Button
                type="button"
                size="sm"
                onClick={() => setPreviewActive(true)}
                className="gap-1.5 shadow-elevated"
              >
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Pratinjau
              </Button>
            ) : null}
            <Button asChild size="sm" variant="secondary" className="gap-1.5 shadow-elevated">
              <Link href={`/cctv/${camera.slug}`}>
                <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
                Detail
              </Link>
            </Button>
          </div>
        ) : null}

        {!previewActive ? (
          <div className="pointer-events-none absolute bottom-2.5 left-2.5">
            <StreamTypeBadge streamType={camera.streamType} size="sm" />
          </div>
        ) : null}
      </div>

      {/* ---------------- Body ---------------- */}
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-sm font-semibold leading-snug tracking-tight">
          <Link
            href={`/cctv/${camera.slug}`}
            className="rounded-sm outline-none transition-colors hover:text-primary"
          >
            {camera.name}
          </Link>
        </h3>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="truncate">{camera.city}</span>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <span className="truncate">{camera.province}</span>
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <Link
            href={`/cctv?category=${camera.category}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-opacity hover:opacity-80",
              category?.accent ?? "bg-muted text-muted-foreground",
            )}
          >
            <CategoryIcon className="h-3 w-3" aria-hidden="true" />
            {category?.labelId ?? camera.category}
          </Link>

          {sourceHref ? (
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="flex min-w-0 items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
              title={`Sumber: ${camera.sourceName}`}
            >
              <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{camera.sourceName}</span>
            </a>
          ) : (
            <span className="truncate text-[11px] text-muted-foreground">
              {camera.sourceName}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
