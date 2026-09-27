"use client";

import { ExternalLink, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

import { CameraPoster } from "@/components/cctv/camera-poster";
import { CCTVStatusBadge, SampleBadge } from "@/components/cctv/cctv-status";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/data/categories";
import { useFavorites } from "@/hooks/use-library";
import { useMounted } from "@/hooks/use-mounted";
import { getIcon } from "@/lib/icons";
import { cn, sanitizeExternalUrl, truncate } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

/** Dense, information-first row layout — an alternative to the card grid. */
export const CCTVList = memo(function CCTVList({
  cameras,
  className,
}: {
  cameras: CCTV[];
  className?: string;
}) {
  return (
    <ul className={cn("divide-y divide-border overflow-hidden rounded-xl border border-border", className)}>
      {cameras.map((camera) => (
        <CCTVListRow key={camera.id} camera={camera} />
      ))}
    </ul>
  );
});

function CCTVListRow({ camera }: { camera: CCTV }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const mounted = useMounted();

  const category = getCategory(camera.category);
  const CategoryIcon = getIcon(category?.icon);
  const favorited = mounted && isFavorite(camera.id);
  const sourceHref = sanitizeExternalUrl(camera.sourceUrl);

  return (
    <li className="group/row flex items-center gap-3 bg-card p-3 transition-colors hover:bg-accent/40 sm:gap-4">
      <Link
        href={`/cctv/${camera.slug}`}
        className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-border sm:h-16 sm:w-28"
        tabIndex={-1}
        aria-hidden="true"
      >
        <CameraPoster camera={camera} compact />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-semibold">
            <Link
              href={`/cctv/${camera.slug}`}
              className="rounded-sm outline-none transition-colors hover:text-primary"
            >
              {camera.name}
            </Link>
          </h3>
          {camera.isSample ? <SampleBadge /> : null}
        </div>

        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {camera.city}, {camera.province}
          </span>
        </p>

        {camera.description ? (
          <p className="mt-1 hidden text-xs text-muted-foreground sm:line-clamp-1">
            {truncate(camera.description, 120)}
          </p>
        ) : null}
      </div>

      <div className="hidden shrink-0 items-center gap-3 md:flex">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
            category?.accent ?? "bg-muted text-muted-foreground",
          )}
        >
          <CategoryIcon className="h-3 w-3" aria-hidden="true" />
          {category?.labelId ?? camera.category}
        </span>
        <span className="max-w-[140px] truncate text-[11px] text-muted-foreground">
          {camera.sourceName}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <CCTVStatusBadge status={camera.status} size="sm" showLabel={false} />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(camera.id, camera.name)}
          aria-pressed={favorited}
          aria-label={favorited ? "Hapus dari favorit" : "Simpan ke favorit"}
          className={cn("h-8 w-8", favorited && "text-destructive")}
        >
          <Heart className={cn("h-4 w-4", favorited && "fill-current")} aria-hidden="true" />
        </Button>

        {sourceHref ? (
          <Button asChild variant="ghost" size="icon" className="hidden h-8 w-8 sm:inline-flex">
            <a
              href={sourceHref}
              target="_blank"
              rel="noopener noreferrer nofollow"
              aria-label={`Buka sumber resmi ${camera.sourceName}`}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        ) : null}
      </div>
    </li>
  );
}
