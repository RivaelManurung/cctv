import type { Region, RegionSlug } from "@/types/cctv";

/**
 * The seven major island groups used for top-level navigation.
 *
 * `icon` holds a lucide-react icon name — resolve with `getIcon()`.
 */
export const regions: Region[] = [
  {
    slug: "sumatera",
    name: "Sumatera",
    shortName: "Sumatera",
    description:
      "Pulau terbesar keenam di dunia, membentang dari Aceh hingga Lampung dengan 10 provinsi.",
    icon: "Mountain",
  },
  {
    slug: "jawa",
    name: "Jawa",
    shortName: "Jawa",
    description:
      "Pulau terpadat di Indonesia. Pusat pemerintahan, bisnis, dan jaringan jalan tol terbesar.",
    icon: "Building2",
  },
  {
    slug: "kalimantan",
    name: "Kalimantan",
    shortName: "Kalimantan",
    description:
      "Bagian Indonesia dari Borneo, dengan 5 provinsi dan kawasan ibu kota nusantara.",
    icon: "Trees",
  },
  {
    slug: "sulawesi",
    name: "Sulawesi",
    shortName: "Sulawesi",
    description:
      "Pulau berkepulauan dengan 6 provinsi, dari Manado di utara hingga Makassar di selatan.",
    icon: "Waves",
  },
  {
    slug: "bali-nusa-tenggara",
    name: "Bali & Nusa Tenggara",
    shortName: "Bali & Nusa Tenggara",
    description:
      "Gugusan pulau wisata dan kepulauan Sunda Kecil: Bali, NTB, dan NTT.",
    icon: "Palmtree",
  },
  {
    slug: "maluku",
    name: "Maluku",
    shortName: "Maluku",
    description:
      "Kepulauan rempah di Indonesia timur, terdiri dari Maluku dan Maluku Utara.",
    icon: "Ship",
  },
  {
    slug: "papua",
    name: "Papua",
    shortName: "Papua",
    description:
      "Pulau terbesar kedua di dunia, kini terbagi menjadi enam provinsi.",
    icon: "TreePalm",
  },
];

export const regionBySlug = new Map(regions.map((r) => [r.slug, r]));

export function getRegion(slug: string): Region | undefined {
  return regionBySlug.get(slug as RegionSlug);
}

export const REGION_ORDER: RegionSlug[] = regions.map((r) => r.slug);
