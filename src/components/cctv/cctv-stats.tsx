import {
  Building2,
  Camera,
  Map as MapIcon,
  Wifi,
  type LucideIcon,
} from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";
import type { CCTVStats as CCTVStatsShape } from "@/types/cctv";

export interface StatItem {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  /** Small secondary line under the value. */
  hint?: string;
  /** Tailwind classes for the icon chip. */
  accent?: string;
}

/** A single metric tile. */
export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent,
  className,
}: StatItem & { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-4",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-2xl font-semibold leading-none tabular-nums tracking-tight text-foreground sm:text-[28px]">
            {typeof value === "number" ? formatNumber(value) : value}
          </p>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {label}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
              accent ?? "bg-muted text-muted-foreground",
            )}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
        ) : null}
      </div>
    </div>
  );
}

/** Horizontal row of metric tiles. */
export function StatStrip({
  items,
  className,
}: {
  items: StatItem[];
  className?: string;
}) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4",
        items.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3",
        className,
      )}
    >
      {items.map((item) => (
        <StatCard key={item.label} {...item} />
      ))}
    </dl>
  );
}

/**
 * The standard four-metric overview used on the homepage and explorer.
 *
 * `stats` should already be scoped to whatever the page is showing, so a city
 * page can reuse this with that city's subset.
 */
export function CCTVStats({
  stats,
  className,
}: {
  stats: CCTVStatsShape;
  className?: string;
}) {
  return (
    <StatStrip
      className={className}
      items={[
        {
          label: "Kamera",
          value: stats.cameras,
          icon: Camera,
          accent: "bg-primary/10 text-primary",
          hint: `${formatNumber(stats.featured)} unggulan`,
        },
        {
          label: "Kota",
          value: stats.cities,
          icon: Building2,
          accent: "bg-cat-road/10 text-cat-road",
        },
        {
          label: "Provinsi",
          value: stats.provinces,
          icon: MapIcon,
          accent: "bg-cat-intersection/10 text-cat-intersection",
          hint: `${formatNumber(stats.regions)} wilayah`,
        },
        {
          label: "Online",
          value: stats.online,
          icon: Wifi,
          accent: "bg-success/10 text-success",
          hint: `${formatNumber(stats.offline)} offline`,
        },
      ]}
    />
  );
}
