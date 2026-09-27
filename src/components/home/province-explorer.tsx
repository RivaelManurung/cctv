import Link from "next/link";

import { SectionHeader } from "@/components/shared/section-header";
import { realCCTVData } from "@/data/cctv";
import { regions } from "@/data/regions";
import { getProvinceSummaries } from "@/lib/stats";
import { cn, formatNumber } from "@/lib/utils";
import type { ProvinceSummary } from "@/types/cctv";

export interface ProvinceExplorerProps {
  className?: string;
}

/**
 * Province index for the homepage.
 *
 * Every one of the 38 provinces is listed, including the ones that have no
 * public cameras yet. Hiding those would make the map look complete when it is
 * not, so uncovered provinces get the same muted, dashed treatment the province
 * detail page uses for a known coverage gap.
 *
 * Grouped by island region rather than sorted by count, so the section doubles
 * as an overview of where coverage actually sits.
 */
export function ProvinceExplorer({ className }: ProvinceExplorerProps) {
  const summaries = getProvinceSummaries(realCCTVData);

  const byRegion = new Map<string, ProvinceSummary[]>();
  for (const summary of summaries) {
    const bucket = byRegion.get(summary.province.region);
    if (bucket) bucket.push(summary);
    else byRegion.set(summary.province.region, [summary]);
  }

  const covered = summaries.filter((summary) => summary.cameras > 0).length;

  return (
    <section
      className={cn("", className)}
      aria-labelledby="province-explorer-heading"
    >
      <SectionHeader
        id="province-explorer-heading"
        title="Jelajahi berdasarkan provinsi"
        description={`${formatNumber(covered)} dari ${formatNumber(
          summaries.length,
        )} provinsi sudah memiliki kamera publik.`}
      />

      <div className="space-y-7">
        {regions.map((region) => {
          const items = byRegion.get(region.slug);
          if (!items || items.length === 0) return null;

          const cameras = items.reduce(
            (total, summary) => total + summary.cameras,
            0,
          );

          return (
            <div key={region.slug} className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                  {region.name}
                </h3>
                <p className="text-xs tabular-nums text-muted-foreground">
                  {formatNumber(items.length)} provinsi ·{" "}
                  {formatNumber(cameras)} kamera
                </p>
              </div>

              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((summary) => (
                  <li key={summary.province.slug}>
                    <ProvinceTile summary={summary} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/** Compact province link. Uncovered provinces render in the "belum ada" style. */
function ProvinceTile({ summary }: { summary: ProvinceSummary }) {
  const { province, cameras, online } = summary;
  const uncovered = cameras === 0;

  return (
    <Link
      href={`/provinces/${province.slug}`}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2",
        "transition-[border-color,background-color] duration-200",
        uncovered
          ? "border-dashed border-border bg-muted/40 hover:border-primary/30 hover:bg-muted/60"
          : "border-border bg-card hover:border-primary/30 hover:bg-accent/40",
      )}
    >
      <span className="flex min-w-0 items-baseline gap-2">
        <span
          className={cn(
            "truncate text-sm font-medium",
            uncovered ? "text-muted-foreground" : "text-foreground",
          )}
        >
          {province.name}
        </span>
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
          {province.code}
        </span>
      </span>

      {uncovered ? (
        <span className="shrink-0 text-[11px] text-muted-foreground">
          Belum ada kamera
        </span>
      ) : (
        <span className="flex shrink-0 items-baseline gap-2 text-xs tabular-nums">
          <span className="font-medium text-foreground">
            {formatNumber(cameras)}
          </span>
          {online > 0 ? (
            <span className="text-success">{formatNumber(online)} online</span>
          ) : (
            <span className="text-muted-foreground">offline</span>
          )}
        </span>
      )}
    </Link>
  );
}
