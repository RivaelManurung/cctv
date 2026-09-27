import type { Metadata } from "next";
import { Suspense } from "react";

import { CCTVMapView } from "@/components/cctv/cctv-map-view";
import { MapFilterBar } from "@/components/map/map-controls";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { realCCTVData } from "@/data/cctv";
import {
  filterCCTV,
  parseFilters,
  searchCCTV,
  type RawSearchParams,
} from "@/lib/cctv-query";
import { buildMetadata } from "@/lib/metadata";
import { getStats } from "@/lib/stats";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Peta CCTV Indonesia",
  description:
    "Jelajahi kamera CCTV publik di seluruh Indonesia melalui peta interaktif. Filter berdasarkan provinsi, kota, kategori, dan status kamera lalu klik penanda untuk melihat detailnya.",
  path: "/map",
  keywords: [
    "peta cctv indonesia",
    "peta kamera lalu lintas",
    "cctv online peta",
    "kamera lalu lintas indonesia",
    "atcs peta",
  ],
});

interface MapPageProps {
  searchParams: Promise<RawSearchParams>;
}

/** Static summary tiles shown above the map. */
function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-subtle">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-xl font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const raw = await searchParams;
  const filters = parseFilters(raw);
  // `camera` is a deep-link focus target, not a filter — see `parseFilters`.
  const focusCameraId = typeof raw.camera === "string" ? raw.camera : undefined;

  const filtered = searchCCTV(filterCCTV(realCCTVData, filters), filters.q);
  const dataset = getStats(realCCTVData);

  const online = filtered.filter((camera) => camera.status === "online").length;
  const provinceCount = new Set(filtered.map((camera) => camera.provinceSlug)).size;
  const cityCount = new Set(filtered.map((camera) => camera.citySlug)).size;

  return (
    <div className="container space-y-5 py-6">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Peta" }]}
      />

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Peta CCTV Indonesia
        </h1>
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground">
          Telusuri {formatNumber(dataset.cameras)} kamera CCTV publik dari{" "}
          {formatNumber(dataset.provinces)} provinsi di seluruh Indonesia.
          Geser dan perbesar peta, lalu klik penanda untuk melihat detail lokasi
          dan tautan resmi operatornya.
        </p>
      </header>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Kamera ditampilkan" value={formatNumber(filtered.length)} />
        <StatTile label="Online" value={formatNumber(online)} />
        <StatTile label="Provinsi" value={formatNumber(provinceCount)} />
        <StatTile label="Kota" value={formatNumber(cityCount)} />
      </dl>

      <Suspense
        fallback={
          <div className="h-[4.75rem] rounded-xl border border-border bg-card" />
        }
      >
        <MapFilterBar />
      </Suspense>

      <CCTVMapView cameras={filtered} focusCameraId={focusCameraId} />
    </div>
  );
}
