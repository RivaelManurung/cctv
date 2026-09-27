import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware class name merger used by every UI primitive. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const numberFormatter = new Intl.NumberFormat("id-ID");

/** 1248 -> "1.248" */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

const compactFormatter = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** 1248 -> "1,2 rb" */
export function formatCompact(value: number): string {
  return compactFormatter.format(value);
}

/** Formats coordinates the way a navigation app would. */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? "LU" : "LS";
  const lngDir = lng >= 0 ? "BT" : "BB";
  return `${Math.abs(lat).toFixed(5)}° ${latDir}, ${Math.abs(lng).toFixed(5)}° ${lngDir}`;
}

/** URL-safe slug from arbitrary text. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** Lowercase + strip diacritics for accent-insensitive search. */
export function normalizeForSearch(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Truncates on a word boundary where possible. */
export function truncate(input: string, max: number): string {
  if (input.length <= max) return input;
  const sliced = input.slice(0, max);
  const lastSpace = sliced.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}…`;
}

/**
 * Deterministic string hash — used to pick a stable accent colour for a
 * camera. Must stay deterministic so SSR and client agree.
 */
export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Restricts a value to a numeric range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Indonesian pluralisation helper: 1 kamera, 2 kamera (no plural inflection). */
export function cameraCount(n: number): string {
  return `${formatNumber(n)} kamera`;
}

/** Returns a single value from Next.js searchParams (which may be an array). */
export function firstParam(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Safely reads a value from a Web Storage API in an SSR-safe way.
 * Returns `null` when running on the server or when storage is unavailable
 * (private mode, disabled cookies, quota errors).
 */
export function safeStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** SSR-safe localStorage write. Returns false when the write failed. */
export function safeStorageSet(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/** SSR-safe localStorage removal. */
export function safeStorageRemove(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/**
 * Parses a JSON value out of localStorage, validating it with a Zod schema so
 * corrupted or hand-edited storage can never crash the app.
 */
export function safeStorageGetJSON<T>(
  key: string,
  parse: (value: unknown) => T | null,
): T | null {
  const raw = safeStorageGet(key);
  if (raw === null) return null;
  try {
    return parse(JSON.parse(raw));
  } catch {
    safeStorageRemove(key);
    return null;
  }
}

/**
 * Only allows http/https URLs through. Used before rendering an external
 * link or an iframe src, so `javascript:` and `data:` URLs can never be
 * injected via the data layer.
 */
export function sanitizeExternalUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

/** Hostname of a URL, for attribution chips. */
export function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** Turns a YouTube watch/short URL into an embed URL. */
export function toYouTubeEmbed(url: string): string | null {
  const safe = sanitizeExternalUrl(url);
  if (!safe) return null;
  try {
    const parsed = new URL(safe);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return `https://www.youtube-nocookie.com${parsed.pathname}`;
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Formats an ISO timestamp in Indonesian, e.g. "20 September 2026".
 *
 * Deterministic: the output depends only on the input, never on the current
 * time or the host timezone. Safe to call during server rendering.
 */
export function formatDateId(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "d MMMM yyyy", { locale: idLocale });
}

/**
 * "7 hari yang lalu" style relative time, in Indonesian.
 *
 * NOT deterministic — the output changes as wall-clock time advances, so
 * calling this during render can produce a hydration mismatch if the server
 * and client disagree across a time boundary. Always render it through
 * `<RelativeTime>` from `@/components/shared/relative-time`, which shows the
 * absolute date until after mount.
 */
export function formatRelativeId(iso: string | undefined): string {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return formatDistanceToNow(date, { addSuffix: true, locale: idLocale });
}
