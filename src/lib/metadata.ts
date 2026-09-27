/**
 * Metadata builders shared by every route.
 *
 * The root layout defines `title.template` (`"%s — CCTV Indonesia"`), so the
 * builders below always pass *bare* titles such as `"Jelajahi CCTV"`.
 *
 * Camera pages canonicalise to `/cctv/{slug}` and their social image comes
 * from the dynamic `opengraph-image` route (see `cctvOgImage` in `site.ts`).
 */

import type { Metadata } from "next";

import { categoryBySlug } from "@/data/categories";
import {
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  TWITTER_HANDLE,
  absoluteUrl,
  cctvOgImage,
} from "@/lib/site";
import { formatNumber, truncate } from "@/lib/utils";
import type { CCTV, City, Province } from "@/types/cctv";

/**
 * Fallback social image. Matches the root layout, which also points at the
 * app icon, so every page always references an asset that exists.
 * Override per page via `BuildMetadataOptions.image`.
 */
export const DEFAULT_OG_IMAGE = absoluteUrl("/icon.svg");

/** Longest meta description we emit before truncating on a word boundary. */
const DESCRIPTION_MAX = 160;

export interface BuildMetadataOptions {
  /** Bare title — the root layout appends the site suffix. */
  title: string;
  /** Indonesian description. Truncated to ~160 characters. */
  description: string;
  /** Site-relative path, e.g. `/cctv`. Drives canonical + Open Graph URL. */
  path: string;
  /** Optional keywords; defaults to the global site keywords. */
  keywords?: readonly string[];
  /** Absolute URL of the social preview image. */
  image?: string;
  /** Open Graph object type. */
  type?: "website" | "article";
  /** Indexing directive; indexable by default. */
  robots?: { index: boolean; follow: boolean };
}

/** Builds a consistent {@link Metadata} object for any route. */
export function buildMetadata(options: BuildMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    keywords,
    image = DEFAULT_OG_IMAGE,
    type = "website",
    robots = { index: true, follow: true },
  } = options;

  const url = absoluteUrl(path);
  const metaDescription = truncate(description, DESCRIPTION_MAX);
  const metaKeywords = [...new Set(keywords ?? SITE_KEYWORDS)];

  return {
    title,
    description: metaDescription,
    keywords: metaKeywords,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: SITE_LOCALE,
      url,
      siteName: SITE_NAME,
      title,
      description: metaDescription,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      title,
      description: metaDescription,
      images: [image],
    },
    robots,
  };
}

/** "CCTV Bundaran HI" -> "CCTV Bundaran HI Jakarta Pusat" */
function cameraTitle(camera: CCTV): string {
  const baseName = camera.name.replace(/^cctv\s+/i, "").trim();
  return `CCTV ${baseName} ${camera.city}`;
}

/** Metadata for a camera detail page (`/cctv/{slug}`). */
export function buildCCTVMetadata(camera: CCTV): Metadata {
  const category = categoryBySlug.get(camera.category);
  const categoryLabel = category?.labelId ?? "umum";
  const title = cameraTitle(camera);
  const lead = camera.description ? `${camera.description} ` : "";

  const description = `${lead}Pantau ${camera.name} di ${camera.city}, ${camera.province} — kamera ${categoryLabel.toLowerCase()} dari ${camera.sourceName}.`;

  return buildMetadata({
    title,
    description,
    path: `/cctv/${camera.slug}`,
    keywords: [
      camera.name,
      camera.city,
      camera.province,
      categoryLabel,
      camera.sourceName,
      ...(camera.tags ?? []),
    ],
    image: cctvOgImage(camera.slug),
    type: "article",
    // Demo entries are never presented as real Indonesian CCTV — keep them
    // out of the index entirely.
    robots: camera.isSample
      ? { index: false, follow: false }
      : { index: true, follow: true },
  });
}

/** Metadata for a city page (`/cities/{slug}`). */
export function buildCityMetadata(city: City, cameraCount: number): Metadata {
  const count = formatNumber(cameraCount);

  return buildMetadata({
    title: `CCTV ${city.name}`,
    description: `${count} kamera CCTV publik di ${city.name}, ${city.province}. Jelajahi lokasi, kategori, dan status kamera lalu lintas di kota ini.`,
    path: `/cities/${city.slug}`,
    keywords: [
      city.name,
      city.province,
      `cctv ${city.name}`,
      `cctv ${city.province}`,
      "cctv kota",
    ],
  });
}

/** Metadata for a province page (`/provinces/{slug}`). */
export function buildProvinceMetadata(
  province: Province,
  cameraCount: number,
): Metadata {
  const count = formatNumber(cameraCount);

  return buildMetadata({
    title: `CCTV ${province.name}`,
    description: `${count} kamera CCTV publik di ${province.name}. Telusuri kota, kategori, dan status kamera lalu lintas di provinsi ini.`,
    path: `/provinces/${province.slug}`,
    keywords: [
      province.name,
      `cctv ${province.name}`,
      `cctv ${province.capital}`,
      "cctv provinsi",
    ],
  });
}
