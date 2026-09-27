import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import { CCTVResults } from "@/components/cctv/cctv-results";
import { GeoStatsRow } from "@/components/geo/city-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { CityCard } from "@/components/shared/city-card";
import { ProvinceCard } from "@/components/shared/province-card";
import { SectionHeader } from "@/components/shared/section-header";
import { SourceCard } from "@/components/shared/source-card";
import { Button } from "@/components/ui/button";
import { getCitiesByProvince } from "@/data/cities";
import { realCCTVData } from "@/data/cctv";
import { getProvince, getProvincesByRegion, provinces } from "@/data/provinces";
import { getRegion } from "@/data/regions";
import { getSourcesByProvince } from "@/data/sources";
import { sortCCTV } from "@/lib/cctv-query";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { buildProvinceMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import {
  getCitySummaries,
  getProvinceSummaries,
  getSourceSummaries,
  getStats,
} from "@/lib/stats";
import { formatNumber } from "@/lib/utils";
import type { ProvinceSummary } from "@/types/cctv";

interface ProvincePageProps {
  params: Promise<{ provinceSlug: string }>;
}

/** How many cameras the "populer" strip shows before the "see all" link. */
const TOP_CAMERA_LIMIT = 12;

/**
 * Every province gets a page, including the ones with no public cameras yet —
 * the homepage province index links all 38, and this page has a designed empty
 * state that makes the coverage gap explicit rather than hiding it.
 *
 * `dynamicParams = false` turns an unknown slug into a real 404 instead of a
 * soft-404: without it the route streams a 200 shell from `loading.tsx` before
 * `notFound()` can run.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return provinces.map((province) => ({ provinceSlug: province.slug }));
}

export async function generateMetadata({
  params,
}: ProvincePageProps): Promise<Metadata> {
  const { provinceSlug } = await params;
  const province = getProvince(provinceSlug);
  if (!province) return {};

  const count = realCCTVData.filter(
    (camera) => camera.provinceSlug === province.slug,
  ).length;

  return buildProvinceMetadata(province, count);
}

export default async function ProvincePage({ params }: ProvincePageProps) {
  const { provinceSlug } = await params;
  const province = getProvince(provinceSlug);
  if (!province) notFound();

  const region = getRegion(province.region);
  const provinceCameras = realCCTVData.filter(
    (camera) => camera.provinceSlug === province.slug,
  );
  const stats = getStats(provinceCameras);
  const topCameras = sortCCTV(provinceCameras, "recommended").slice(
    0,
    TOP_CAMERA_LIMIT,
  );

  // Cities in this province that have coverage, vs. those still waiting.
  const citySummaries = getCitySummaries(realCCTVData).filter(
    (summary) => summary.city.provinceSlug === province.slug,
  );
  const citiesWithCameras = citySummaries.filter(
    (summary) => summary.cameras > 0,
  );
  const coveredSlugs = new Set(
    citiesWithCameras.map((summary) => summary.city.slug),
  );
  const citiesWithoutCameras = getCitiesByProvince(province.slug).filter(
    (city) => !coveredSlugs.has(city.slug),
  );

  // Sources declared for the province, unioned with the operators that actually
  // have cameras here, so the section reflects real coverage rather than an
  // empty list for provinces whose cameras come from national operators.
  const declaredSourceSlugs = new Set(
    getSourcesByProvince(province.slug).map((source) => source.slug),
  );
  const presentSourceSlugs = new Set(
    provinceCameras.map((camera) => camera.sourceSlug),
  );
  const provinceSources = getSourceSummaries(realCCTVData).filter(
    (summary) =>
      declaredSourceSlugs.has(summary.source.slug) ||
      presentSourceSlugs.has(summary.source.slug),
  );

  // Other provinces in the same island region, for lateral navigation.
  const provinceSummaryBySlug = new Map<string, ProvinceSummary>(
    getProvinceSummaries(realCCTVData).map((summary) => [
      summary.province.slug,
      summary,
    ]),
  );
  const otherProvinceSummaries = getProvincesByRegion(province.region)
    .filter((candidate) => candidate.slug !== province.slug)
    .map((candidate) => provinceSummaryBySlug.get(candidate.slug))
    .filter((summary): summary is ProvinceSummary => summary !== undefined);

  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: province.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Beranda", url: absoluteUrl("/") },
              {
                name: province.name,
                url: absoluteUrl(`/provinces/${province.slug}`),
              },
            ]),
          ),
        }}
      />

      <div className="container space-y-10 py-8 sm:py-12">
        <div className="space-y-6">
          <Breadcrumbs items={breadcrumbs} />

          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {region?.name ?? province.region}
              </span>
              <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2.5 py-1 font-mono text-xs text-muted-foreground">
                Kode BPS {province.code}
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {province.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Ibu kota {province.capital} · Wilayah{" "}
              {region?.name ?? province.region}
            </p>
          </div>

          <GeoStatsRow
            items={[
              { label: "Kamera CCTV", value: formatNumber(stats.cameras) },
              { label: "Kota", value: formatNumber(stats.cities) },
              { label: "Online", value: formatNumber(stats.online) },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="gap-1.5">
              <Link href={`/map?province=${province.slug}`}>
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Buka di peta
              </Link>
            </Button>
            {provinceCameras.length > 0 ? (
              <Button asChild variant="outline" className="gap-1.5">
                <Link href={`/cctv?province=${province.slug}`}>
                  Jelajahi semua kamera
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>

        {/* ----------------------- Cities in this province ----------------------- */}
        <section aria-labelledby="kota-provinsi">
          <SectionHeader
            id="kota-provinsi"
            title={`Kota di ${province.name}`}
            description={
              citiesWithCameras.length > 0
                ? `${formatNumber(citiesWithCameras.length)} kota sudah memiliki kamera publik.`
                : "Belum ada kota dengan kamera publik di provinsi ini."
            }
          />

          {citiesWithCameras.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {citiesWithCameras.map((summary) => (
                <CityCard key={summary.city.slug} summary={summary} />
              ))}
            </div>
          ) : null}

          {citiesWithoutCameras.length > 0 ? (
            <div className="mt-5 space-y-2">
              <h3 className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Belum ada kamera
              </h3>
              <ul className="flex flex-wrap gap-2">
                {citiesWithoutCameras.map((city) => (
                  <li key={city.slug}>
                    <span
                      className="inline-flex items-center rounded-full border border-dashed border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground"
                      title={`${city.name} — belum ada kamera`}
                    >
                      {city.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        {/* --------------------------- Cameras / empty --------------------------- */}
        {provinceCameras.length > 0 ? (
          <section aria-labelledby="kamera-provinsi">
            <SectionHeader
              id="kamera-provinsi"
              title={`CCTV di ${province.name}`}
              description="Kamera pilihan, diurutkan berdasarkan kelengkapan informasi dan status."
              action={
                <Button asChild variant="ghost" size="sm" className="gap-1.5">
                  <Link href={`/cctv?province=${province.slug}`}>
                    Lihat semua
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
            <CCTVResults cameras={topCameras} priorityCount={4} />
          </section>
        ) : (
          <CCTVEmptyState
            title="Belum ada kamera di provinsi ini"
            description={`Kami belum menemukan kamera CCTV publik untuk ${province.name}. Struktur wilayahnya tetap kami tampilkan agar cakupan yang belum tersedia terlihat jelas.`}
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/cities">Lihat kota lain</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/cctv">Jelajahi semua CCTV</Link>
                </Button>
              </div>
            }
          />
        )}

        {/* ----------------------------- Sources ----------------------------- */}
        {provinceSources.length > 0 ? (
          <section aria-labelledby="sumber-provinsi">
            <SectionHeader
              id="sumber-provinsi"
              title={`Sumber resmi di ${province.name}`}
              description="Operator dan instansi yang menyediakan kamera di provinsi ini."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {provinceSources.map((summary) => (
                <SourceCard
                  key={summary.source.slug}
                  summary={summary}
                  showCameras
                />
              ))}
            </div>
          </section>
        ) : null}

        {/* ------------------------- Other provinces ------------------------- */}
        {otherProvinceSummaries.length > 0 ? (
          <section aria-labelledby="wilayah-lain">
            <SectionHeader
              id="wilayah-lain"
              title={`Wilayah lain di ${region?.name ?? province.region}`}
              description="Provinsi lain dalam gugusan pulau yang sama."
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {otherProvinceSummaries.map((summary) => (
                <ProvinceCard key={summary.province.slug} summary={summary} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
