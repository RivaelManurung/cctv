import { provinces } from "@/data/provinces";
import {
  CCTV_CATEGORIES,
  SORT_OPTIONS,
  type CCTV,
  type CCTVFilters,
  type SortOption,
} from "@/types/cctv";
import { normalizeForSearch } from "@/lib/utils";

/**
 * Province slug -> island region. Built once at module scope so the region
 * filter is a Map lookup per camera rather than a linear scan.
 */
const REGION_BY_PROVINCE = new Map<string, string>(
  provinces.map((province) => [province.slug, province.region]),
);

/* ------------------------------------------------------------------ *
 * Defaults
 * ------------------------------------------------------------------ */

export const EMPTY_FILTERS: CCTVFilters = {
  q: "",
  province: "",
  city: "",
  district: "",
  category: "",
  status: "",
  source: "",
  region: "",
  featured: false,
  sort: "recommended",
  page: 1,
};

export const DEFAULT_SORT: SortOption = "recommended";

/** Number of results per page in the explorer grid. */
export const PAGE_SIZE = 24;

/* ------------------------------------------------------------------ *
 * URL <-> filter state
 * ------------------------------------------------------------------ */

export type RawSearchParams = Record<string, string | string[] | undefined>;

function single(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

/**
 * Parses (and sanitises) filter state out of URL search params.
 *
 * Anything unrecognised is dropped rather than passed through, so a
 * hand-edited URL can never produce an invalid filter or a crash.
 */
export function parseFilters(raw: RawSearchParams): CCTVFilters {
  const category = single(raw.category);
  const status = single(raw.status);
  const sort = single(raw.sort);
  const page = Number.parseInt(single(raw.page), 10);

  return {
    q: single(raw.q).slice(0, 120),
    province: single(raw.province),
    city: single(raw.city),
    district: single(raw.district),
    category: (CCTV_CATEGORIES as readonly string[]).includes(category)
      ? category
      : "",
    status: ["online", "offline", "unknown"].includes(status) ? status : "",
    source: single(raw.source),
    region: single(raw.region),
    featured: single(raw.featured) === "true" || single(raw.featured) === "1",
    sort: (SORT_OPTIONS as readonly string[]).includes(sort)
      ? (sort as SortOption)
      : DEFAULT_SORT,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/**
 * Serialises filter state back into a query string, omitting every default.
 * Produces a stable key order so URLs are shareable and comparable.
 */
export function buildQueryString(filters: Partial<CCTVFilters>): string {
  const params = new URLSearchParams();
  const set = (key: string, value: string | undefined) => {
    if (value) params.set(key, value);
  };

  set("q", filters.q?.trim() || undefined);
  set("province", filters.province || undefined);
  set("city", filters.city || undefined);
  set("district", filters.district || undefined);
  set("category", filters.category || undefined);
  set("status", filters.status || undefined);
  set("source", filters.source || undefined);
  set("region", filters.region || undefined);
  if (filters.featured) params.set("featured", "true");
  if (filters.sort && filters.sort !== DEFAULT_SORT) {
    params.set("sort", filters.sort);
  }
  if (filters.page && filters.page > 1) {
    params.set("page", String(filters.page));
  }

  return params.toString();
}

/** Builds a path + query, e.g. `/cctv?province=jawa-barat`. */
export function buildFilterHref(
  pathname: string,
  filters: Partial<CCTVFilters>,
): string {
  const query = buildQueryString(filters);
  return query ? `${pathname}?${query}` : pathname;
}

/** Counts every filter that is not at its default value (excludes sort/page). */
export function countActiveFilters(filters: CCTVFilters): number {
  let count = 0;
  if (filters.q.trim()) count += 1;
  if (filters.province) count += 1;
  if (filters.city) count += 1;
  if (filters.district) count += 1;
  if (filters.category) count += 1;
  if (filters.status) count += 1;
  if (filters.source) count += 1;
  if (filters.region) count += 1;
  if (filters.featured) count += 1;
  return count;
}

/* ------------------------------------------------------------------ *
 * Search
 * ------------------------------------------------------------------ */

interface SearchIndexEntry {
  camera: CCTV;
  /** Field -> normalised value. */
  name: string;
  city: string;
  province: string;
  district: string;
  address: string;
  category: string;
  source: string;
  tags: string[];
}

function buildIndex(cameras: CCTV[]): SearchIndexEntry[] {
  return cameras.map((camera) => ({
    camera,
    name: normalizeForSearch(camera.name),
    city: normalizeForSearch(camera.city),
    province: normalizeForSearch(camera.province),
    district: normalizeForSearch(camera.district ?? ""),
    address: normalizeForSearch(camera.address ?? ""),
    category: normalizeForSearch(camera.category),
    source: normalizeForSearch(camera.sourceName),
    tags: (camera.tags ?? []).map(normalizeForSearch),
  }));
}

/**
 * Weighted full-text search across every meaningful camera field.
 *
 * Higher weights mean the field contributes more to the score, so a name
 * match always outranks a tag match. Multi-word queries are AND-ed.
 */
function scoreEntry(entry: SearchIndexEntry, terms: string[]): number {
  let total = 0;

  for (const term of terms) {
    let termScore = 0;

    if (entry.name.startsWith(term)) termScore += 100;
    else if (entry.name.includes(term)) termScore += 60;

    if (entry.city.startsWith(term)) termScore += 40;
    else if (entry.city.includes(term)) termScore += 24;

    if (entry.district.includes(term)) termScore += 18;
    if (entry.address.includes(term)) termScore += 16;
    if (entry.province.includes(term)) termScore += 14;
    if (entry.source.includes(term)) termScore += 10;
    if (entry.category.includes(term)) termScore += 8;

    for (const tag of entry.tags) {
      if (tag === term) termScore += 22;
      else if (tag.includes(term)) termScore += 12;
    }

    // A term that matches nothing disqualifies the entry entirely (AND search).
    if (termScore === 0) return 0;
    total += termScore;
  }

  return total;
}

/** Returns cameras matching `query`, best match first. */
export function searchCCTV(cameras: CCTV[], query: string): CCTV[] {
  const trimmed = query.trim();
  if (!trimmed) return cameras;

  const terms = normalizeForSearch(trimmed).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return cameras;

  const index = buildIndex(cameras);
  const scored: { camera: CCTV; score: number }[] = [];

  for (const entry of index) {
    const score = scoreEntry(entry, terms);
    if (score > 0) scored.push({ camera: entry.camera, score });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.camera.name.localeCompare(b.camera.name, "id");
  });

  return scored.map((item) => item.camera);
}

/* ------------------------------------------------------------------ *
 * Filtering
 * ------------------------------------------------------------------ */

/**
 * Applies every non-search filter. Pure and referentially transparent so it
 * can be memoised on the filter object.
 */
export function filterCCTV(cameras: CCTV[], filters: CCTVFilters): CCTV[] {
  return cameras.filter((camera) => {
    if (filters.region && REGION_BY_PROVINCE.get(camera.provinceSlug) !== filters.region) {
      return false;
    }
    if (filters.province && camera.provinceSlug !== filters.province) {
      return false;
    }
    if (filters.city && camera.citySlug !== filters.city) return false;
    if (filters.district && camera.district !== filters.district) return false;
    if (filters.category && camera.category !== filters.category) return false;
    if (filters.status && camera.status !== filters.status) return false;
    if (filters.source && camera.sourceSlug !== filters.source) return false;
    if (filters.featured && !camera.isFeatured) return false;
    return true;
  });
}

/* ------------------------------------------------------------------ *
 * Sorting
 * ------------------------------------------------------------------ */

const STATUS_RANK: Record<CCTV["status"], number> = {
  online: 0,
  unknown: 1,
  offline: 2,
};

export function sortCCTV(cameras: CCTV[], sort: SortOption): CCTV[] {
  const sorted = [...cameras];

  switch (sort) {
    case "name-asc":
      sorted.sort((a, b) => a.name.localeCompare(b.name, "id"));
      break;
    case "name-desc":
      sorted.sort((a, b) => b.name.localeCompare(a.name, "id"));
      break;
    case "recent":
      sorted.sort((a, b) => {
        const aTime = a.lastChecked ? Date.parse(a.lastChecked) : 0;
        const bTime = b.lastChecked ? Date.parse(b.lastChecked) : 0;
        if (bTime !== aTime) return bTime - aTime;
        return a.name.localeCompare(b.name, "id");
      });
      break;
    case "status-online":
      sorted.sort((a, b) => {
        const diff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
        if (diff !== 0) return diff;
        return a.name.localeCompare(b.name, "id");
      });
      break;
    case "recommended":
    default:
      // Featured first, then online, then alphabetical.
      sorted.sort((a, b) => {
        const featuredDiff = Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
        if (featuredDiff !== 0) return featuredDiff;
        const statusDiff = STATUS_RANK[a.status] - STATUS_RANK[b.status];
        if (statusDiff !== 0) return statusDiff;
        return a.name.localeCompare(b.name, "id");
      });
      break;
  }

  return sorted;
}

/* ------------------------------------------------------------------ *
 * The one pipeline every list view uses
 * ------------------------------------------------------------------ */

export interface QueryResult {
  cameras: CCTV[];
  total: number;
  page: number;
  pageCount: number;
}

/**
 * The single filtering pipeline for the whole app: filter -> search -> sort
 * -> paginate. Every list view goes through this so behaviour can never
 * diverge between the explorer, city pages and favourites.
 */
export function queryCCTV(
  cameras: CCTV[],
  filters: CCTVFilters,
  options: { paginate?: boolean } = {},
): QueryResult {
  const { paginate = true } = options;

  const filtered = filterCCTV(cameras, filters);
  const searched = filters.q.trim()
    ? searchCCTV(filtered, filters.q)
    : filtered;
  const sorted = sortCCTV(searched, filters.sort);

  const total = sorted.length;

  if (!paginate) {
    return { cameras: sorted, total, page: 1, pageCount: 1 };
  }

  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(filters.page, 1), pageCount);
  const start = (page - 1) * PAGE_SIZE;

  return {
    cameras: sorted.slice(start, start + PAGE_SIZE),
    total,
    page,
    pageCount,
  };
}

/* ------------------------------------------------------------------ *
 * Facet options
 * ------------------------------------------------------------------ */

export interface FacetOption {
  value: string;
  label: string;
  count: number;
}

export interface FacetSet {
  provinces: FacetOption[];
  cities: FacetOption[];
  districts: FacetOption[];
  categories: FacetOption[];
  statuses: FacetOption[];
  sources: FacetOption[];
}

function tally(
  cameras: CCTV[],
  keyOf: (camera: CCTV) => string | undefined,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const camera of cameras) {
    const key = keyOf(camera);
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

/**
 * Derives the available filter values *from the currently filtered result
 * set*, so the sidebar can never offer a filter that yields zero cameras.
 *
 * `cameras` should already have the search query applied.
 */
export function getFacets(
  cameras: CCTV[],
  filters: CCTVFilters,
  labelResolvers: {
    province: (slug: string) => string;
    city: (slug: string) => string;
    source: (slug: string) => string;
    category: (slug: string) => string;
  },
): FacetSet {
  const toOptions = (
    counts: Map<string, number>,
    label: (value: string) => string,
  ): FacetOption[] =>
    [...counts.entries()]
      .map(([value, count]) => ({ value, label: label(value), count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "id"));

  // Province facet ignores the province filter (so you can switch province),
  // but respects everything else.
  const forProvinces = filterCCTV(cameras, { ...filters, province: "" });
  const forCities = filterCCTV(cameras, { ...filters, city: "" });
  const forDistricts = filterCCTV(cameras, {
    ...filters,
    district: "",
  });
  const forCategories = filterCCTV(cameras, { ...filters, category: "" });
  const forStatuses = filterCCTV(cameras, { ...filters, status: "" });
  const forSources = filterCCTV(cameras, { ...filters, source: "" });

  const statusLabels: Record<string, string> = {
    online: "Online",
    offline: "Offline",
    unknown: "Tidak diketahui",
  };

  return {
    provinces: toOptions(
      tally(forProvinces, (c) => c.provinceSlug),
      labelResolvers.province,
    ),
    cities: toOptions(
      tally(forCities, (c) => c.citySlug),
      labelResolvers.city,
    ),
    districts: toOptions(
      tally(forDistricts, (c) => c.district),
      (value) => value,
    ),
    categories: toOptions(
      tally(forCategories, (c) => c.category),
      labelResolvers.category,
    ),
    statuses: toOptions(
      tally(forStatuses, (c) => c.status),
      (value) => statusLabels[value] ?? value,
    ),
    sources: toOptions(
      tally(forSources, (c) => c.sourceSlug),
      labelResolvers.source,
    ),
  };
}
