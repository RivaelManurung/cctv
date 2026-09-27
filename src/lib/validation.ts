import { z } from "zod";

import {
  CAMERA_STATUSES,
  CCTV_CATEGORIES,
  REGION_SLUGS,
  STREAM_TYPES,
} from "@/types/cctv";

/* ------------------------------------------------------------------ *
 * Schemas
 * ------------------------------------------------------------------ */

/** Only http/https are accepted — blocks javascript:, data:, file:, etc. */
const httpUrl = z
  .string()
  .url()
  .refine((value) => /^https?:\/\//i.test(value), {
    message: "URL harus menggunakan protokol http atau https",
  });

export const cctvSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    slug: z
      .string()
      .min(1)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug harus kebab-case"),

    province: z.string().min(1),
    provinceSlug: z.string().min(1),

    city: z.string().min(1),
    citySlug: z.string().min(1),

    district: z.string().min(1).optional(),
    address: z.string().min(1).optional(),

    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),

    category: z.enum(CCTV_CATEGORIES),
    streamType: z.enum(STREAM_TYPES),

    streamUrl: httpUrl.optional(),
    thumbnailUrl: httpUrl.optional(),

    sourceName: z.string().min(1),
    sourceSlug: z.string().min(1),
    sourceUrl: httpUrl,

    status: z.enum(CAMERA_STATUSES),

    description: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isSample: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    lastChecked: z.string().datetime({ offset: true }).optional(),

    metadata: z
      .object({
        direction: z.string().optional(),
        road: z.string().optional(),
        operator: z.string().optional(),
      })
      .optional(),
  })
  .superRefine((value, ctx) => {
    // Embeddable stream types must carry a URL…
    if (value.streamType !== "external" && !value.streamUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["streamUrl"],
        message: `streamUrl wajib diisi untuk streamType "${value.streamType}"`,
      });
    }
    // …and "external" must NOT, so we can never silently render a dead embed.
    if (value.streamType === "external" && value.streamUrl) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["streamUrl"],
        message: 'streamType "external" tidak boleh memiliki streamUrl',
      });
    }
  });

export const provinceSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  region: z.enum(REGION_SLUGS),
  code: z.string().regex(/^\d{2}$/, "kode BPS harus 2 digit"),
  capital: z.string().min(1),
});

export const citySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  province: z.string().min(1),
  provinceSlug: z.string().min(1),
  region: z.enum(REGION_SLUGS),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  isCapital: z.boolean().optional(),
  nearby: z.array(z.string()).optional(),
});

export const sourceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  url: httpUrl,
  coverage: z.string().min(1),
  provinceSlug: z.string().optional(),
  citySlug: z.string().optional(),
  description: z.string().min(1),
  operatorType: z.enum([
    "national",
    "provincial",
    "municipal",
    "state-owned",
    "other",
  ]),
});

/* ------------------------------------------------------------------ *
 * Runtime integrity check
 * ------------------------------------------------------------------ */

export interface DataIssue {
  level: "error" | "warning";
  code: string;
  message: string;
  /** `cctv.id` or similar, to make the issue easy to locate. */
  subject?: string;
}

/**
 * Validates the entire static dataset and returns every problem found.
 *
 * Called from `scripts/validate-data.ts` (CI / `npm run validate:data`) and
 * from a development-only effect so bad data surfaces immediately.
 */
