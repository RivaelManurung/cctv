import { Building2, Camera, MapPinned, Wifi } from "lucide-react";
import type { Metadata } from "next";

import { StatStrip } from "@/components/cctv/cctv-stats";
import { CityList } from "@/components/geo/city-list";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { realCCTVData } from "@/data/cctv";
import { buildMetadata } from "@/lib/metadata";
import { getCitySummaries, getStats } from "@/lib/stats";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Kota",
  description:
    "Jelajahi kamera CCTV publik Indonesia berdasarkan kota. Temukan kamera lalu lintas, pantau status online, dan lihat kota mana saja yang sudah terpantau.",
  path: "/cities",
});

/**
 * City directory.
 *
 * Server Component: it computes the full summary list from the static dataset
 * so the unfiltered directory is present in the initial HTML. `<CityList>` only
 * adds client-side search/filter/sort on top.
 */
export default function CitiesPage() {
  const stats = getStats(realCCTVData);
  const citySummaries = getCitySummaries(realCCTVData).filter(
    (summary) => summary.cameras > 0,
  );

  return (
    <div className="container space-y-8 py-8 sm:py-12">
      <div className="space-y-6">
        <Breadcrumbs
          items={[{ label: "Beranda", href: "/" }, { label: "Kota" }]}
        />
        <div className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            CCTV berdasarkan kota
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {formatNumber(stats.cities)} kota di {formatNumber(stats.provinces)}{" "}
            provinsi Indonesia memiliki kamera CCTV publik yang dapat
            ditelusuri. Pilih kota untuk melihat daftar kamera, status, dan
            sumber resminya.
          </p>
        </div>
      </div>

      <StatStrip
        items={[
          {
            label: "Kota",
            value: stats.cities,
            icon: Building2,
            accent: "bg-primary/10 text-primary",
            hint: "dengan kamera",
          },
          {
            label: "Kamera",
            value: stats.cameras,
            icon: Camera,
            accent: "bg-accent text-accent-foreground",
          },
          {
            label: "Online",
            value: stats.online,
            icon: Wifi,
            accent: "bg-success/10 text-success",
            hint: `${formatNumber(stats.offline)} offline`,
          },
          {
            label: "Provinsi",
            value: stats.provinces,
            icon: MapPinned,
            accent: "bg-muted text-muted-foreground",
            hint: "tercakup",
          },
        ]}
      />

      <CityList cities={citySummaries} />
    </div>
  );
}
