import { Compass, MapPin } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { getRegion } from "@/data/regions";
import { cn, formatCoordinates } from "@/lib/utils";
import type { City } from "@/types/cctv";

/* ------------------------------------------------------------------ *
 * GeoStatsRow — a compact row of 2–4 inline stat tiles.
 * Shared by the city and province detail pages.
 * ------------------------------------------------------------------ */

export interface GeoStatItem {
  label: string;
  value: string | number;
  icon?: ReactNode;
  hint?: string;
}

const STAT_COLS: Record<number, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
};

/** Bordered tiles, two per row on mobile, expanding on wider screens. */
export function GeoStatsRow({
  items,
  className,
}: {
  items: GeoStatItem[];
  className?: string;
}) {
  const columns =
    STAT_COLS[Math.min(Math.max(items.length, 2), 4)] ?? "sm:grid-cols-2";

  return (
    <dl className={cn("grid grid-cols-2 gap-3", columns, className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-lg border border-border bg-card px-4 py-3 shadow-subtle"
        >
          <dt className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            {item.icon ? (
              <span className="text-muted-foreground" aria-hidden="true">
                {item.icon}
              </span>
            ) : null}
            {item.label}
          </dt>
          <dd className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-semibold tabular-nums tracking-tight text-foreground">
              {item.value}
            </span>
            {item.hint ? (
              <span className="text-xs text-muted-foreground">{item.hint}</span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ------------------------------------------------------------------ *
 * CityHeader — server-safe heading block for `/cities/{slug}`.
 * ------------------------------------------------------------------ */

export interface CityHeaderProps {
  city: City;
  className?: string;
}

/**
 * Renders the city name as the page `h1`, its province as a link, a region
 * chip and the city-centre coordinates. Contains no client-only APIs so it
 * can be rendered from a Server Component.
 */
export function CityHeader({ city, className }: CityHeaderProps) {
  const region = getRegion(city.region);

  return (
    <header className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {region?.name ?? city.region}
        </span>
        {city.isCapital ? (
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
            Ibu kota provinsi
          </span>
        ) : null}
      </div>

      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {city.name}
      </h1>

      <p className="text-sm text-muted-foreground">
        <Link
          href={`/provinces/${city.provinceSlug}`}
          className="rounded-sm font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {city.province}
        </Link>
      </p>

      <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        <Compass className="h-3.5 w-3.5" aria-hidden="true" />
        {formatCoordinates(city.latitude, city.longitude)}
      </p>
    </header>
  );
}
