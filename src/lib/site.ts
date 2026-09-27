/**
 * Single source of truth for site identity, used by metadata, sitemap,
 * robots, JSON-LD and the footer.
 */

/** Used when NEXT_PUBLIC_SITE_URL is unset — see `.env.example`. */
const DEFAULT_SITE_URL = "https://cctv-indonesia.vercel.app";

/**
 * Canonical origin of the deployed site.
 *
 * `??` is not enough on its own: a variable that is set but empty (or only
 * whitespace) is not nullish, and an empty string reaches `new URL(SITE_URL)`
 * in the root layout as `new URL("")` — which throws ERR_INVALID_URL and fails
 * the whole build at the "collect page data" step. Anything that is not a
 * usable http(s) origin is treated as unset instead.
 */
function resolveSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim().replace(/\/+$/, "");
  if (!raw) return DEFAULT_SITE_URL;
  try {
    const { protocol } = new URL(raw);
    return protocol === "http:" || protocol === "https:" ? raw : DEFAULT_SITE_URL;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

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
