import type { MetadataRoute } from "next";

import { realCCTVData } from "@/data/cctv";
import { cities } from "@/data/cities";
import { provinces } from "@/data/provinces";
import { absoluteUrl } from "@/lib/site";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

/** Small helper so every entry shares the same shape and types. */
function entry(
  path: string,
  lastModified: Date,
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap[number] {
  return { url: absoluteUrl(path), lastModified, changeFrequency, priority };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static, content-bearing routes. `/favorites` is client-only and has no
  // crawlable content, so it is deliberately excluded.
  const staticRoutes: MetadataRoute.Sitemap = [
    entry("/", now, "daily", 1),
    entry("/cctv", now, "daily", 0.9),
    entry("/map", now, "weekly", 0.8),
    entry("/cities", now, "weekly", 0.8),
    entry("/sources", now, "monthly", 0.6),
    entry("/about", now, "monthly", 0.4),
    entry("/terms", now, "yearly", 0.3),
  ];

  // Real cameras only — `isSample` entries are demo placeholders.
  const cameraRoutes: MetadataRoute.Sitemap = realCCTVData.map((camera) =>
    entry(
      `/cctv/${camera.slug}`,
      camera.lastChecked ? new Date(camera.lastChecked) : now,
      "weekly",
      0.7,
    ),
  );

  // Only cities/provinces that actually contain a real camera get a page.
  const citySlugs = new Set(realCCTVData.map((camera) => camera.citySlug));
  const cityRoutes: MetadataRoute.Sitemap = cities
    .filter((city) => citySlugs.has(city.slug))
    .map((city) => entry(`/cities/${city.slug}`, now, "weekly", 0.6));

  const provinceSlugs = new Set(
    realCCTVData.map((camera) => camera.provinceSlug),
  );
  const provinceRoutes: MetadataRoute.Sitemap = provinces
    .filter((province) => provinceSlugs.has(province.slug))
    .map((province) =>
      entry(`/provinces/${province.slug}`, now, "weekly", 0.6),
    );

  return [...staticRoutes, ...cameraRoutes, ...cityRoutes, ...provinceRoutes];
}
