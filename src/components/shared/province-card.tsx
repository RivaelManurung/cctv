import { Building2, Camera, ChevronRight, MapPinned } from "lucide-react";
import Link from "next/link";

import { getRegion } from "@/data/regions";
import { cn, formatNumber } from "@/lib/utils";
import type { ProvinceSummary } from "@/types/cctv";

/** Province tile used on region cross-links and province listings. */
export function ProvinceCard({
  summary,
  className,
}: {
  summary: ProvinceSummary;
  className?: string;
}) {
  const { province, cities, cameras, online } = summary;
  const region = getRegion(province.region);

  return (
    <Link
      href={`/provinces/${province.slug}`}
      className={cn(
        "group/province flex flex-col rounded-xl border border-border bg-card p-5",
        "transition-[border-color,box-shadow] duration-200",
        "hover:border-primary/30 hover:shadow-elevated focus-visible:shadow-elevated",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-1 text-sm font-semibold tracking-tight text-foreground">
            <span className="truncate">{province.name}</span>
            <ChevronRight
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover/province:translate-x-0.5"
              aria-hidden="true"
            />
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {region?.name ?? province.region} · {province.capital}
          </p>
        </div>
        <span className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {province.code}
        </span>
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
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
