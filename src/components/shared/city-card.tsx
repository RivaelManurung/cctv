import { ArrowUpRight, Building2, Camera } from "lucide-react";
import Link from "next/link";

import { cn, formatNumber } from "@/lib/utils";
import type { CitySummary } from "@/types/cctv";

/** City tile showing how much camera coverage it has. */
export function CityCard({
  summary,
  className,
}: {
  summary: CitySummary;
  className?: string;
}) {
  const { city, cameras, online } = summary;

  return (
    <Link
      href={`/cities/${city.slug}`}
      className={cn(
        "group/city relative flex items-center gap-3 rounded-xl border border-border bg-card p-4",
        "transition-[border-color,box-shadow,transform] duration-200",
        "hover:border-primary/30 hover:shadow-elevated focus-visible:shadow-elevated",
        className,
      )}
    >
      <span
        className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover/city:bg-primary/10 group-hover/city:text-primary"
        aria-hidden="true"
      >
        <Building2 className="h-4 w-4" strokeWidth={1.75} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1">
          <span className="truncate text-sm font-semibold text-foreground">
            {city.name}
          </span>
          <ArrowUpRight
            className="h-3 w-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/city:opacity-100"
            aria-hidden="true"
          />
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {city.province}
        </span>
      </span>

      <span className="shrink-0 text-right">
        <span className="flex items-center justify-end gap-1 text-sm font-semibold tabular-nums text-foreground">
          <Camera className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
          {formatNumber(cameras)}
        </span>
        <span className="mt-0.5 block text-[11px] text-muted-foreground">
          {formatNumber(online)} online
        </span>
      </span>
    </Link>
  );
}
