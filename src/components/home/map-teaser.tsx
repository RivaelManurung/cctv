import { Building2, Camera, Map as MapIcon, MapPinned } from "lucide-react";
import Link from "next/link";

import { StatStrip } from "@/components/cctv/cctv-stats";
import { Button } from "@/components/ui/button";
import { realCCTVData } from "@/data/cctv";
import { getStats } from "@/lib/stats";
import { cn } from "@/lib/utils";

export interface MapTeaserProps {
  className?: string;
}

/**
 * Full-width invitation to the interactive map.
 *
 * The texture is pure CSS (grid + gradients) — Leaflet is never loaded on the
 * homepage. Figures come from `getStats(realCCTVData)`.
 */
export function MapTeaser({ className }: MapTeaserProps) {
  const stats = getStats(realCCTVData);

  return (
    <section className={cn("", className)} aria-labelledby="map-teaser-heading">
      <div className="relative overflow-hidden rounded-xl border border-border bg-muted/40 px-6 py-10 sm:px-10 sm:py-12">
        {/* Decorative map texture — no tiles, no library. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 -left-12 h-56 w-56 rounded-full bg-accent/80 blur-3xl" />
        </div>

        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <MapPinned className="h-3.5 w-3.5" aria-hidden="true" />
              Peta interaktif
            </span>

            <h2
              id="map-teaser-heading"
              className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              Jelajahi lewat peta
            </h2>
            <p className="mt-3 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
              Lihat sebaran kamera di seluruh Indonesia, telusuri per wilayah,
              dan buka lokasi terdekat langsung dari peta.
            </p>

            <Button asChild size="lg" className="mt-6 gap-2">
              <Link href="/map">
                <MapIcon className="h-4 w-4" aria-hidden="true" />
                Buka peta
              </Link>
            </Button>
          </div>

          <StatStrip
            items={[
              {
                label: "Kamera terpetakan",
                value: stats.cameras,
                icon: Camera,
                accent: "bg-primary/10 text-primary",
              },
              {
                label: "Kota",
                value: stats.cities,
                icon: Building2,
                accent: "bg-primary/10 text-primary",
              },
              {
                label: "Provinsi",
                value: stats.provinces,
                icon: MapIcon,
                accent: "bg-primary/10 text-primary",
              },
            ]}
          />
        </div>
      </div>
    </section>
  );
}
