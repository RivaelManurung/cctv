import { Camera, ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatNumber, getHostname, sanitizeExternalUrl } from "@/lib/utils";
import type { Source, SourceSummary } from "@/types/cctv";

/** Indonesian labels for a source's operator type. Shared with /sources. */
export const OPERATOR_TYPE_LABELS: Record<Source["operatorType"], string> = {
  national: "Nasional",
  provincial: "Provinsi",
  municipal: "Kota/Kabupaten",
  "state-owned": "BUMN",
  other: "Lainnya",
};

/**
 * Attribution card for a camera operator.
 *
 * Deliberately frames the operator as the owner of the feed and this site as
 * a catalogue that links out — never as a host of the video.
 */
export function SourceCard({
  summary,
  className,
  showCameras = true,
}: {
  summary: SourceSummary;
  className?: string;
  showCameras?: boolean;
}) {
  const { source, cameras, online, provinces } = summary;
  const href = sanitizeExternalUrl(source.url);

  return (
    <article
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-5",
        "transition-[border-color,box-shadow] duration-200 hover:border-primary/30 hover:shadow-subtle",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground">
            {source.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{source.coverage}</span>
          </p>
        </div>
        <Badge variant="outline" className="shrink-0 text-[10px] font-medium">
          {OPERATOR_TYPE_LABELS[source.operatorType]}
        </Badge>
      </div>

      <p className="mt-3 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">
        {source.description}
      </p>

      {showCameras ? (
        <dl className="mt-4 flex items-center gap-4 border-t border-border pt-3">
          <div className="flex items-center gap-1.5">
            <Camera className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
            <dt className="sr-only">Jumlah kamera</dt>
            <dd className="text-xs font-semibold tabular-nums text-foreground">
              {formatNumber(cameras)}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Kamera online</dt>
            <dd className="text-xs tabular-nums text-success">
              {formatNumber(online)} online
            </dd>
          </div>
          {provinces.length > 0 ? (
            <div className="min-w-0 flex-1">
              <dt className="sr-only">Cakupan provinsi</dt>
              <dd className="truncate text-right text-[11px] text-muted-foreground">
                {provinces.slice(0, 2).join(", ")}
                {provinces.length > 2 ? ` +${provinces.length - 2}` : ""}
              </dd>
            </div>
          ) : null}
        </dl>
      ) : null}

      {href ? (
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 w-full gap-1.5"
        >
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            aria-label={`Buka portal resmi ${source.name} (${getHostname(href)})`}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">Buka portal resmi</span>
          </a>
        </Button>
      ) : null}
    </article>
  );
}
