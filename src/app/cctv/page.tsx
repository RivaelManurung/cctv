import { Building2, Camera, Map as MapIcon, Wifi } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import {
  ActiveFilterChips,
  CCTVFilters,
  FilterSheet,
} from "@/components/cctv/cctv-filters";
import { PaginationBar } from "@/components/cctv/cctv-pagination-bar";
import { CCTVResults } from "@/components/cctv/cctv-results";
import { CCTVSearch, SearchResultCount } from "@/components/cctv/cctv-search";
import { SortSelect } from "@/components/cctv/cctv-sort";
import { StatStrip } from "@/components/cctv/cctv-stats";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { realCCTVData } from "@/data/cctv";
import {
  countActiveFilters,
  parseFilters,
  queryCCTV,
  type RawSearchParams,
} from "@/lib/cctv-query";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { getStats } from "@/lib/stats";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Jelajahi CCTV",
  description:
    "Jelajahi kamera CCTV publik di berbagai kota dan provinsi Indonesia. Saring berdasarkan wilayah, kategori, status, dan sumber resmi operator.",
  path: "/cctv",
  keywords: [
    "cctv indonesia",
    "kamera lalu lintas",
    "cctv publik",
    "jelajahi cctv",
    "atcs",
    "kamera kota",
  ],
});

const TRAIL = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi CCTV" },
];

/**
 * The explorer.
 *
 * Deliberately a Server Component: the filter state comes from the URL, the
 * filtered slice is rendered on the server (so it is crawlable and there is no
 * empty first paint), and only the controls are client components.
 */
export default async function CCTVExplorerPage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const { cameras, total, page, pageCount } = queryCCTV(realCCTVData, filters);
  const stats = getStats(realCCTVData);
  const activeCount = countActiveFilters(filters);

  const jsonLd = breadcrumbJsonLd([
    { name: "Beranda", url: absoluteUrl("/") },
    { name: "Jelajahi CCTV", url: absoluteUrl("/cctv") },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <div className="container py-8 lg:py-10">
        <Breadcrumbs items={TRAIL} className="mb-4" />

        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Jelajahi CCTV
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Telusuri {formatNumber(stats.cameras)} kamera publik dari{" "}
            {formatNumber(stats.sources)} sumber resmi di{" "}
            {formatNumber(stats.cities)} kota dan{" "}
            {formatNumber(stats.provinces)} provinsi. Setiap kamera menautkan ke
            halaman resmi operatornya.
          </p>
        </header>

        <StatStrip
          className="mb-8"
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
              accent: "bg-muted text-muted-foreground",
            },
            {
              label: "Provinsi",
              value: stats.provinces,
              icon: MapIcon,
              accent: "bg-muted text-muted-foreground",
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

        <div className="flex items-start gap-8">
          <Sidebar>
            <CCTVFilters filters={filters} activeCount={activeCount} />
          </Sidebar>

          <div className="min-w-0 flex-1">
            <div className="mb-5 space-y-3">
              <CCTVSearch value={filters.q} />

              <div className="flex flex-wrap items-center gap-3">
                <FilterSheet filters={filters} activeCount={activeCount} />
                <SearchResultCount
                  count={total}
                  query={filters.q}
                  className="order-last w-full sm:order-none sm:w-auto"
                />
                <SortSelect value={filters.sort} className="ml-auto" />
              </div>

              <ActiveFilterChips filters={filters} />
            </div>

            {total === 0 ? (
              <CCTVEmptyState
                title="Tidak ada CCTV yang cocok"
                description="Coba ubah kata kunci atau hapus beberapa filter untuk memperluas hasil pencarian."
                action={
                  <Button asChild variant="outline">
                    <Link href="/cctv">Reset filter</Link>
                  </Button>
                }
              />
            ) : (
              <>
                <CCTVResults cameras={cameras} priorityCount={4} />
                <PaginationBar
                  className="mt-8"
                  page={page}
                  pageCount={pageCount}
                  total={total}
                  shown={cameras.length}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
