import type { City } from "@/types/cctv";

/**
 * Cities and regencies across all 38 provinces.
 *
 * This list intentionally covers every province (so the geographic structure is
 * complete) even where no camera is registered yet. Adding a camera for any of
 * these cities requires no change to this file — see `cctv.ts`.
 *
 * Coordinates are city-centre approximations used for map centring and the
 * "nearby cities" calculation.
 */
export const cities: City[] = [
  /* ------------------------------ Aceh ------------------------------- */
  { name: "Banda Aceh", slug: "banda-aceh", province: "Aceh", provinceSlug: "aceh", region: "sumatera", latitude: 5.5483, longitude: 95.3238, isCapital: true },
  { name: "Lhokseumawe", slug: "lhokseumawe", province: "Aceh", provinceSlug: "aceh", region: "sumatera", latitude: 5.1801, longitude: 97.1507 },
  { name: "Langsa", slug: "langsa", province: "Aceh", provinceSlug: "aceh", region: "sumatera", latitude: 4.4683, longitude: 97.9683 },
  { name: "Sabang", slug: "sabang", province: "Aceh", provinceSlug: "aceh", region: "sumatera", latitude: 5.8933, longitude: 95.3214 },
  { name: "Meulaboh", slug: "meulaboh", province: "Aceh", provinceSlug: "aceh", region: "sumatera", latitude: 4.1363, longitude: 96.1285 },

  /* -------------------------- Sumatera Utara -------------------------- */
  { name: "Medan", slug: "medan", province: "Sumatera Utara", provinceSlug: "sumatera-utara", region: "sumatera", latitude: 3.5952, longitude: 98.6722, isCapital: true },
  { name: "Binjai", slug: "binjai", province: "Sumatera Utara", provinceSlug: "sumatera-utara", region: "sumatera", latitude: 3.6001, longitude: 98.485 },
  { name: "Pematangsiantar", slug: "pematangsiantar", province: "Sumatera Utara", provinceSlug: "sumatera-utara", region: "sumatera", latitude: 2.9595, longitude: 99.0687 },
  { name: "Tebing Tinggi", slug: "tebing-tinggi", province: "Sumatera Utara", provinceSlug: "sumatera-utara", region: "sumatera", latitude: 3.3285, longitude: 99.1625 },
  { name: "Sibolga", slug: "sibolga", province: "Sumatera Utara", provinceSlug: "sumatera-utara", region: "sumatera", latitude: 1.7427, longitude: 98.7792 },
  { name: "Padang Sidempuan", slug: "padang-sidempuan", province: "Sumatera Utara", provinceSlug: "sumatera-utara", region: "sumatera", latitude: 1.3739, longitude: 99.2683 },

  /* -------------------------- Sumatera Barat -------------------------- */
  { name: "Padang", slug: "padang", province: "Sumatera Barat", provinceSlug: "sumatera-barat", region: "sumatera", latitude: -0.9471, longitude: 100.4172, isCapital: true },
  { name: "Bukittinggi", slug: "bukittinggi", province: "Sumatera Barat", provinceSlug: "sumatera-barat", region: "sumatera", latitude: -0.3055, longitude: 100.3691 },
  { name: "Payakumbuh", slug: "payakumbuh", province: "Sumatera Barat", provinceSlug: "sumatera-barat", region: "sumatera", latitude: -0.2298, longitude: 100.6324 },
  { name: "Solok", slug: "solok", province: "Sumatera Barat", provinceSlug: "sumatera-barat", region: "sumatera", latitude: -0.7893, longitude: 100.6543 },
  { name: "Pariaman", slug: "pariaman", province: "Sumatera Barat", provinceSlug: "sumatera-barat", region: "sumatera", latitude: -0.6266, longitude: 100.1207 },

  /* ------------------------------- Riau ------------------------------- */
  { name: "Pekanbaru", slug: "pekanbaru", province: "Riau", provinceSlug: "riau", region: "sumatera", latitude: 0.5071, longitude: 101.4478, isCapital: true },
  { name: "Dumai", slug: "dumai", province: "Riau", provinceSlug: "riau", region: "sumatera", latitude: 1.6667, longitude: 101.45 },
  { name: "Siak Sri Indrapura", slug: "siak-sri-indrapura", province: "Riau", provinceSlug: "riau", region: "sumatera", latitude: 0.8089, longitude: 102.04 },

  /* ------------------------------- Jambi ------------------------------ */
  { name: "Jambi", slug: "jambi", province: "Jambi", provinceSlug: "jambi", region: "sumatera", latitude: -1.6101, longitude: 103.6131, isCapital: true },
  { name: "Sungai Penuh", slug: "sungai-penuh", province: "Jambi", provinceSlug: "jambi", region: "sumatera", latitude: -2.0642, longitude: 101.3913 },

  /* -------------------------- Sumatera Selatan ------------------------ */
  { name: "Palembang", slug: "palembang", province: "Sumatera Selatan", provinceSlug: "sumatera-selatan", region: "sumatera", latitude: -2.9761, longitude: 104.7754, isCapital: true },
  { name: "Prabumulih", slug: "prabumulih", province: "Sumatera Selatan", provinceSlug: "sumatera-selatan", region: "sumatera", latitude: -3.4342, longitude: 104.2357 },
  { name: "Lubuklinggau", slug: "lubuklinggau", province: "Sumatera Selatan", provinceSlug: "sumatera-selatan", region: "sumatera", latitude: -3.2967, longitude: 102.8615 },
  { name: "Pagar Alam", slug: "pagar-alam", province: "Sumatera Selatan", provinceSlug: "sumatera-selatan", region: "sumatera", latitude: -4.0217, longitude: 103.253 },

  /* ----------------------------- Bengkulu ----------------------------- */
  { name: "Bengkulu", slug: "bengkulu", province: "Bengkulu", provinceSlug: "bengkulu", region: "sumatera", latitude: -3.8004, longitude: 102.2655, isCapital: true },
  { name: "Curup", slug: "curup", province: "Bengkulu", provinceSlug: "bengkulu", region: "sumatera", latitude: -3.4667, longitude: 102.5167 },

  /* ------------------------------ Lampung ----------------------------- */
  { name: "Bandar Lampung", slug: "bandar-lampung", province: "Lampung", provinceSlug: "lampung", region: "sumatera", latitude: -5.3971, longitude: 105.2668, isCapital: true },
  { name: "Metro", slug: "metro", province: "Lampung", provinceSlug: "lampung", region: "sumatera", latitude: -5.1131, longitude: 105.3067 },
  { name: "Kalianda", slug: "kalianda", province: "Lampung", provinceSlug: "lampung", region: "sumatera", latitude: -5.7333, longitude: 105.5833 },

  /* --------------------- Kepulauan Bangka Belitung -------------------- */
  { name: "Pangkal Pinang", slug: "pangkal-pinang", province: "Kepulauan Bangka Belitung", provinceSlug: "kepulauan-bangka-belitung", region: "sumatera", latitude: -2.1316, longitude: 106.1169, isCapital: true },
  { name: "Sungailiat", slug: "sungailiat", province: "Kepulauan Bangka Belitung", provinceSlug: "kepulauan-bangka-belitung", region: "sumatera", latitude: -1.8548, longitude: 106.1219 },
  { name: "Tanjung Pandan", slug: "tanjung-pandan", province: "Kepulauan Bangka Belitung", provinceSlug: "kepulauan-bangka-belitung", region: "sumatera", latitude: -2.7456, longitude: 107.6394 },

  /* -------------------------- Kepulauan Riau -------------------------- */
  { name: "Tanjung Pinang", slug: "tanjung-pinang", province: "Kepulauan Riau", provinceSlug: "kepulauan-riau", region: "sumatera", latitude: 0.9186, longitude: 104.4666, isCapital: true },
  { name: "Batam", slug: "batam", province: "Kepulauan Riau", provinceSlug: "kepulauan-riau", region: "sumatera", latitude: 1.1301, longitude: 104.0529 },
  { name: "Karimun", slug: "karimun", province: "Kepulauan Riau", provinceSlug: "kepulauan-riau", region: "sumatera", latitude: 1.05, longitude: 103.3833 },

  /* ---------------------------- DKI Jakarta --------------------------- */
  { name: "Jakarta", slug: "jakarta", province: "DKI Jakarta", provinceSlug: "dki-jakarta", region: "jawa", latitude: -6.2088, longitude: 106.8456, isCapital: true },
  { name: "Jakarta Pusat", slug: "jakarta-pusat", province: "DKI Jakarta", provinceSlug: "dki-jakarta", region: "jawa", latitude: -6.1805, longitude: 106.8284 },
  { name: "Jakarta Selatan", slug: "jakarta-selatan", province: "DKI Jakarta", provinceSlug: "dki-jakarta", region: "jawa", latitude: -6.2615, longitude: 106.8106 },
  { name: "Jakarta Barat", slug: "jakarta-barat", province: "DKI Jakarta", provinceSlug: "dki-jakarta", region: "jawa", latitude: -6.1683, longitude: 106.7588 },
  { name: "Jakarta Timur", slug: "jakarta-timur", province: "DKI Jakarta", provinceSlug: "dki-jakarta", region: "jawa", latitude: -6.225, longitude: 106.9004 },
  { name: "Jakarta Utara", slug: "jakarta-utara", province: "DKI Jakarta", provinceSlug: "dki-jakarta", region: "jawa", latitude: -6.1214, longitude: 106.7741 },

  /* ---------------------------- Jawa Barat ---------------------------- */
  { name: "Bandung", slug: "bandung", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.9175, longitude: 107.6191, isCapital: true },
  { name: "Bekasi", slug: "bekasi", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.2383, longitude: 106.9756 },
  { name: "Bogor", slug: "bogor", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.5971, longitude: 106.806 },
  { name: "Depok", slug: "depok", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.4025, longitude: 106.7942 },
  { name: "Cimahi", slug: "cimahi", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.8722, longitude: 107.5425 },
  { name: "Cirebon", slug: "cirebon", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.732, longitude: 108.5523 },
  { name: "Sukabumi", slug: "sukabumi", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.9277, longitude: 106.93 },
  { name: "Tasikmalaya", slug: "tasikmalaya", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -7.3274, longitude: 108.2207 },
  { name: "Karawang", slug: "karawang", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.3227, longitude: 107.3376 },
  { name: "Garut", slug: "garut", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -7.2146, longitude: 107.9028 },
  { name: "Purwakarta", slug: "purwakarta", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.5569, longitude: 107.4431 },
  { name: "Subang", slug: "subang", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.5716, longitude: 107.7583 },
  { name: "Indramayu", slug: "indramayu", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.3373, longitude: 108.3238 },
  { name: "Sumedang", slug: "sumedang", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.8597, longitude: 107.9207 },
  { name: "Ciamis", slug: "ciamis", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -7.3267, longitude: 108.3531 },
  { name: "Banjar", slug: "banjar", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -7.3696, longitude: 108.5415 },
  { name: "Majalengka", slug: "majalengka", province: "Jawa Barat", provinceSlug: "jawa-barat", region: "jawa", latitude: -6.8352, longitude: 108.2278 },

  /* ---------------------------- Jawa Tengah --------------------------- */
  { name: "Semarang", slug: "semarang", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.9932, longitude: 110.4203, isCapital: true },
  { name: "Surakarta", slug: "surakarta", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.5755, longitude: 110.8243 },
  { name: "Magelang", slug: "magelang", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.4797, longitude: 110.2177 },
  { name: "Salatiga", slug: "salatiga", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.3305, longitude: 110.5084 },
  { name: "Pekalongan", slug: "pekalongan", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.8886, longitude: 109.6753 },
  { name: "Tegal", slug: "tegal", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.8694, longitude: 109.1402 },
  { name: "Kudus", slug: "kudus", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.8048, longitude: 110.8405 },
  { name: "Purwokerto", slug: "purwokerto", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.4249, longitude: 109.2396 },
  { name: "Cilacap", slug: "cilacap", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.7267, longitude: 109.0092 },
  { name: "Jepara", slug: "jepara", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.5892, longitude: 110.6681 },
  { name: "Klaten", slug: "klaten", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.7057, longitude: 110.6061 },
  { name: "Banjarnegara", slug: "banjarnegara", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.3963, longitude: 109.6951 },
  { name: "Purworejo", slug: "purworejo", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.7131, longitude: 110.0091 },
  { name: "Banyumas", slug: "banyumas", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -7.5166, longitude: 109.2938 },
  { name: "Brebes", slug: "brebes", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.8706, longitude: 109.0369 },
  { name: "Demak", slug: "demak", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.8948, longitude: 110.6385 },
  { name: "Pati", slug: "pati", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.7534, longitude: 111.04 },
  { name: "Rembang", slug: "rembang", province: "Jawa Tengah", provinceSlug: "jawa-tengah", region: "jawa", latitude: -6.7057, longitude: 111.3486 },

  /* -------------------------- DI Yogyakarta --------------------------- */
  { name: "Yogyakarta", slug: "yogyakarta", province: "DI Yogyakarta", provinceSlug: "di-yogyakarta", region: "jawa", latitude: -7.7956, longitude: 110.3695, isCapital: true },
  { name: "Sleman", slug: "sleman", province: "DI Yogyakarta", provinceSlug: "di-yogyakarta", region: "jawa", latitude: -7.7169, longitude: 110.3554 },
  { name: "Bantul", slug: "bantul", province: "DI Yogyakarta", provinceSlug: "di-yogyakarta", region: "jawa", latitude: -7.8881, longitude: 110.329 },
  { name: "Kulon Progo", slug: "kulon-progo", province: "DI Yogyakarta", provinceSlug: "di-yogyakarta", region: "jawa", latitude: -7.8262, longitude: 110.1641 },
  { name: "Gunungkidul", slug: "gunungkidul", province: "DI Yogyakarta", provinceSlug: "di-yogyakarta", region: "jawa", latitude: -7.9811, longitude: 110.6061 },

  /* ---------------------------- Jawa Timur ---------------------------- */
  { name: "Surabaya", slug: "surabaya", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.2575, longitude: 112.7521, isCapital: true },
  { name: "Malang", slug: "malang", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.9666, longitude: 112.6326 },
  { name: "Kediri", slug: "kediri", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.848, longitude: 112.0178 },
  { name: "Sidoarjo", slug: "sidoarjo", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.4478, longitude: 112.7183 },
  { name: "Gresik", slug: "gresik", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.156, longitude: 112.6531 },
  { name: "Madiun", slug: "madiun", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.6298, longitude: 111.5239 },
  { name: "Jember", slug: "jember", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -8.1689, longitude: 113.702 },
  { name: "Probolinggo", slug: "probolinggo", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.7543, longitude: 113.2159 },
  { name: "Pasuruan", slug: "pasuruan", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.6469, longitude: 112.9075 },
  { name: "Banyuwangi", slug: "banyuwangi", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -8.2192, longitude: 114.3691 },
  { name: "Mojokerto", slug: "mojokerto", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.4708, longitude: 112.4338 },
  { name: "Blitar", slug: "blitar", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -8.0954, longitude: 112.161 },
  { name: "Pacitan", slug: "pacitan", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -8.1947, longitude: 111.1036 },
  { name: "Tulungagung", slug: "tulungagung", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -8.0661, longitude: 111.9009 },
  { name: "Bojonegoro", slug: "bojonegoro", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.1525, longitude: 111.8835 },
  { name: "Trenggalek", slug: "trenggalek", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -8.0491, longitude: 111.7091 },
  { name: "Lamongan", slug: "lamongan", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.1204, longitude: 112.4156 },
  { name: "Jombang", slug: "jombang", province: "Jawa Timur", provinceSlug: "jawa-timur", region: "jawa", latitude: -7.5385, longitude: 112.238 },

  /* ------------------------------ Banten ------------------------------ */
  { name: "Serang", slug: "serang", province: "Banten", provinceSlug: "banten", region: "jawa", latitude: -6.1104, longitude: 106.1503, isCapital: true },
  { name: "Tangerang", slug: "tangerang", province: "Banten", provinceSlug: "banten", region: "jawa", latitude: -6.1783, longitude: 106.6319 },
  { name: "Tangerang Selatan", slug: "tangerang-selatan", province: "Banten", provinceSlug: "banten", region: "jawa", latitude: -6.2884, longitude: 106.7179 },
  { name: "Cilegon", slug: "cilegon", province: "Banten", provinceSlug: "banten", region: "jawa", latitude: -6.0027, longitude: 106.0114 },
  { name: "Pandeglang", slug: "pandeglang", province: "Banten", provinceSlug: "banten", region: "jawa", latitude: -6.3084, longitude: 106.1057 },
  { name: "Rangkasbitung", slug: "rangkasbitung", province: "Banten", provinceSlug: "banten", region: "jawa", latitude: -6.36, longitude: 106.25 },

  /* ------------------------------- Bali ------------------------------- */
  { name: "Denpasar", slug: "denpasar", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.6705, longitude: 115.2126, isCapital: true },
  { name: "Badung", slug: "badung", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.581, longitude: 115.177 },
  { name: "Gianyar", slug: "gianyar", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.544, longitude: 115.326 },
  { name: "Tabanan", slug: "tabanan", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.5394, longitude: 115.1254 },
  { name: "Singaraja", slug: "singaraja", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.1121, longitude: 115.0882 },
  { name: "Klungkung", slug: "klungkung", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.5394, longitude: 115.404 },
  { name: "Karangasem", slug: "karangasem", province: "Bali", provinceSlug: "bali", region: "bali-nusa-tenggara", latitude: -8.448, longitude: 115.607 },

  /* ------------------------- Nusa Tenggara Barat ---------------------- */
  { name: "Mataram", slug: "mataram", province: "Nusa Tenggara Barat", provinceSlug: "nusa-tenggara-barat", region: "bali-nusa-tenggara", latitude: -8.5833, longitude: 116.1167, isCapital: true },
  { name: "Bima", slug: "bima", province: "Nusa Tenggara Barat", provinceSlug: "nusa-tenggara-barat", region: "bali-nusa-tenggara", latitude: -8.46, longitude: 118.727 },
  { name: "Sumbawa Besar", slug: "sumbawa-besar", province: "Nusa Tenggara Barat", provinceSlug: "nusa-tenggara-barat", region: "bali-nusa-tenggara", latitude: -8.493, longitude: 117.426 },
  { name: "Praya", slug: "praya", province: "Nusa Tenggara Barat", provinceSlug: "nusa-tenggara-barat", region: "bali-nusa-tenggara", latitude: -8.705, longitude: 116.286 },

  /* ------------------------- Nusa Tenggara Timur ---------------------- */
  { name: "Kupang", slug: "kupang", province: "Nusa Tenggara Timur", provinceSlug: "nusa-tenggara-timur", region: "bali-nusa-tenggara", latitude: -10.1772, longitude: 123.607, isCapital: true },
  { name: "Maumere", slug: "maumere", province: "Nusa Tenggara Timur", provinceSlug: "nusa-tenggara-timur", region: "bali-nusa-tenggara", latitude: -8.6199, longitude: 122.2111 },
  { name: "Ende", slug: "ende", province: "Nusa Tenggara Timur", provinceSlug: "nusa-tenggara-timur", region: "bali-nusa-tenggara", latitude: -8.8432, longitude: 121.6627 },
  { name: "Labuan Bajo", slug: "labuan-bajo", province: "Nusa Tenggara Timur", provinceSlug: "nusa-tenggara-timur", region: "bali-nusa-tenggara", latitude: -8.4964, longitude: 119.8877 },
  { name: "Ruteng", slug: "ruteng", province: "Nusa Tenggara Timur", provinceSlug: "nusa-tenggara-timur", region: "bali-nusa-tenggara", latitude: -8.6114, longitude: 120.4667 },

  /* -------------------------- Kalimantan Barat ------------------------ */
  { name: "Pontianak", slug: "pontianak", province: "Kalimantan Barat", provinceSlug: "kalimantan-barat", region: "kalimantan", latitude: -0.0263, longitude: 109.3425, isCapital: true },
  { name: "Singkawang", slug: "singkawang", province: "Kalimantan Barat", provinceSlug: "kalimantan-barat", region: "kalimantan", latitude: 0.907, longitude: 108.9847 },
  { name: "Sintang", slug: "sintang", province: "Kalimantan Barat", provinceSlug: "kalimantan-barat", region: "kalimantan", latitude: 0.075, longitude: 111.5 },
  { name: "Ketapang", slug: "ketapang", province: "Kalimantan Barat", provinceSlug: "kalimantan-barat", region: "kalimantan", latitude: -1.85, longitude: 109.9833 },

  /* ------------------------- Kalimantan Tengah ------------------------ */
  { name: "Palangka Raya", slug: "palangka-raya", province: "Kalimantan Tengah", provinceSlug: "kalimantan-tengah", region: "kalimantan", latitude: -2.208, longitude: 113.9165, isCapital: true },
  { name: "Sampit", slug: "sampit", province: "Kalimantan Tengah", provinceSlug: "kalimantan-tengah", region: "kalimantan", latitude: -2.5333, longitude: 112.95 },
  { name: "Pangkalan Bun", slug: "pangkalan-bun", province: "Kalimantan Tengah", provinceSlug: "kalimantan-tengah", region: "kalimantan", latitude: -2.6833, longitude: 111.6167 },

  /* ------------------------- Kalimantan Selatan ----------------------- */
  { name: "Banjarmasin", slug: "banjarmasin", province: "Kalimantan Selatan", provinceSlug: "kalimantan-selatan", region: "kalimantan", latitude: -3.3186, longitude: 114.5944, isCapital: true },
  { name: "Banjarbaru", slug: "banjarbaru", province: "Kalimantan Selatan", provinceSlug: "kalimantan-selatan", region: "kalimantan", latitude: -3.4422, longitude: 114.8308 },
  { name: "Martapura", slug: "martapura", province: "Kalimantan Selatan", provinceSlug: "kalimantan-selatan", region: "kalimantan", latitude: -3.41, longitude: 114.85 },
  { name: "Kotabaru", slug: "kotabaru", province: "Kalimantan Selatan", provinceSlug: "kalimantan-selatan", region: "kalimantan", latitude: -3.24, longitude: 116.22 },

  /* -------------------------- Kalimantan Timur ------------------------ */
  { name: "Samarinda", slug: "samarinda", province: "Kalimantan Timur", provinceSlug: "kalimantan-timur", region: "kalimantan", latitude: -0.5022, longitude: 117.1536, isCapital: true },
  { name: "Balikpapan", slug: "balikpapan", province: "Kalimantan Timur", provinceSlug: "kalimantan-timur", region: "kalimantan", latitude: -1.2379, longitude: 116.8529 },
  { name: "Bontang", slug: "bontang", province: "Kalimantan Timur", provinceSlug: "kalimantan-timur", region: "kalimantan", latitude: 0.1324, longitude: 117.4854 },
  { name: "Tenggarong", slug: "tenggarong", province: "Kalimantan Timur", provinceSlug: "kalimantan-timur", region: "kalimantan", latitude: -0.4167, longitude: 116.9833 },

  /* -------------------------- Kalimantan Utara ------------------------ */
  { name: "Tanjung Selor", slug: "tanjung-selor", province: "Kalimantan Utara", provinceSlug: "kalimantan-utara", region: "kalimantan", latitude: 2.8375, longitude: 117.366, isCapital: true },
  { name: "Tarakan", slug: "tarakan", province: "Kalimantan Utara", provinceSlug: "kalimantan-utara", region: "kalimantan", latitude: 3.3274, longitude: 117.576 },
  { name: "Malinau", slug: "malinau", province: "Kalimantan Utara", provinceSlug: "kalimantan-utara", region: "kalimantan", latitude: 3.5833, longitude: 116.6333 },

  /* -------------------------- Sulawesi Utara -------------------------- */
  { name: "Manado", slug: "manado", province: "Sulawesi Utara", provinceSlug: "sulawesi-utara", region: "sulawesi", latitude: 1.4748, longitude: 124.8421, isCapital: true },
  { name: "Bitung", slug: "bitung", province: "Sulawesi Utara", provinceSlug: "sulawesi-utara", region: "sulawesi", latitude: 1.4404, longitude: 125.1216 },
  { name: "Tomohon", slug: "tomohon", province: "Sulawesi Utara", provinceSlug: "sulawesi-utara", region: "sulawesi", latitude: 1.3245, longitude: 124.8393 },
  { name: "Kotamobagu", slug: "kotamobagu", province: "Sulawesi Utara", provinceSlug: "sulawesi-utara", region: "sulawesi", latitude: 0.7333, longitude: 124.3167 },

  /* ------------------------- Sulawesi Tengah -------------------------- */
  { name: "Palu", slug: "palu", province: "Sulawesi Tengah", provinceSlug: "sulawesi-tengah", region: "sulawesi", latitude: -0.8917, longitude: 119.8707, isCapital: true },
  { name: "Luwuk", slug: "luwuk", province: "Sulawesi Tengah", provinceSlug: "sulawesi-tengah", region: "sulawesi", latitude: -0.9396, longitude: 122.791 },
  { name: "Poso", slug: "poso", province: "Sulawesi Tengah", provinceSlug: "sulawesi-tengah", region: "sulawesi", latitude: -1.3959, longitude: 120.7524 },

  /* ------------------------- Sulawesi Selatan ------------------------- */
  { name: "Makassar", slug: "makassar", province: "Sulawesi Selatan", provinceSlug: "sulawesi-selatan", region: "sulawesi", latitude: -5.1477, longitude: 119.4327, isCapital: true },
  { name: "Parepare", slug: "parepare", province: "Sulawesi Selatan", provinceSlug: "sulawesi-selatan", region: "sulawesi", latitude: -4.0135, longitude: 119.6255 },
  { name: "Palopo", slug: "palopo", province: "Sulawesi Selatan", provinceSlug: "sulawesi-selatan", region: "sulawesi", latitude: -2.9925, longitude: 120.1965 },
  { name: "Maros", slug: "maros", province: "Sulawesi Selatan", provinceSlug: "sulawesi-selatan", region: "sulawesi", latitude: -5.0, longitude: 119.5667 },
  { name: "Bulukumba", slug: "bulukumba", province: "Sulawesi Selatan", provinceSlug: "sulawesi-selatan", region: "sulawesi", latitude: -5.55, longitude: 120.2 },

  /* ------------------------ Sulawesi Tenggara ------------------------- */
  { name: "Kendari", slug: "kendari", province: "Sulawesi Tenggara", provinceSlug: "sulawesi-tenggara", region: "sulawesi", latitude: -3.945, longitude: 122.4989, isCapital: true },
  { name: "Baubau", slug: "baubau", province: "Sulawesi Tenggara", provinceSlug: "sulawesi-tenggara", region: "sulawesi", latitude: -5.4667, longitude: 122.6167 },

  /* ---------------------------- Gorontalo ----------------------------- */
  { name: "Gorontalo", slug: "gorontalo", province: "Gorontalo", provinceSlug: "gorontalo", region: "sulawesi", latitude: 0.5435, longitude: 123.0568, isCapital: true },

  /* -------------------------- Sulawesi Barat -------------------------- */
  { name: "Mamuju", slug: "mamuju", province: "Sulawesi Barat", provinceSlug: "sulawesi-barat", region: "sulawesi", latitude: -2.6766, longitude: 118.8885, isCapital: true },
  { name: "Majene", slug: "majene", province: "Sulawesi Barat", provinceSlug: "sulawesi-barat", region: "sulawesi", latitude: -3.54, longitude: 118.97 },

  /* ------------------------------ Maluku ------------------------------ */
  { name: "Ambon", slug: "ambon", province: "Maluku", provinceSlug: "maluku", region: "maluku", latitude: -3.6954, longitude: 128.1814, isCapital: true },
  { name: "Tual", slug: "tual", province: "Maluku", provinceSlug: "maluku", region: "maluku", latitude: -5.6296, longitude: 132.7417 },
  { name: "Masohi", slug: "masohi", province: "Maluku", provinceSlug: "maluku", region: "maluku", latitude: -3.3, longitude: 128.9667 },

  /* --------------------------- Maluku Utara --------------------------- */
  { name: "Ternate", slug: "ternate", province: "Maluku Utara", provinceSlug: "maluku-utara", region: "maluku", latitude: 0.79, longitude: 127.38, isCapital: true },
  { name: "Sofifi", slug: "sofifi", province: "Maluku Utara", provinceSlug: "maluku-utara", region: "maluku", latitude: 0.7333, longitude: 127.5667 },
  { name: "Tidore", slug: "tidore", province: "Maluku Utara", provinceSlug: "maluku-utara", region: "maluku", latitude: 0.6833, longitude: 127.45 },

  /* ------------------------------ Papua ------------------------------- */
  { name: "Jayapura", slug: "jayapura", province: "Papua", provinceSlug: "papua", region: "papua", latitude: -2.5916, longitude: 140.669, isCapital: true },
  { name: "Biak", slug: "biak", province: "Papua", provinceSlug: "papua", region: "papua", latitude: -1.18, longitude: 136.08 },
  { name: "Sentani", slug: "sentani", province: "Papua", provinceSlug: "papua", region: "papua", latitude: -2.5833, longitude: 140.5167 },

  /* --------------------------- Papua Barat ---------------------------- */
  { name: "Manokwari", slug: "manokwari", province: "Papua Barat", provinceSlug: "papua-barat", region: "papua", latitude: -0.8615, longitude: 134.062, isCapital: true },
  { name: "Teluk Wondama", slug: "teluk-wondama", province: "Papua Barat", provinceSlug: "papua-barat", region: "papua", latitude: -2.7167, longitude: 134.5 },

  /* -------------------------- Papua Selatan --------------------------- */
  { name: "Merauke", slug: "merauke", province: "Papua Selatan", provinceSlug: "papua-selatan", region: "papua", latitude: -8.4932, longitude: 140.4018, isCapital: true },

  /* --------------------------- Papua Tengah --------------------------- */
  { name: "Nabire", slug: "nabire", province: "Papua Tengah", provinceSlug: "papua-tengah", region: "papua", latitude: -3.35, longitude: 135.4833, isCapital: true },
  { name: "Timika", slug: "timika", province: "Papua Tengah", provinceSlug: "papua-tengah", region: "papua", latitude: -4.546, longitude: 136.884 },

  /* ------------------------ Papua Pegunungan -------------------------- */
  { name: "Wamena", slug: "wamena", province: "Papua Pegunungan", provinceSlug: "papua-pegunungan", region: "papua", latitude: -4.0975, longitude: 138.945, isCapital: true },

  /* ------------------------- Papua Barat Daya ------------------------- */
  { name: "Sorong", slug: "sorong", province: "Papua Barat Daya", provinceSlug: "papua-barat-daya", region: "papua", latitude: -0.8762, longitude: 131.2558, isCapital: true },
];

export const cityBySlug = new Map(cities.map((c) => [c.slug, c]));

export function getCity(slug: string): City | undefined {
  return cityBySlug.get(slug);
}

export function getCitiesByProvince(provinceSlug: string): City[] {
  return cities.filter((c) => c.provinceSlug === provinceSlug);
}

export function getCitiesByRegion(region: string): City[] {
  return cities.filter((c) => c.region === region);
}
