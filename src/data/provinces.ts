import type { Province } from "@/types/cctv";

/**
 * All 38 provinces of Indonesia, grouped by island region.
 *
 * `code` is the official BPS two-digit province code.
 */
export const provinces: Province[] = [
  /* ----------------------------- Sumatera ----------------------------- */
  { name: "Aceh", slug: "aceh", region: "sumatera", code: "11", capital: "Banda Aceh" },
  { name: "Sumatera Utara", slug: "sumatera-utara", region: "sumatera", code: "12", capital: "Medan" },
  { name: "Sumatera Barat", slug: "sumatera-barat", region: "sumatera", code: "13", capital: "Padang" },
  { name: "Riau", slug: "riau", region: "sumatera", code: "14", capital: "Pekanbaru" },
  { name: "Jambi", slug: "jambi", region: "sumatera", code: "15", capital: "Jambi" },
  { name: "Sumatera Selatan", slug: "sumatera-selatan", region: "sumatera", code: "16", capital: "Palembang" },
  { name: "Bengkulu", slug: "bengkulu", region: "sumatera", code: "17", capital: "Bengkulu" },
  { name: "Lampung", slug: "lampung", region: "sumatera", code: "18", capital: "Bandar Lampung" },
  { name: "Kepulauan Bangka Belitung", slug: "kepulauan-bangka-belitung", region: "sumatera", code: "19", capital: "Pangkal Pinang" },
  { name: "Kepulauan Riau", slug: "kepulauan-riau", region: "sumatera", code: "21", capital: "Tanjung Pinang" },

  /* ------------------------------- Jawa ------------------------------- */
  { name: "DKI Jakarta", slug: "dki-jakarta", region: "jawa", code: "31", capital: "Jakarta" },
  { name: "Jawa Barat", slug: "jawa-barat", region: "jawa", code: "32", capital: "Bandung" },
  { name: "Jawa Tengah", slug: "jawa-tengah", region: "jawa", code: "33", capital: "Semarang" },
  { name: "DI Yogyakarta", slug: "di-yogyakarta", region: "jawa", code: "34", capital: "Yogyakarta" },
  { name: "Jawa Timur", slug: "jawa-timur", region: "jawa", code: "35", capital: "Surabaya" },
  { name: "Banten", slug: "banten", region: "jawa", code: "36", capital: "Serang" },

  /* ----------------------- Bali & Nusa Tenggara ----------------------- */
  { name: "Bali", slug: "bali", region: "bali-nusa-tenggara", code: "51", capital: "Denpasar" },
  { name: "Nusa Tenggara Barat", slug: "nusa-tenggara-barat", region: "bali-nusa-tenggara", code: "52", capital: "Mataram" },
  { name: "Nusa Tenggara Timur", slug: "nusa-tenggara-timur", region: "bali-nusa-tenggara", code: "53", capital: "Kupang" },

  /* ---------------------------- Kalimantan ---------------------------- */
  { name: "Kalimantan Barat", slug: "kalimantan-barat", region: "kalimantan", code: "61", capital: "Pontianak" },
  { name: "Kalimantan Tengah", slug: "kalimantan-tengah", region: "kalimantan", code: "62", capital: "Palangka Raya" },
  { name: "Kalimantan Selatan", slug: "kalimantan-selatan", region: "kalimantan", code: "63", capital: "Banjarmasin" },
  { name: "Kalimantan Timur", slug: "kalimantan-timur", region: "kalimantan", code: "64", capital: "Samarinda" },
  { name: "Kalimantan Utara", slug: "kalimantan-utara", region: "kalimantan", code: "65", capital: "Tanjung Selor" },

  /* ----------------------------- Sulawesi ----------------------------- */
  { name: "Sulawesi Utara", slug: "sulawesi-utara", region: "sulawesi", code: "71", capital: "Manado" },
  { name: "Sulawesi Tengah", slug: "sulawesi-tengah", region: "sulawesi", code: "72", capital: "Palu" },
  { name: "Sulawesi Selatan", slug: "sulawesi-selatan", region: "sulawesi", code: "73", capital: "Makassar" },
  { name: "Sulawesi Tenggara", slug: "sulawesi-tenggara", region: "sulawesi", code: "74", capital: "Kendari" },
  { name: "Gorontalo", slug: "gorontalo", region: "sulawesi", code: "75", capital: "Gorontalo" },
  { name: "Sulawesi Barat", slug: "sulawesi-barat", region: "sulawesi", code: "76", capital: "Mamuju" },

  /* ------------------------------ Maluku ------------------------------ */
  { name: "Maluku", slug: "maluku", region: "maluku", code: "81", capital: "Ambon" },
  { name: "Maluku Utara", slug: "maluku-utara", region: "maluku", code: "82", capital: "Sofifi" },

  /* ------------------------------ Papua ------------------------------- */
  { name: "Papua", slug: "papua", region: "papua", code: "91", capital: "Jayapura" },
  { name: "Papua Barat", slug: "papua-barat", region: "papua", code: "92", capital: "Manokwari" },
  { name: "Papua Selatan", slug: "papua-selatan", region: "papua", code: "93", capital: "Merauke" },
  { name: "Papua Tengah", slug: "papua-tengah", region: "papua", code: "94", capital: "Nabire" },
  { name: "Papua Pegunungan", slug: "papua-pegunungan", region: "papua", code: "95", capital: "Jayawijaya" },
  { name: "Papua Barat Daya", slug: "papua-barat-daya", region: "papua", code: "96", capital: "Sorong" },
];

export const provinceBySlug = new Map(provinces.map((p) => [p.slug, p]));

export function getProvince(slug: string): Province | undefined {
  return provinceBySlug.get(slug);
}

export function getProvincesByRegion(region: string): Province[] {
  return provinces.filter((p) => p.region === region);
}
