import { Activity, Building2, Camera, Map as MapIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { realCCTVData } from "@/data/cctv";
import { getStats } from "@/lib/stats";
import { cn, formatNumber } from "@/lib/utils";

export interface HomeStatsProps {
  className?: string;
}

interface StatTile {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: string;
  hint: string;
  live?: boolean;
}

/**
 * Headline figures for the homepage.
 *
 * Every value is derived from `getStats(realCCTVData)` — sample cameras are
 * excluded and nothing here is hardcoded.
 */
export function HomeStats({ className }: HomeStatsProps) {
  const stats = getStats(realCCTVData);

  const tiles: StatTile[] = [
    {
      label: "Kamera",
      value: stats.cameras,
      icon: Camera,
      accent: "border-t-primary/60",
      hint: "Kamera publik terdaftar",
    },
    {
      label: "Kota",
      value: stats.cities,
      icon: Building2,
      accent: "border-t-primary/60",
      hint: "Kota dan kabupaten",
    },
    {
      label: "Provinsi",
      value: stats.provinces,
      icon: MapIcon,
      accent: "border-t-primary/60",
      hint: "Lintas kepulauan",
    },
    {
      label: "Online",
      value: stats.online,
      icon: Activity,
      accent: "border-t-success/60",
      hint: "Status terakhir terverifikasi",
      live: true,
    },
  ];

  return (
    <section className={cn("", className)} aria-label="Statistik CCTV">
      <dl className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <div
              key={tile.label}
              className={cn(
                "relative overflow-hidden rounded-xl border border-border border-t-2 bg-card p-4 sm:p-5",
                tile.accent,
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {tile.live ? (
                    <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
                    </span>
                  ) : null}
                  {tile.label}
                </dt>
                <Icon
                  className="h-4 w-4 shrink-0 text-muted-foreground/70"
                  aria-hidden="true"
                />
              </div>
              <dd className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-foreground sm:text-4xl">
                {formatNumber(tile.value)}
              </dd>
              <dd className="mt-1 text-xs text-muted-foreground">{tile.hint}</dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
        <span>
          Menjangkau {formatNumber(stats.regions)} wilayah kepulauan
        </span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span>{formatNumber(stats.offline)} offline</span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span>{formatNumber(stats.unknown)} belum terverifikasi</span>
        <span aria-hidden="true" className="text-border">
          ·
        </span>
        <span>{formatNumber(stats.sources)} sumber resmi</span>
      </p>
    </section>
  );
}
