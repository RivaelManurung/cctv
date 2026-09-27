/**
 * JSON-LD structured data.
 *
 * These helpers only *return* plain objects — rendering the `<script
 * type="application/ld+json">` tag is the caller's job. Use
 * {@link serializeJsonLd} to turn a value into a safe string before injecting
 * it, so the payload can never break out of the surrounding script element.
 */

import { categoryBySlug } from "@/data/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";
import type { CCTV } from "@/types/cctv";

/** A plain, serialisable JSON-LD object. */
export type JsonLdObject = Record<string, unknown>;

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Serialises a JSON-LD value and escapes every character that could terminate
 * or corrupt an inline `<script>` element (`<`, `>`, `&`) as well as the
 * JavaScript line separators U+2028 / U+2029.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/** `WebSite` node with a site-wide `SearchAction` for the `/cctv?q=` search. */
export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: "CCTV ID",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "id-ID",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/cctv")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/** `Organization` node for the publisher of this aggregator. */
export function organizationJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/icon.svg"),
    description: SITE_DESCRIPTION,
    areaServed: { "@type": "Country", name: "Indonesia" },
  };
}

/** `BreadcrumbList` for a page trail, in reading order. */
export function breadcrumbJsonLd(items: BreadcrumbItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * `ItemPage` describing a single camera and the `Place` it observes.
 *
 * The feed is credited to its operator via `citation`; this site does not own
 * or host any of the underlying video.
 */
export function cctvItemJsonLd(camera: CCTV): JsonLdObject {
  const category = categoryBySlug.get(camera.category);
  const url = absoluteUrl(`/cctv/${camera.slug}`);
  const keywords = [category?.labelId ?? "", ...(camera.tags ?? [])].filter(
    (keyword) => keyword.length > 0,
  );

  return {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: camera.name,
    url,
    description:
      camera.description ??
      `Kamera CCTV publik di ${camera.city}, ${camera.province}, Indonesia.`,
    inLanguage: "id-ID",
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    about: {
      "@type": "Place",
      name: camera.name,
      address: {
        "@type": "PostalAddress",
        ...(camera.address ? { streetAddress: camera.address } : {}),
        addressLocality: camera.city,
        addressRegion: camera.province,
        addressCountry: "ID",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: camera.latitude,
        longitude: camera.longitude,
      },
    },
    ...(keywords.length > 0 ? { keywords: keywords.join(", ") } : {}),
    // Attribution only — we do not own, host or redistribute the video feed.
    citation: {
      "@type": "CreativeWork",
      name: camera.sourceName,
      url: camera.sourceUrl,
    },
  };
}
