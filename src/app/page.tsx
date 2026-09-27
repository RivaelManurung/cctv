import type { Metadata } from "next";

import { RecentlyViewed } from "@/components/cctv/recently-viewed";
import { AboutTeaser } from "@/components/home/about-teaser";
import { CategoryExplorer } from "@/components/home/category-explorer";
import { CityExplorer } from "@/components/home/city-explorer";
import { FeaturedRail } from "@/components/home/featured-rail";
import { Hero } from "@/components/home/hero";
import { MapTeaser } from "@/components/home/map-teaser";
import { ProvinceExplorer } from "@/components/home/province-explorer";
import { RegionExplorer } from "@/components/home/region-explorer";
import { SourcesStrip } from "@/components/home/sources-strip";
import { HomeStats } from "@/components/home/stats-strip";
import { realCCTVData } from "@/data/cctv";
import { serializeJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/metadata";
import { SITE_DESCRIPTION } from "@/lib/site";
import { getFeaturedCameras } from "@/lib/stats";

const HOME_TITLE = "CCTV Indonesia — Pantau CCTV Publik Indonesia";

export const metadata: Metadata = {
  ...buildMetadata({
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    path: "/",
    keywords: [
      "cctv indonesia",
      "cctv publik",
      "kamera lalu lintas",
      "atcs",
      "peta cctv indonesia",
      "cctv jakarta",
      "cctv bandung",
      "cctv surabaya",
    ],
  }),
  // The root layout's `%s — CCTV Indonesia` template would otherwise double the
  // brand suffix on the homepage.
  title: { absolute: HOME_TITLE },
};

/**
 * Homepage — a Server Component.
 *
 * All figures are derived from the static dataset on the server, so the
 * camera names, cities and stats are present in the initial HTML. The only
 * interactive islands are `HeroSearch`, the featured rail's controls and
 * `RecentlyViewed`.
 */
export default function HomePage() {
  const featured = getFeaturedCameras(realCCTVData, 8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(organizationJsonLd()),
        }}
      />

      <Hero />

      <div className="container space-y-16 py-14 sm:space-y-24 sm:py-20">
        <HomeStats />
        <FeaturedRail cameras={featured} />
        <MapTeaser />
        <CityExplorer />
        <ProvinceExplorer />
        <RegionExplorer />
        <CategoryExplorer />
        <RecentlyViewed />
        <SourcesStrip />
        <AboutTeaser />
      </div>
    </>
  );
}
