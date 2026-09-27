import type { Category } from "@/types/cctv";

/**
 * Camera categories.
 *
 * `icon` holds a lucide-react icon *name* (not the component) so this module
 * stays free of React imports and remains serialisable across the RSC
 * boundary. Resolve it with `getIcon()` from `@/lib/icons`.
 *
 * `accent` uses the per-category design tokens declared in `globals.css`
 * (`--cat-*`) and mapped in `tailwind.config.ts`. Dark-mode lightness is
 * handled by the token itself, so no `dark:` variants are needed here.
 */
export const categories: Category[] = [
  {
    slug: "traffic",
    label: "Traffic",
    labelId: "Lalu Lintas",
    description:
      "Kamera pemantau arus lalu lintas di persimpangan dan ruas jalan utama.",
    icon: "TrafficCone",
    accent: "text-cat-traffic bg-cat-traffic/10",
  },
  {
    slug: "road",
    label: "Road",
    labelId: "Jalan Raya",
    description: "Kamera pemantau kondisi ruas jalan umum dan arteri kota.",
    icon: "Route",
    accent: "text-cat-road bg-cat-road/10",
  },
  {
    slug: "intersection",
    label: "Intersection",
    labelId: "Persimpangan",
    description: "Kamera di simpang bersinyal (ATCS) untuk pemantauan antrean.",
    icon: "Split",
    accent: "text-cat-intersection bg-cat-intersection/10",
  },
  {
    slug: "highway",
    label: "Highway",
    labelId: "Jalan Tol",
    description: "Kamera pemantau lalu lintas jalan tol dan jalur bebas hambatan.",
    icon: "Milestone",
    accent: "text-cat-highway bg-cat-highway/10",
  },
  {
    slug: "public-space",
    label: "Public Space",
    labelId: "Ruang Publik",
    description: "Kamera pemantau area publik, alun-alun, taman, dan kawasan wisata.",
    icon: "Landmark",
    accent: "text-cat-public-space bg-cat-public-space/10",
  },
  {
    slug: "port",
    label: "Port",
    labelId: "Pelabuhan",
    description: "Kamera pemantau dermaga, terminal peti kemas, dan perairan pelabuhan.",
    icon: "Anchor",
    accent: "text-cat-port bg-cat-port/10",
  },
  {
    slug: "airport",
    label: "Airport",
    labelId: "Bandara",
    description: "Kamera pemantau terminal, apron, dan akses bandar udara.",
    icon: "Plane",
    accent: "text-cat-airport bg-cat-airport/10",
  },
  {
    slug: "other",
    label: "Other",
    labelId: "Lainnya",
    description: "Kamera publik lain yang tidak termasuk kategori di atas.",
    icon: "Video",
    accent: "text-cat-other bg-cat-other/10",
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

export function getCategory(slug: string): Category | undefined {
  return categoryBySlug.get(slug as Category["slug"]);
}
