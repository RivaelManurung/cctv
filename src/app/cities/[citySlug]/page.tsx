import { ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import { CCTVGrid } from "@/components/cctv/cctv-grid";
import { CCTVResults } from "@/components/cctv/cctv-results";
import { CityHeader, GeoStatsRow } from "@/components/geo/city-header";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SectionHeader } from "@/components/shared/section-header";
import { SourceCard } from "@/components/shared/source-card";
import { Button } from "@/components/ui/button";
import { cities, getCity } from "@/data/cities";
import { realCCTVData } from "@/data/cctv";
import { getProvince } from "@/data/provinces";
import { sortCCTV } from "@/lib/cctv-query";
import { formatDistanceKm, getNearbyCitiesWithCameras } from "@/lib/geo";
import { breadcrumbJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { buildCityMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { getSourceSummaries, getStats } from "@/lib/stats";
import { cameraCount, formatNumber } from "@/lib/utils";

interface CityPageProps {
  params: Promise<{ citySlug: string }>;
}

/** How many cameras the "populer" strip shows before the "see all" link. */
const TOP_CAMERA_LIMIT = 12;
/** How many neighbouring cities are listed. */
const NEARBY_LIMIT = 4;
/** How many same-province cameras the cross-link grid shows. */
const OTHER_CITY_LIMIT = 4;

/**
 * Every known city gets a page, even the ones still waiting for their first
 * camera — the page has a designed empty state for exactly that case, and §4 of
 * the brief wants the full region structure navigable ahead of coverage.
 *
 * `dynamicParams = false` then makes an unknown slug a genuine 404 rather than
 * a soft-404: without it the route streams a 200 shell from `loading.tsx`
 * before `notFound()` gets a chance to run.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((city) => ({ citySlug: city.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) return {};

  const count = realCCTVData.filter(
    (camera) => camera.citySlug === city.slug,
  ).length;

  return buildCityMetadata(city, count);
}

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();

  const province = getProvince(city.provinceSlug);
  const cityCameras = realCCTVData.filter(
    (camera) => camera.citySlug === city.slug,
  );
  const stats = getStats(cityCameras);
  const topCameras = sortCCTV(cityCameras, "recommended").slice(
    0,
    TOP_CAMERA_LIMIT,
  );

  const nearby = getNearbyCitiesWithCameras(city, realCCTVData, NEARBY_LIMIT);

  const provinceCameras = realCCTVData.filter(
    (camera) => camera.provinceSlug === city.provinceSlug,
  );
  const otherCityCameras = sortCCTV(
    provinceCameras.filter((camera) => camera.citySlug !== city.slug),
    "recommended",
  ).slice(0, OTHER_CITY_LIMIT);

  const sourceSlugs = new Set(cityCameras.map((camera) => camera.sourceSlug));
  const citySources = getSourceSummaries(realCCTVData).filter((summary) =>
    sourceSlugs.has(summary.source.slug),
  );

  const breadcrumbs = [
    { label: "Beranda", href: "/" },
    { label: "Kota", href: "/cities" },
    { label: city.name },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbJsonLd([
              { name: "Beranda", url: absoluteUrl("/") },
              { name: "Kota", url: absoluteUrl("/cities") },
              { name: city.name, url: absoluteUrl(`/cities/${city.slug}`) },
            ]),
          ),
        }}
      />

      <div className="container space-y-10 py-8 sm:py-12">
        <div className="space-y-6">
          <Breadcrumbs items={breadcrumbs} />
          <CityHeader city={city} />

          <GeoStatsRow
            items={[
              { label: "Kamera CCTV", value: formatNumber(stats.cameras) },
              { label: "Online", value: formatNumber(stats.online) },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild className="gap-1.5">
              <Link href={`/map?city=${city.slug}`}>
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Buka di peta
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-1.5">
              <Link href={`/cctv?city=${city.slug}`}>
                Jelajahi semua kamera
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>

        {cityCameras.length === 0 ? (
          <CCTVEmptyState
            title="Belum ada kamera di kota ini"
            description={`Kami belum menemukan kamera CCTV publik untuk ${city.name}. Lihat provinsi ${province?.name ?? city.province} atau jelajahi kota lain yang sudah terpantau.`}
            action={
              <div className="flex flex-wrap items-center justify-center gap-2">
                {province ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/provinces/${province.slug}`}>
                      CCTV di {province.name}
                    </Link>
                  </Button>
                ) : null}
                <Button asChild size="sm">
                  <Link href="/cctv">Jelajahi semua CCTV</Link>
                </Button>
              </div>
            }
          />
        ) : (
          <>
            <section aria-labelledby="kamera-populer">
              <SectionHeader
                id="kamera-populer"
                title="CCTV populer"
                description={`Kamera pilihan di ${city.name}, diurutkan berdasarkan kelengkapan informasi dan status.`}
                action={
                  <Button asChild variant="ghost" size="sm" className="gap-1.5">
                    <Link href={`/cctv?city=${city.slug}`}>
                      Lihat semua
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </Button>
                }
              />
              <CCTVResults cameras={topCameras} priorityCount={4} />

              <div className="mt-6">
                <Button asChild variant="outline" className="gap-1.5">
                  <Link href={`/cctv?city=${city.slug}`}>
                    Lihat semua {cameraCount(stats.cameras)} di {city.name}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </section>

            {nearby.length > 0 ? (
              <section aria-labelledby="kota-terdekat">
                <SectionHeader
                  id="kota-terdekat"
                  title="Kota terdekat"
                  description="Kota lain dengan kamera publik di sekitar sini."
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {nearby.map((entry) => (
                    <Link
                      key={entry.city.slug}
                      href={`/cities/${entry.city.slug}`}
                      className="group rounded-xl border border-border bg-card p-4 shadow-subtle transition-colors hover:border-primary/40 hover:bg-accent/40"
                    >
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                        <MapPin
                          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                          aria-hidden="true"
                        />
                        <span className="truncate">{entry.city.name}</span>
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {entry.city.province}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {formatDistanceKm(entry.distanceKm)}
                        </span>
                        <span className="font-medium text-foreground">
                          {cameraCount(entry.cameras)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {provinceCameras.length > cityCameras.length &&
            otherCityCameras.length > 0 ? (
              <section aria-labelledby="kamera-provinsi">
                <SectionHeader
                  id="kamera-provinsi"
                  title={`Kamera lain di ${province?.name ?? city.province}`}
                  description="Kamera publik di kota lain dalam provinsi yang sama."
                  action={
                    province ? (
                      <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="gap-1.5"
                      >
                        <Link href={`/provinces/${province.slug}`}>
                          Lihat provinsi
                          <ArrowRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                        </Link>
                      </Button>
                    ) : undefined
                  }
                />
                <CCTVGrid cameras={otherCityCameras} />
              </section>
            ) : null}

            {citySources.length > 0 ? (
              <section aria-labelledby="sumber-kota">
                <SectionHeader
                  id="sumber-kota"
                  title="Sumber di kota ini"
                  description="Operator resmi yang menyediakan kamera di kota ini."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {citySources.map((summary) => (
                    <SourceCard
                      key={summary.source.slug}
                      summary={summary}
                      showCameras
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </>
  );
}
