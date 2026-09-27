import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Compass,
  Crosshair,
  ExternalLink,
  MapPin,
  MapPinned,
  Route,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CCTVDetailActionBar, CCTVDetailActions } from "@/components/cctv/cctv-detail-actions";
import { CCTVGrid } from "@/components/cctv/cctv-grid";
import { CCTVInfoGrid, CCTVInfoItem } from "@/components/cctv/cctv-info-grid";
import { CCTVPlayer } from "@/components/cctv/cctv-player";
import { CCTVRecentTracker } from "@/components/cctv/cctv-recent-tracker";
import {
  CCTVStatusBadge,
  SampleBadge,
  StreamTypeBadge,
} from "@/components/cctv/cctv-status";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { RelativeTime } from "@/components/shared/relative-time";
import { SectionHeader } from "@/components/shared/section-header";
import {
  OPERATOR_TYPE_LABELS,
  SourceCard,
} from "@/components/shared/source-card";
import { Button } from "@/components/ui/button";
import { getCategory } from "@/data/categories";
import { cctvData, getCCTV, realCCTVData } from "@/data/cctv";
import { getCity } from "@/data/cities";
import { getProvince } from "@/data/provinces";
import { getSource } from "@/data/sources";
import { getNearbyCitiesWithCameras } from "@/lib/geo";
import { getIcon } from "@/lib/icons";
import { breadcrumbJsonLd, cctvItemJsonLd, serializeJsonLd } from "@/lib/jsonld";
import { buildCCTVMetadata } from "@/lib/metadata";
import { absoluteUrl } from "@/lib/site";
import { getSourceSummaries } from "@/lib/stats";
import {
  cameraCount,
  cn,
  formatCoordinates,
  sanitizeExternalUrl,
} from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

interface CCTVDetailPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Reject unknown slugs at the router instead of rendering them.
 *
 * Without this the route streams a 200 shell (because of `loading.tsx`) before
 * `notFound()` runs, which turns a bad camera URL into a soft-404. Every camera
 * is enumerated below, so a slug outside this set is genuinely not found.
 */
export const dynamicParams = false;

/** Every camera is statically generated — the dataset is fixed at build time. */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return cctvData.map((camera) => ({ slug: camera.slug }));
}

export async function generateMetadata({
  params,
}: CCTVDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const camera = getCCTV(slug);
  if (!camera) {
    return { title: "CCTV tidak ditemukan", robots: { index: false, follow: false } };
  }
  return buildCCTVMetadata(camera);
}

/** Keeps the first occurrence of each camera, so a fallback list never repeats. */
function uniqueCameras(cameras: CCTV[]): CCTV[] {
  const seen = new Set<string>();
  return cameras.filter((camera) => {
    if (seen.has(camera.id)) return false;
    seen.add(camera.id);
    return true;
  });
}

