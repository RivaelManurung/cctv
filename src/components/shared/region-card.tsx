import { Camera, Building2, MapPinned } from "lucide-react";
import Link from "next/link";

import { getIcon } from "@/lib/icons";
import { cn, formatNumber } from "@/lib/utils";
import type { RegionSummary } from "@/types/cctv";

/**
 * Island-region tile used for the top level of navigation.
 *
 * Shows province / city / camera coverage plus the online count, all derived
 * from the dataset rather than hand-maintained.
 */
export function RegionCard({
  summary,
  className,
}: {
  summary: RegionSummary;
  className?: string;
}) {
  const { region, provinces, cities, cameras, online } = summary;
  const Icon = getIcon(region.icon);

  return (
    <Link
      href={`/cctv?region=${region.slug}`}
      className={cn(
        "group/region relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5",
        "transition-[border-color,box-shadow] duration-200",
        "hover:border-primary/30 hover:shadow-elevated focus-visible:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <span className="rounded-full border border-border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {formatNumber(provinces)} provinsi
        </span>
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">
        {region.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {region.description}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        <div>
          <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Camera className="h-3 w-3" aria-hidden="true" />
            Kamera
          </dt>
          <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {formatNumber(cameras)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <Building2 className="h-3 w-3" aria-hidden="true" />
            Kota
          </dt>
          <dd className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {formatNumber(cities)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
            <MapPinned className="h-3 w-3" aria-hidden="true" />
            Online
          </dt>
          <dd className="mt-1 text-sm font-semibold tabular-nums text-success">
            {formatNumber(online)}
          </dd>
        </div>
      </dl>
    </Link>
  );
}
