import { categories } from "@/data/categories";
import { cctvData } from "@/data/cctv";
import { cities } from "@/data/cities";
import { provinces } from "@/data/provinces";
import { regions } from "@/data/regions";
import { sources } from "@/data/sources";
import type {
  CategorySummary,
  CCTV,
  CCTVStats,
  CitySummary,
  ProvinceSummary,
  RegionSummary,
  SourceSummary,
} from "@/types/cctv";

/**
 * Every function here takes the camera list explicitly (defaulting to the
 * full dataset) so the same logic can be reused for a filtered subset —
 * for example "36 CCTV, 28 online" on a city page.
 */

export function getStats(cameras: CCTV[] = cctvData): CCTVStats {
  const citySlugs = new Set<string>();
  const provinceSlugs = new Set<string>();
  const regionSlugs = new Set<string>();
  const sourceSlugs = new Set<string>();
  let online = 0;
  let offline = 0;
  let unknown = 0;
  let featured = 0;

  for (const camera of cameras) {
    citySlugs.add(camera.citySlug);
    provinceSlugs.add(camera.provinceSlug);
    sourceSlugs.add(camera.sourceSlug);
    if (camera.status === "online") online += 1;
    else if (camera.status === "offline") offline += 1;
    else unknown += 1;
    if (camera.isFeatured) featured += 1;
  }

  for (const province of provinces) {
    if (provinceSlugs.has(province.slug)) regionSlugs.add(province.region);
  }

  return {
    cameras: cameras.length,
    cities: citySlugs.size,
    provinces: provinceSlugs.size,
    regions: regionSlugs.size,
    online,
    offline,
    unknown,
    featured,
    sources: sourceSlugs.size,
  };
}

function countBy(
  cameras: CCTV[],
  keyOf: (camera: CCTV) => string,
): Map<string, { total: number; online: number }> {
  const map = new Map<string, { total: number; online: number }>();
  for (const camera of cameras) {
    const key = keyOf(camera);
    const entry = map.get(key) ?? { total: 0, online: 0 };
    entry.total += 1;
    if (camera.status === "online") entry.online += 1;
    map.set(key, entry);
  }
  return map;
}

export function getRegionSummaries(
  cameras: CCTV[] = cctvData,
): RegionSummary[] {
  const provinceBySlug = new Map(provinces.map((p) => [p.slug, p]));

  // Bucket every camera by the region its province belongs to, in one pass.
  const buckets = new Map<
    string,
    { total: number; online: number; cities: Set<string> }
  >();

  for (const camera of cameras) {
    const province = provinceBySlug.get(camera.provinceSlug);
    if (!province) continue;
    const bucket = buckets.get(province.region) ?? {
      total: 0,
      online: 0,
      cities: new Set<string>(),
    };
    bucket.total += 1;
    if (camera.status === "online") bucket.online += 1;
    bucket.cities.add(camera.citySlug);
    buckets.set(province.region, bucket);
  }

  return regions
    .map((region) => {
      const bucket = buckets.get(region.slug);
      return {
        region,
        provinces: provinces.filter((p) => p.region === region.slug).length,
        cities: bucket?.cities.size ?? 0,
        cameras: bucket?.total ?? 0,
        online: bucket?.online ?? 0,
      };
    })
    .sort((a, b) => b.cameras - a.cameras);
}

export function getProvinceSummaries(
  cameras: CCTV[] = cctvData,
): ProvinceSummary[] {
  const byProvince = countBy(cameras, (c) => c.provinceSlug);

  return provinces
    .map((province) => {
      const entry = byProvince.get(province.slug);
      const provinceCities = new Set(
        cameras
          .filter((c) => c.provinceSlug === province.slug)
          .map((c) => c.citySlug),
      );
      return {
        province,
        cities: provinceCities.size,
        cameras: entry?.total ?? 0,
        online: entry?.online ?? 0,
      };
    })
    .sort((a, b) => b.cameras - a.cameras || a.province.name.localeCompare(b.province.name, "id"));
}

export function getCitySummaries(cameras: CCTV[] = cctvData): CitySummary[] {
  const byCity = countBy(cameras, (c) => c.citySlug);

  return cities
    .map((city) => {
      const entry = byCity.get(city.slug);
      return {
        city,
        cameras: entry?.total ?? 0,
        online: entry?.online ?? 0,
      };
    })
    .sort((a, b) => b.cameras - a.cameras || a.city.name.localeCompare(b.city.name, "id"));
}

/** Cities that actually have at least one camera, most-populated first. */
export function getPopularCities(
  cameras: CCTV[] = cctvData,
  limit = 12,
): CitySummary[] {
  return getCitySummaries(cameras)
    .filter((summary) => summary.cameras > 0)
    .slice(0, limit);
}

export function getCategorySummaries(
  cameras: CCTV[] = cctvData,
): CategorySummary[] {
  const byCategory = countBy(cameras, (c) => c.category);

  return categories
    .map((category) => ({
      category,
      cameras: byCategory.get(category.slug)?.total ?? 0,
    }))
    .sort((a, b) => b.cameras - a.cameras);
}

export function getSourceSummaries(
  cameras: CCTV[] = cctvData,
): SourceSummary[] {
  const bySource = countBy(cameras, (c) => c.sourceSlug);

  return sources
    .map((source) => {
      const sourceCameras = cameras.filter((c) => c.sourceSlug === source.slug);
      const provinceNames = new Set(sourceCameras.map((c) => c.province));
      return {
        source,
        cameras: bySource.get(source.slug)?.total ?? 0,
        online: bySource.get(source.slug)?.online ?? 0,
        provinces: [...provinceNames].sort((a, b) => a.localeCompare(b, "id")),
      };
    })
    .sort(
      (a, b) =>
        b.cameras - a.cameras || a.source.name.localeCompare(b.source.name, "id"),
    );
}

export function getFeaturedCameras(
  cameras: CCTV[] = cctvData,
  limit = 8,
): CCTV[] {
  return cameras.filter((camera) => camera.isFeatured).slice(0, limit);
}
