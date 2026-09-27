/**
 * Core domain types for CCTV Indonesia.
 *
 * These types are the single source of truth for the entire application.
 * Every component, page, filter and utility derives from them.
 */

/* ------------------------------------------------------------------ *
 * Enumerations (const tuples -> union types, so they are also usable
 * at runtime for validation, filter option lists and Zod schemas)
 * ------------------------------------------------------------------ */

export const CCTV_CATEGORIES = [
  "traffic",
  "road",
  "intersection",
  "highway",
  "public-space",
  "port",
  "airport",
  "other",
] as const;
export type CCTVCategory = (typeof CCTV_CATEGORIES)[number];

export const STREAM_TYPES = [
  "hls",
  "mjpeg",
  "iframe",
  "image",
  "youtube",
  "external",
] as const;
export type StreamType = (typeof STREAM_TYPES)[number];

export const CAMERA_STATUSES = ["online", "offline", "unknown"] as const;
export type CameraStatus = (typeof CAMERA_STATUSES)[number];

/**
 * Values for the feed-availability filter.
 *
 * This is deliberately *not* a camera status: `unavailable` means we have no
 * feed of our own to show for the camera (see `hasEmbeddedFeed`), which is a
 * different axis from whether the operator's camera is currently up.
 */
export const FEED_FILTERS = ["unavailable"] as const;
export type FeedFilter = (typeof FEED_FILTERS)[number];

export const REGION_SLUGS = [
  "sumatera",
  "jawa",
  "kalimantan",
  "sulawesi",
  "bali-nusa-tenggara",
  "maluku",
  "papua",
] as const;
export type RegionSlug = (typeof REGION_SLUGS)[number];

export const VIEW_MODES = ["grid", "list", "map"] as const;
export type ViewMode = (typeof VIEW_MODES)[number];

export const SORT_OPTIONS = [
  "recommended",
  "name-asc",
  "name-desc",
  "recent",
  "status-online",
] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

/* ------------------------------------------------------------------ *
 * Entities
 * ------------------------------------------------------------------ */

/**
 * A single public CCTV / traffic camera.
 *
 * NOTE: `streamType: "external"` means we do NOT embed the feed — we only
 * link to the operator's official page. Never represent an external link
 * as a live embedded stream.
 */
export interface CCTV {
  id: string;
  name: string;
  slug: string;

  province: string;
  provinceSlug: string;

  city: string;
  citySlug: string;

  district?: string;
  address?: string;

  latitude: number;
  longitude: number;

  category: CCTVCategory;
  streamType: StreamType;

  /** Only present for embeddable stream types (hls / mjpeg / iframe / image / youtube). */
  streamUrl?: string;
  thumbnailUrl?: string;

  sourceName: string;
  /** Slug of the entry in `sources.ts`. Keeps attribution joinable. */
  sourceSlug: string;
  sourceUrl: string;

  status: CameraStatus;

  description?: string;

  isFeatured?: boolean;

  tags?: string[];

  /** ISO 8601 timestamp. Static by design — this is a frontend-only app. */
  lastChecked?: string;

  /**
   * Marks a camera that is a *demonstration* entry used to exercise the
   * player for a given stream type. Sample entries are visibly labelled
   * in the UI and are never presented as real Indonesian CCTV.
   */
  isSample?: boolean;

  metadata?: {
    direction?: string;
    road?: string;
    operator?: string;
  };
}

export interface Province {
  name: string;
  slug: string;
  region: RegionSlug;
  /** BPS two-digit province code, e.g. "32" for Jawa Barat. */
  code: string;
  capital: string;
}

export interface City {
  name: string;
  slug: string;
  province: string;
  provinceSlug: string;
  region: RegionSlug;
  latitude: number;
  longitude: number;
  isCapital?: boolean;
  /** Slugs of adjacent / nearby cities, used for "nearby cities" sections. */
  nearby?: string[];
}

export interface Category {
  slug: CCTVCategory;
  label: string;
  /** Indonesian label used in the primary (id) UI copy. */
  labelId: string;
  description: string;
  /** lucide-react icon name — resolved via `@/lib/icons`. */
  icon: string;
  /** Tailwind classes for the icon chip. */
  accent: string;
}

export interface Source {
  id: string;
  name: string;
  slug: string;
  /** Official, publicly reachable landing page for the camera feeds. */
  url: string;
  /** Human readable coverage description, e.g. "DKI Jakarta". */
  coverage: string;
  provinceSlug?: string;
  citySlug?: string;
  description: string;
  operatorType: "national" | "provincial" | "municipal" | "state-owned" | "other";
}

export interface Region {
  slug: RegionSlug;
  name: string;
  /** Short name used in compact chips. */
  shortName: string;
  description: string;
  /** lucide-react icon name — resolved via `@/lib/icons`. */
  icon: string;
}

/* ------------------------------------------------------------------ *
 * Derived / aggregate shapes
 * ------------------------------------------------------------------ */

export interface CCTVStats {
  cameras: number;
  cities: number;
  provinces: number;
  regions: number;
  online: number;
  offline: number;
  unknown: number;
  featured: number;
  sources: number;
}

export interface RegionSummary {
  region: Region;
  provinces: number;
  cities: number;
  cameras: number;
  online: number;
}

export interface ProvinceSummary {
  province: Province;
  cities: number;
  cameras: number;
  online: number;
}

export interface CitySummary {
  city: City;
  cameras: number;
  online: number;
}

export interface CategorySummary {
  category: Category;
  cameras: number;
}

export interface SourceSummary {
  source: Source;
  cameras: number;
  online: number;
  provinces: string[];
}

/** Normalised filter state. Mirrors the URL search params exactly. */
export interface CCTVFilters {
  q: string;
  province: string;
  city: string;
  district: string;
  category: string;
  status: string;
  /** Feed-availability axis. See {@link FEED_FILTERS}. */
  feed: string;
  source: string;
  region: string;
  featured: boolean;
  sort: SortOption;
  page: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