export function validateDataset(input: {
  cameras: unknown[];
  provinces: unknown[];
  cities: unknown[];
  sources: unknown[];
  categories: unknown[];
}): DataIssue[] {
  const issues: DataIssue[] = [];

  /* --- Shape validation ------------------------------------------- */
  const cameras = input.cameras.flatMap((raw, index) => {
    const result = cctvSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          level: "error",
          code: "cctv.invalid",
          message: `cctv[${index}] ${issue.path.join(".") || "(root)"}: ${issue.message}`,
          subject: (raw as { id?: string })?.id,
        });
      }
      return [];
    }
    return [result.data];
  });

  const provinces = input.provinces.flatMap((raw, index) => {
    const result = provinceSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          level: "error",
          code: "province.invalid",
          message: `provinces[${index}] ${issue.path.join(".") || "(root)"}: ${issue.message}`,
        });
      }
      return [];
    }
    return [result.data];
  });

  const cities = input.cities.flatMap((raw, index) => {
    const result = citySchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          level: "error",
          code: "city.invalid",
          message: `cities[${index}] ${issue.path.join(".") || "(root)"}: ${issue.message}`,
        });
      }
      return [];
    }
    return [result.data];
  });

  const sources = input.sources.flatMap((raw, index) => {
    const result = sourceSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        issues.push({
          level: "error",
          code: "source.invalid",
          message: `sources[${index}] ${issue.path.join(".") || "(root)"}: ${issue.message}`,
        });
      }
      return [];
    }
    return [result.data];
  });

  /* --- Referential integrity -------------------------------------- */
  const provinceSlugs = new Set(provinces.map((p) => p.slug));
  const cityBySlug = new Map(cities.map((c) => [c.slug, c]));
  const sourceSlugs = new Set(sources.map((s) => s.slug));

  for (const camera of cameras) {
    if (!provinceSlugs.has(camera.provinceSlug)) {
      issues.push({
        level: "error",
        code: "cctv.unknown-province",
        message: `Kamera "${camera.name}" merujuk provinceSlug "${camera.provinceSlug}" yang tidak ada di provinces.ts`,
        subject: camera.id,
      });
    }

    const city = cityBySlug.get(camera.citySlug);
    if (!city) {
      issues.push({
        level: "error",
        code: "cctv.unknown-city",
        message: `Kamera "${camera.name}" merujuk citySlug "${camera.citySlug}" yang tidak ada di cities.ts`,
        subject: camera.id,
      });
    } else if (city.provinceSlug !== camera.provinceSlug) {
      issues.push({
        level: "error",
        code: "cctv.city-province-mismatch",
        message: `Kamera "${camera.name}": kota "${camera.citySlug}" berada di provinsi "${city.provinceSlug}", bukan "${camera.provinceSlug}"`,
        subject: camera.id,
      });
    } else if (city.name !== camera.city) {
      issues.push({
        level: "warning",
        code: "cctv.city-name-mismatch",
        message: `Kamera "${camera.name}": city "${camera.city}" tidak sama dengan nama kota di cities.ts ("${city.name}")`,
        subject: camera.id,
      });
    }

    if (!sourceSlugs.has(camera.sourceSlug)) {
      issues.push({
        level: "error",
        code: "cctv.unknown-source",
        message: `Kamera "${camera.name}" merujuk sourceSlug "${camera.sourceSlug}" yang tidak ada di sources.ts`,
        subject: camera.id,
      });
    }

    // Coordinates should fall inside Indonesia's rough bounding box.
    const inIndonesia =
      camera.latitude >= -11.5 &&
      camera.latitude <= 6.5 &&
      camera.longitude >= 94 &&
      camera.longitude <= 141.5;
    if (!inIndonesia && !camera.isSample) {
      issues.push({
        level: "warning",
        code: "cctv.coordinates-outside-indonesia",
        message: `Kamera "${camera.name}" memiliki koordinat di luar kotak batas Indonesia (${camera.latitude}, ${camera.longitude})`,
        subject: camera.id,
      });
    }
  }

  /* --- Uniqueness -------------------------------------------------- */
  const seenIds = new Map<string, number>();
  const seenSlugs = new Map<string, number>();
  for (const camera of cameras) {
    seenIds.set(camera.id, (seenIds.get(camera.id) ?? 0) + 1);
    seenSlugs.set(camera.slug, (seenSlugs.get(camera.slug) ?? 0) + 1);
  }
  for (const [id, count] of seenIds) {
    if (count > 1) {
      issues.push({
        level: "error",
        code: "cctv.duplicate-id",
        message: `ID kamera duplikat: "${id}" muncul ${count} kali`,
        subject: id,
      });
    }
  }
  for (const [slug, count] of seenSlugs) {
    if (count > 1) {
      issues.push({
        level: "error",
        code: "cctv.duplicate-slug",
        message: `Slug kamera duplikat: "${slug}" muncul ${count} kali`,
        subject: slug,
      });
    }
  }

  const seenProvinceSlugs = new Map<string, number>();
  for (const province of provinces) {
    seenProvinceSlugs.set(
      province.slug,
      (seenProvinceSlugs.get(province.slug) ?? 0) + 1,
    );
  }
  for (const [slug, count] of seenProvinceSlugs) {
    if (count > 1) {
      issues.push({
        level: "error",
        code: "province.duplicate-slug",
        message: `Slug provinsi duplikat: "${slug}"`,
      });
    }
  }

  const seenCitySlugs = new Map<string, number>();
  for (const city of cities) {
    seenCitySlugs.set(city.slug, (seenCitySlugs.get(city.slug) ?? 0) + 1);
  }
  for (const [slug, count] of seenCitySlugs) {
    if (count > 1) {
      issues.push({
        level: "error",
        code: "city.duplicate-slug",
        message: `Slug kota duplikat: "${slug}"`,
      });
    }
  }

  /* --- Coverage sanity --------------------------------------------- */
  const coveredProvinces = new Set(cameras.map((c) => c.provinceSlug));
  for (const province of provinces) {
    if (!coveredProvinces.has(province.slug)) {
      issues.push({
        level: "warning",
        code: "province.no-cameras",
        message: `Provinsi "${province.name}" belum memiliki kamera terdaftar`,
      });
    }
  }

  const categorySlugs = new Set(
    (input.categories as { slug?: string }[]).map((c) => c.slug),
  );
  for (const camera of cameras) {
    if (!categorySlugs.has(camera.category)) {
      issues.push({
        level: "error",
        code: "cctv.unknown-category",
        message: `Kamera "${camera.name}" memakai kategori "${camera.category}" yang tidak ada di categories.ts`,
        subject: camera.id,
      });
    }
  }

  return issues;
}
