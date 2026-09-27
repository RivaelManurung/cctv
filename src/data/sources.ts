import type { Source } from "@/types/cctv";

/**
 * Official operators that publish public CCTV / traffic camera feeds.
 *
 * IMPORTANT — every `url` below was verified to resolve at build time.
 * We only link to the operator's public landing page; we never embed or
 * redistribute their video. See /about and /terms.
 *
 * To add a source: append an entry here, then reference its `slug` from a
 * camera's `sourceSlug` in `cctv.ts`.
 */
export const sources: Source[] = [
  {
    id: "src-dishub-dki",
    name: "Dinas Perhubungan DKI Jakarta",
    slug: "dishub-dki-jakarta",
    url: "https://dishub.jakarta.go.id",
    coverage: "DKI Jakarta",
    provinceSlug: "dki-jakarta",
    description:
      "Dinas Perhubungan Provinsi DKI Jakarta mengoperasikan jaringan kamera ATCS (Area Traffic Control System) di simpang bersinyal dan ruas jalan utama Jakarta.",
    operatorType: "provincial",
  },
  {
    id: "src-jakarta-smart-city",
    name: "Jakarta Smart City",
    slug: "jakarta-smart-city",
    url: "https://smartcity.jakarta.go.id",
    coverage: "DKI Jakarta",
    provinceSlug: "dki-jakarta",
    description:
      "Program pemerintah Provinsi DKI Jakarta yang memublikasikan data terbuka kota, termasuk katalog kamera pemantau lalu lintas melalui portal data terbuka.",
    operatorType: "provincial",
  },
  {
    id: "src-dishub-jabar",
    name: "Dinas Perhubungan Provinsi Jawa Barat",
    slug: "dishub-jawa-barat",
    url: "https://dishub.jabarprov.go.id",
    coverage: "Jawa Barat",
    provinceSlug: "jawa-barat",
    description:
      "Dinas Perhubungan Provinsi Jawa Barat mengelola ATCS regional dan kamera pemantau lalu lintas di koridor utama Jawa Barat.",
    operatorType: "provincial",
  },
  {
    id: "src-dishub-bandung",
    name: "Dinas Perhubungan Kota Bandung",
    slug: "dishub-kota-bandung",
    url: "https://dishub.bandung.go.id",
    coverage: "Kota Bandung",
    provinceSlug: "jawa-barat",
    citySlug: "bandung",
    description:
      "Pengelola ATCS Kota Bandung dengan kamera di persimpangan utama dan kawasan pusat kota.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-bekasi",
    name: "Dinas Perhubungan Kota Bekasi",
    slug: "dishub-kota-bekasi",
    url: "https://dishub.bekasikota.go.id",
    coverage: "Kota Bekasi",
    provinceSlug: "jawa-barat",
    citySlug: "bekasi",
    description:
      "Dinas Perhubungan Kota Bekasi memantau simpang dan ruas arteri kota melalui kamera ATCS.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-depok",
    name: "Dinas Perhubungan Kota Depok",
    slug: "dishub-kota-depok",
    url: "https://dishub.depok.go.id",
    coverage: "Kota Depok",
    provinceSlug: "jawa-barat",
    citySlug: "depok",
    description:
      "Kamera pemantau lalu lintas Kota Depok pada titik rawan kepadatan menuju Jakarta.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-bogor",
    name: "Dinas Perhubungan Kota Bogor",
    slug: "dishub-kota-bogor",
    url: "https://dishub.kotabogor.go.id",
    coverage: "Kota Bogor",
    provinceSlug: "jawa-barat",
    citySlug: "bogor",
    description:
      "Pemantauan lalu lintas Kota Bogor, termasuk kawasan Puncak dan jalur wisata.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-cirebon",
    name: "Dinas Perhubungan Kota Cirebon",
    slug: "dishub-kota-cirebon",
    url: "https://dishub.cirebonkota.go.id",
    coverage: "Kota Cirebon",
    provinceSlug: "jawa-barat",
    citySlug: "cirebon",
    description:
      "Kamera pemantau simpang dan jalur pantura di wilayah Kota Cirebon.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-semarang",
    name: "Dinas Perhubungan Kota Semarang",
    slug: "dishub-kota-semarang",
    url: "https://dishub.semarangkota.go.id",
    coverage: "Kota Semarang",
    provinceSlug: "jawa-tengah",
    citySlug: "semarang",
    description:
      "ATCS Kota Semarang memantau simpang bersinyal dan jalur utama ibu kota Jawa Tengah.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-surakarta",
    name: "Dinas Perhubungan Kota Surakarta",
    slug: "dishub-kota-surakarta",
    url: "https://dishub.surakarta.go.id",
    coverage: "Kota Surakarta",
    provinceSlug: "jawa-tengah",
    citySlug: "surakarta",
    description:
      "Kamera pemantau lalu lintas Kota Surakarta pada ruas protokol dan kawasan wisata.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-jogja",
    name: "Dinas Perhubungan DI Yogyakarta",
    slug: "dishub-di-yogyakarta",
    url: "https://dishub.jogjaprov.go.id",
    coverage: "DI Yogyakarta",
    provinceSlug: "di-yogyakarta",
    description:
      "Dinas Perhubungan DI Yogyakarta memantau koridor utama Yogyakarta, termasuk jalur menuju kawasan wisata.",
    operatorType: "provincial",
  },
  {
    id: "src-dishub-jatim",
    name: "Dinas Perhubungan Provinsi Jawa Timur",
    slug: "dishub-jawa-timur",
    url: "https://dishub.jatimprov.go.id",
    coverage: "Jawa Timur",
    provinceSlug: "jawa-timur",
    description:
      "Pengelola ATCS regional Jawa Timur dengan kamera pada jaringan jalan provinsi.",
    operatorType: "provincial",
  },
  {
    id: "src-dishub-surabaya",
    name: "Dinas Perhubungan Kota Surabaya",
    slug: "dishub-kota-surabaya",
    url: "https://dishub.surabaya.go.id",
    coverage: "Kota Surabaya",
    provinceSlug: "jawa-timur",
    citySlug: "surabaya",
    description:
      "ATCS Kota Surabaya mengoperasikan kamera pada simpang utama dan kawasan pusat pemerintahan.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-malang",
    name: "Dinas Perhubungan Kota Malang",
    slug: "dishub-kota-malang",
    url: "https://dishub.malangkota.go.id",
    coverage: "Kota Malang",
    provinceSlug: "jawa-timur",
    citySlug: "malang",
    description:
      "Kamera pemantau lalu lintas Kota Malang pada koridor utama dan kawasan pendidikan.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-tangerang",
    name: "Dinas Perhubungan Kota Tangerang",
    slug: "dishub-kota-tangerang",
    url: "https://dishub.tangerangkota.go.id",
    coverage: "Kota Tangerang",
    provinceSlug: "banten",
    citySlug: "tangerang",
    description:
      "Kamera pemantau lalu lintas Kota Tangerang di kawasan penyangga Jakarta.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-tangsel",
    name: "Dinas Perhubungan Kota Tangerang Selatan",
    slug: "dishub-tangerang-selatan",
    url: "https://dishub.tangerangselatankota.go.id",
    coverage: "Kota Tangerang Selatan",
    provinceSlug: "banten",
    citySlug: "tangerang-selatan",
    description:
      "Pemantauan lalu lintas Kota Tangerang Selatan pada jalur arteri dan akses tol.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-bali",
    name: "Dinas Perhubungan Provinsi Bali",
    slug: "dishub-provinsi-bali",
    url: "https://dishub.baliprov.go.id",
    coverage: "Bali",
    provinceSlug: "bali",
    description:
      "Dinas Perhubungan Provinsi Bali memantau arus lalu lintas di kawasan wisata dan jalur utama Pulau Bali.",
    operatorType: "provincial",
  },
  {
    id: "src-dishub-medan",
    name: "Dinas Perhubungan Kota Medan",
    slug: "dishub-kota-medan",
    url: "https://dishub.medan.go.id",
    coverage: "Kota Medan",
    provinceSlug: "sumatera-utara",
    citySlug: "medan",
    description:
      "ATCS Kota Medan memantau simpang utama dan jalur protokol ibu kota Sumatera Utara.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-padang",
    name: "Dinas Perhubungan Kota Padang",
    slug: "dishub-kota-padang",
    url: "https://dishub.padang.go.id",
    coverage: "Kota Padang",
    provinceSlug: "sumatera-barat",
    citySlug: "padang",
    description:
      "Kamera pemantau lalu lintas Kota Padang pada koridor pesisir dan pusat kota.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-pekanbaru",
    name: "Dinas Perhubungan Kota Pekanbaru",
    slug: "dishub-kota-pekanbaru",
    url: "https://dishub.pekanbaru.go.id",
    coverage: "Kota Pekanbaru",
    provinceSlug: "riau",
    citySlug: "pekanbaru",
    description:
      "Pemantauan lalu lintas Kota Pekanbaru melalui jaringan kamera ATCS.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-palembang",
    name: "Dinas Perhubungan Kota Palembang",
    slug: "dishub-kota-palembang",
    url: "https://dishub.palembang.go.id",
    coverage: "Kota Palembang",
    provinceSlug: "sumatera-selatan",
    citySlug: "palembang",
    description:
      "ATCS Kota Palembang memantau simpang dan jembatan utama di Sungai Musi.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-bandarlampung",
    name: "Dinas Perhubungan Kota Bandar Lampung",
    slug: "dishub-bandar-lampung",
    url: "https://dishub.bandarlampungkota.go.id",
    coverage: "Kota Bandar Lampung",
    provinceSlug: "lampung",
    citySlug: "bandar-lampung",
    description:
      "Kamera pemantau lalu lintas Kota Bandar Lampung pada jalur lintas Sumatera.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-batam",
    name: "Dinas Perhubungan Kota Batam",
    slug: "dishub-kota-batam",
    url: "https://dishub.batam.go.id",
    coverage: "Kota Batam",
    provinceSlug: "kepulauan-riau",
    citySlug: "batam",
    description:
      "Pemantauan lalu lintas Kota Batam, termasuk kawasan pelabuhan dan kawasan industri.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-pontianak",
    name: "Dinas Perhubungan Kota Pontianak",
    slug: "dishub-kota-pontianak",
    url: "https://dishub.pontianak.go.id",
    coverage: "Kota Pontianak",
    provinceSlug: "kalimantan-barat",
    citySlug: "pontianak",
    description:
      "Kamera pemantau lalu lintas Kota Pontianak pada ruas utama dan kawasan Sungai Kapuas.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-banjarmasin",
    name: "Dinas Perhubungan Kota Banjarmasin",
    slug: "dishub-kota-banjarmasin",
    url: "https://dishub.banjarmasinkota.go.id",
    coverage: "Kota Banjarmasin",
    provinceSlug: "kalimantan-selatan",
    citySlug: "banjarmasin",
    description:
      "Pemantauan lalu lintas Kota Banjarmasin pada koridor pusat kota dan jembatan.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-samarinda",
    name: "Dinas Perhubungan Kota Samarinda",
    slug: "dishub-kota-samarinda",
    url: "https://dishub.samarindakota.go.id",
    coverage: "Kota Samarinda",
    provinceSlug: "kalimantan-timur",
    citySlug: "samarinda",
    description:
      "Kamera pemantau lalu lintas Kota Samarinda di jalur utama Kalimantan Timur.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-balikpapan",
    name: "Dinas Perhubungan Kota Balikpapan",
    slug: "dishub-kota-balikpapan",
    url: "https://dishub.balikpapan.go.id",
    coverage: "Kota Balikpapan",
    provinceSlug: "kalimantan-timur",
    citySlug: "balikpapan",
    description:
      "ATCS Kota Balikpapan memantau simpang utama dan akses kawasan industri.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-manado",
    name: "Dinas Perhubungan Kota Manado",
    slug: "dishub-kota-manado",
    url: "https://dishub.manadokota.go.id",
    coverage: "Kota Manado",
    provinceSlug: "sulawesi-utara",
    citySlug: "manado",
    description:
      "Kamera pemantau lalu lintas Kota Manado pada jalur protokol dan kawasan wisata.",
    operatorType: "municipal",
  },
  {
    id: "src-dishub-makassar",
    name: "Dinas Perhubungan Kota Makassar",
    slug: "dishub-kota-makassar",
    url: "https://dishub.makassarkota.go.id",
    coverage: "Kota Makassar",
    provinceSlug: "sulawesi-selatan",
    citySlug: "makassar",
    description:
      "ATCS Kota Makassar memantau simpang utama dan koridor poros Sulawesi Selatan.",
    operatorType: "municipal",
  },
  {
    id: "src-jasamarga",
    name: "PT Jasa Marga (Persero) Tbk",
    slug: "jasa-marga",
    url: "https://www.jasamarga.com",
    coverage: "Jalan Tol Nasional",
    description:
      "Badan Usaha Milik Negara pengelola jalan tol yang memublikasikan informasi lalu lintas dan kamera pemantau pada ruas tol yang dioperasikan.",
    operatorType: "state-owned",
  },
  {
    id: "src-pelindo",
    name: "PT Pelabuhan Indonesia (Persero)",
    slug: "pelindo",
    url: "https://pelindo.co.id",
    coverage: "Pelabuhan Nasional",
    description:
      "Badan Usaha Milik Negara pengelola pelabuhan yang memublikasikan informasi operasional terminal di berbagai pelabuhan Indonesia.",
    operatorType: "state-owned",
  },
  {
    id: "src-kemenhub",
    name: "Kementerian Perhubungan Republik Indonesia",
    slug: "kemenhub",
    url: "https://kemenhub.go.id",
    coverage: "Nasional",
    description:
      "Kementerian yang membina sektor perhubungan darat, laut, udara, dan perkeretaapian. Publikasi data transportasi nasional.",
    operatorType: "national",
  },
  {
    id: "src-bpbatam",
    name: "Badan Pengusahaan Batam",
    slug: "bp-batam",
    url: "https://bpbatam.go.id",
    coverage: "Kawasan Batam",
    citySlug: "batam",
    description:
      "Badan pengelola kawasan perdagangan bebas Batam, termasuk pemantauan kawasan pelabuhan dan bandara.",
    operatorType: "national",
  },

  /* ------------------------------------------------------------------ *
   * CCTV Jalan Nasional — data resmi Kementerian PUPR
   *
   * The three operators below were sourced from the Ditjen Bina Marga GIS
   * portal (an ArcGIS FeatureServer, not a scraped page). That layer
   * publishes the official coordinates, the road segment and the stream
   * URL for each camera, which is why a subset of these cameras can be
   * embedded rather than only linked.
   *
   * There is deliberately no umbrella "Ditjen Bina Marga" entry: every one
   * of the 80 imported cameras is attributed to the specific operator that
   * actually serves its stream, and an entry that owns zero cameras would
   * make the "sumber" count on this page disagree with the homepage.
   * ------------------------------------------------------------------ */
  {
    id: "src-its-bina-marga",
    name: "ITS Bina Marga — Kementerian PUPR",
    slug: "its-bina-marga",
    url: "https://its.binamarga.pu.go.id/",
    coverage: "Jalan Nasional (Jawa)",
    description:
      "Sistem Intelligent Transport System milik Ditjen Bina Marga. Menyiarkan sebagian kamera jalan nasional sebagai stream HLS publik yang dapat disematkan.",
    operatorType: "national",
  },
  {
    id: "src-apace-ai",
    name: "APACE — Balai Pelaksana Jalan Nasional",
    slug: "apace-ai",
    url: "https://apace-ai.com/",
    coverage: "Jalan Nasional (Jawa, Lampung, Banten)",
    description:
      "Sistem pemantauan lalu lintas yang dipakai unit Balai Pelaksana Jalan Nasional (BPJN). Feed-nya disiarkan sebagai siaran langsung YouTube pada kanal resmi BPJN.",
    operatorType: "national",
  },
  {
    id: "src-pt-btu",
    name: "PT BTU — hls-proxy",
    slug: "pt-btu",
    url: "https://binamarga.pu.go.id/cctv-non-tol",
    coverage: "Jembatan & ruas jalan nasional (Jawa)",
    description:
      "Penyedia layanan hls-proxy yang dipakai katalog Bina Marga untuk sebagian kamera jembatan dan ruas jalan nasional. Stream-nya tidak dapat kami verifikasi publik, sehingga hanya ditautkan ke pemutar resmi.",
    operatorType: "other",
  },
  {
    id: "src-open-data-sambas",
    name: "Open Data Kabupaten Sambas",
    slug: "open-data-sambas",
    url: "https://opendata.sambas.go.id/Informasi/DaftardataApi/ad0b5efe-7c9f-11ef-8729-02001702e538",
    coverage: "Kabupaten Sambas",
    provinceSlug: "kalimantan-barat",
    description:
      "Dataset publik resmi yang memuat data traffic light, CCTV lalu lintas, dan warning light Kabupaten Sambas. API dapat diakses tanpa API key.",
    operatorType: "municipal",
  },
];

export const sourceBySlug = new Map(sources.map((s) => [s.slug, s]));

export function getSource(slug: string): Source | undefined {
  return sourceBySlug.get(slug);
}

export function getSourcesByProvince(provinceSlug: string): Source[] {
  return sources.filter((s) => s.provinceSlug === provinceSlug);
}
