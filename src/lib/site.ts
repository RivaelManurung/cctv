/**
 * Single source of truth for site identity, used by metadata, sitemap,
 * robots, JSON-LD and the footer.
 */

/** Override in production with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cctv-indonesia.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "CCTV Indonesia";

export const SITE_TAGLINE = "Pantau CCTV Publik Indonesia";

export const SITE_DESCRIPTION =
  "Pantau kamera publik dan kondisi lalu lintas di berbagai wilayah Indonesia. Jelajahi CCTV berdasarkan provinsi, kota, dan kategori melalui peta interaktif.";

export const SITE_LOCALE = "id_ID";

export const SITE_KEYWORDS = [
  "cctv indonesia",
  "cctv publik",
  "kamera lalu lintas",
  "atcs",
  "cctv jakarta",
  "cctv bandung",
  "cctv surabaya",
  "pantau lalu lintas",
  "kamera publik indonesia",
];

export const TWITTER_HANDLE = "@cctvindonesia";

/** Builds an absolute URL from a path. */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized === "/" ? "" : normalized}`;
}

/** Open Graph image endpoint for a camera detail page. */
export function cctvOgImage(slug: string): string {
  return absoluteUrl(`/cctv/${slug}/opengraph-image`);
}