export default async function CCTVDetailPage({ params }: CCTVDetailPageProps) {
  const { slug } = await params;
  const camera = getCCTV(slug);
  if (!camera) notFound();

  const category = getCategory(camera.category);
  const CategoryIcon = getIcon(category?.icon);
  const city = getCity(camera.citySlug);
  const province = getProvince(camera.provinceSlug);
  const source = getSource(camera.sourceSlug);
  const sourceSummary = getSourceSummaries(realCCTVData).find(
    (summary) => summary.source.slug === camera.sourceSlug,
  );

  const sourceHref = sanitizeExternalUrl(camera.sourceUrl);
  const coordinates = formatCoordinates(camera.latitude, camera.longitude);

  const sameCity = cctvData.filter(
    (item) => item.citySlug === camera.citySlug && item.id !== camera.id,
  );
  const sameProvince = cctvData.filter(
    (item) =>
      item.provinceSlug === camera.provinceSlug &&
      item.citySlug !== camera.citySlug &&
      item.id !== camera.id,
  );
  const nearbyCities = city
    ? getNearbyCitiesWithCameras(city, realCCTVData, 4)
    : [];
  const nearbyCityCameras = nearbyCities.flatMap((entry) =>
    cctvData.filter(
      (item) => item.citySlug === entry.city.slug && item.id !== camera.id,
    ),
  );
  const aroundCameras = uniqueCameras([
    ...sameProvince,
    ...nearbyCityCameras,
  ]).slice(0, 8);

  const crumbs = [
    { label: "Beranda", href: "/" },
    { label: "CCTV", href: "/cctv" },
    { label: camera.city, href: `/cities/${camera.citySlug}` },
    { label: camera.name },
  ];

  const breadcrumbLd = breadcrumbJsonLd([
    { name: "Beranda", url: absoluteUrl("/") },
    { name: "CCTV", url: absoluteUrl("/cctv") },
    { name: camera.city, url: absoluteUrl(`/cities/${camera.citySlug}`) },
    { name: camera.name, url: absoluteUrl(`/cctv/${camera.slug}`) },
  ]);

  return (
    <div className="container py-6 md:py-8">
      {/* The only sanctioned `dangerouslySetInnerHTML`: `serializeJsonLd`
          escapes <, > and & so the payload cannot break out of the tag. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(cctvItemJsonLd(camera)),
        }}
      />

      <div className="animate-fade-in space-y-10">
        {/* ------------------------------ Header ------------------------------ */}
        <header className="space-y-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 gap-1.5 text-muted-foreground"
          >
            <Link href="/cctv">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke CCTV
            </Link>
          </Button>

          <Breadcrumbs items={crumbs} />

          <div className="space-y-3">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {camera.name}
            </h1>

            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {camera.city}
                <span aria-hidden="true">·</span>
                {camera.province}
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <CCTVStatusBadge status={camera.status} />
              <StreamTypeBadge streamType={camera.streamType} />
              {category ? (
                <Link
                  href={`/cctv?category=${camera.category}`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-opacity hover:opacity-80",
                    category.accent,
                  )}
                >
                  <CategoryIcon className="h-3 w-3" aria-hidden="true" />
                  {category.labelId}
                </Link>
              ) : null}
              {camera.isSample ? <SampleBadge /> : null}
            </div>
          </div>
        </header>

        {/* ------------------------------ Player ------------------------------ */}
        <section aria-label="Pemutar kamera" className="space-y-4">
          <CCTVPlayer
            camera={camera}
            active
            autoPlay
            actions={<CCTVDetailActions camera={camera} />}
          />

          <CCTVDetailActionBar camera={camera} />

          {camera.description ? (
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {camera.description}
            </p>
          ) : null}
        </section>

        {/* ------------------------------- Info ------------------------------- */}
        <section aria-label="Informasi kamera" className="space-y-5">
          <SectionHeader
            title="Informasi kamera"
            description="Detail lokasi, kategori, sumber, dan waktu pemeriksaan terakhir."
          />

          <CCTVInfoGrid>
            <CCTVInfoItem
              label="Lokasi"
              icon={<MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
              value={camera.address ?? camera.district ?? camera.city}
            />
            <CCTVInfoItem
              label="Kecamatan"
              value={camera.district ?? "—"}
            />
            <CCTVInfoItem
              label="Kategori"
              icon={<CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />}
              value={category?.labelId ?? camera.category}
              href={`/cctv?category=${camera.category}`}
            />
            <CCTVInfoItem
              label="Sumber"
              icon={<ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}
              value={camera.sourceName}
              href={sourceHref ?? undefined}
              external
            />
            <CCTVInfoItem
              label="Koordinat"
              icon={<Crosshair className="h-3.5 w-3.5" aria-hidden="true" />}
              value={coordinates}
            />
            <CCTVInfoItem
              label="Terakhir diperiksa"
              icon={<Clock className="h-3.5 w-3.5" aria-hidden="true" />}
              value={<RelativeTime iso={camera.lastChecked} />}
            />
            {camera.metadata?.operator ? (
              <CCTVInfoItem
                label="Operator"
                icon={<Building2 className="h-3.5 w-3.5" aria-hidden="true" />}
                value={camera.metadata.operator}
              />
            ) : null}
            {camera.metadata?.direction ? (
              <CCTVInfoItem
                label="Arah"
                icon={<Compass className="h-3.5 w-3.5" aria-hidden="true" />}
                value={camera.metadata.direction}
              />
            ) : null}
            {camera.metadata?.road ? (
              <CCTVInfoItem
                label="Jalan"
                icon={<Route className="h-3.5 w-3.5" aria-hidden="true" />}
                value={camera.metadata.road}
              />
            ) : null}
          </CCTVInfoGrid>

          {camera.tags && camera.tags.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                Tag
              </h3>
              <ul className="flex flex-wrap gap-2">
                {camera.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/cctv?q=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
              <MapPinned className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">
                {coordinates}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {camera.address ?? `${camera.city}, ${camera.province}`}
              </p>
            </div>
            {/*
              `/map` renders real cameras only, so a sample camera has no pin
              to fly to — hide the button rather than send users to an
              unfocused map.
            */}
            {camera.isSample ? null : (
              <Button asChild variant="outline" size="sm" className="gap-1.5">
                <Link href={`/map?camera=${camera.id}`}>
                  <MapPinned className="h-4 w-4" aria-hidden="true" />
                  Buka di peta
                </Link>
              </Button>
            )}
          </div>
        </section>

        {/* --------------------------- Same-city rail -------------------------- */}
        {sameCity.length > 0 ? (
          <section aria-label={`Kamera lain di ${camera.city}`} className="space-y-5">
            <SectionHeader
              title={`Kamera lain di ${camera.city}`}
              description={cameraCount(sameCity.length) + " lain di kota yang sama."}
              action={
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                >
                  <Link href={`/cities/${camera.citySlug}`}>
                    Lihat kota
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              }
            />
            <CCTVGrid cameras={sameCity.slice(0, 8)} />
          </section>
        ) : null}

        {/* ---------------------------- Nearby rail ---------------------------- */}
        {aroundCameras.length > 0 ? (
          <section aria-label="Kamera lain di sekitar sini" className="space-y-5">
            <SectionHeader
              title="Kamera lain di sekitar sini"
              description={
                nearbyCities.length > 0
                  ? `Termasuk kota terdekat: ${nearbyCities
                      .map((entry) => entry.city.name)
                      .join(", ")}.`
                  : `Kamera lain di ${province?.name ?? camera.province}.`
              }
            />
            <CCTVGrid cameras={aroundCameras} />
          </section>
        ) : null}

        {/* ------------------------------ Source ------------------------------- */}
        {/* Demo entries reuse an unrelated `sourceSlug`, so joining them to a
            real operator would misattribute the feed — skip the section. */}
        {!camera.isSample && source && sourceSummary ? (
          <section aria-label="Sumber dan atribusi" className="space-y-5">
            <SectionHeader
              title="Sumber & atribusi"
              description="Kami hanya menautkan ke portal resmi operator — tidak menyematkan atau menyimpan rekaman apa pun."
            />
            <div className="grid gap-4 lg:grid-cols-3">
              <div className="space-y-4 rounded-xl border border-border bg-card p-5 lg:col-span-2">
                <h3 className="text-sm font-semibold text-foreground">
                  Tentang sumber ini
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {source.description}
                </p>
                <dl className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                  <div>
                    <dt className="text-muted-foreground">Cakupan</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {source.coverage}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Jenis operator</dt>
                    <dd className="mt-0.5 font-medium text-foreground">
                      {OPERATOR_TYPE_LABELS[source.operatorType]}
                    </dd>
                  </div>
                </dl>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="-ml-2 gap-1.5 text-muted-foreground"
                >
                  <Link href="/sources">
                    Lihat semua sumber
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>

              <SourceCard summary={sourceSummary} showCameras />
            </div>
          </section>
        ) : null}

        <CCTVRecentTracker id={camera.id} />
      </div>
    </div>
  );
}
