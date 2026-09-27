# CCTV Indonesia

Platform agregator **CCTV publik Indonesia** — pantau kamera publik dan kondisi lalu lintas di berbagai wilayah Indonesia.

Dibangun dengan **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**. Aplikasi ini **frontend-only**: tidak ada backend, tidak ada database, tidak ada API key. Seluruh data kamera, kota, provinsi, dan sumber berasal dari lapisan data statis yang bertipe kuat di `src/data/`.

---

## Daftar Isi

- [Menjalankan Proyek](#menjalankan-proyek)
- [Arsitektur](#arsitektur)
- [Struktur Folder](#struktur-folder)
- [Menambah Data](#menambah-data)
  - [Menambah CCTV](#menambah-cctv)
  - [Menambah Kota](#menambah-kota)
  - [Menambah Provinsi](#menambah-provinsi)
  - [Menambah Sumber](#menambah-sumber)
- [Tipe Stream yang Didukung](#tipe-stream-yang-didukung)
- [Sumber Data Resmi](#sumber-data-resmi)
- [Kebijakan Sumber Data](#kebijakan-sumber-data)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Troubleshooting](#troubleshooting)
- [Perintah](#perintah)

---

## Menjalankan Proyek

Butuh **Node.js 20+** (disarankan 22).

```bash
npm install
npm run dev
```

Buka <http://localhost:3000>.

### Build produksi

```bash
npm run build
npm run start
```

### Pemeriksaan kualitas

```bash
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run validate:data  # validasi integritas data statis
```

`validate:data` memakai Zod untuk memvalidasi seluruh dataset: bentuk data, rentang koordinat, enum kategori/tipe stream/status, format URL, keunikan `id`/`slug`, dan integritas referensial antar-berkas (mis. `citySlug` harus ada di `cities.ts` **dan** berada di provinsi yang benar). Perintah ini keluar dengan kode non-nol bila ada error, sehingga bisa dipakai sebagai gerbang CI.

Saat `NODE_ENV=development`, validasi yang sama juga dijalankan otomatis di browser dan hasilnya dicetak ke console.

---

## Arsitektur

Prinsip utamanya: **satu sumber kebenaran**. Semua halaman, filter, penanda peta, statistik, sitemap, dan pencarian diturunkan dari `src/data/` — tidak ada komponen yang menyimpan datanya sendiri.

```
src/data/*        →  data statis (satu-satunya sumber)
src/types/*       →  kontrak tipe
src/lib/*         →  logika murni: query, statistik, geo, validasi
src/hooks/*       →  hook React (filter URL, favorit, HLS, dll.)
src/stores/*      →  state klien (Zustand, dipersist ke localStorage)
src/components/*  →  UI
src/app/*         →  rute App Router
```

**State filter hidup di URL**, bukan di state global. Membuka `/cctv?province=jawa-barat&city=bekasi&category=traffic` akan mempertahankan filter saat halaman dimuat ulang, dan URL-nya bisa dibagikan apa adanya. Lihat `src/hooks/use-filters.ts`.

**Zustand hanya untuk state klien yang benar-benar global** — favorit, riwayat dilihat, riwayat pencarian, dan preferensi tampilan. Semuanya `skipHydration` lalu dihidrasi ulang setelah mount di `src/components/providers.tsx`, sehingga HTML dari server selalu identik dengan render klien pertama (tidak ada hydration mismatch).

### Performa

- Stream video **tidak pernah diputar otomatis** dalam jumlah banyak. `CCTVCard` menampilkan poster dan hanya memasang stream ketika pengguna menekan "Pratinjau". Ini yang mencegah grid 24 kartu membuka 24 koneksi sekaligus.
- `hls.js` di-`import()` secara dinamis dan hanya dimuat saat benar-benar ada stream HLS yang diputar.
- Peta dimuat dengan `next/dynamic` + `ssr: false`, sehingga Leaflet tidak masuk bundel awal dan tidak pernah dieksekusi di server.
- Halaman `/` tidak memuat kode peta maupun pemutar video sama sekali.

---

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx                 # kerangka aplikasi, font, metadata
│   ├── page.tsx                   # beranda
│   ├── loading.tsx  error.tsx  not-found.tsx  global-error.tsx
│   ├── cctv/
│   │   ├── page.tsx               # penjelajah CCTV
│   │   └── [slug]/
│   │       ├── page.tsx           # detail kamera
│   │       ├── loading.tsx
│   │       └── opengraph-image.tsx
│   ├── map/page.tsx               # peta interaktif
│   ├── cities/
│   │   ├── page.tsx               # direktori kota
│   │   └── [citySlug]/page.tsx
│   ├── provinces/[provinceSlug]/page.tsx
│   ├── favorites/page.tsx
│   ├── sources/page.tsx
│   ├── about/page.tsx
│   ├── terms/page.tsx
│   ├── sitemap.ts  robots.ts  manifest.ts
│   ├── icon.svg  apple-icon.svg
│   └── globals.css                # design token (light + dark)
├── components/
│   ├── cctv/                      # kartu, grid, list, pemutar, filter, peta
│   ├── map/                       # Leaflet: kontainer, kontrol, cluster
│   ├── home/                      # bagian-bagian beranda
│   ├── geo/                       # komponen kota & provinsi
│   ├── favorites/  sources/
│   ├── shared/                    # kartu kota/provinsi/kategori/sumber, breadcrumb
│   ├── layout/                    # header, footer, navigasi bawah, sidebar
│   ├── providers.tsx
│   └── ui/                        # primitif shadcn/ui
├── data/                          # ← SATU-SATUNYA SUMBER DATA
│   ├── cctv.ts
│   ├── cities.ts
│   ├── provinces.ts
│   ├── categories.ts
│   ├── regions.ts
│   └── sources.ts
├── hooks/
├── lib/
├── stores/
└── types/cctv.ts
```

---

## Menambah Data

> Tidak ada satu pun komponen yang perlu diubah saat menambah kamera. Cukup edit berkas data, lalu jalankan `npm run validate:data`.

### Menambah CCTV

Tambahkan satu objek ke array di **`src/data/cctv.ts`**:

```ts
{
  id: "bekasi-ahmad-yani-01",          // unik
  name: "CCTV Ahmad Yani",
  slug: "cctv-ahmad-yani-bekasi",      // unik, kebab-case, dipakai di URL
  province: "Jawa Barat",
  provinceSlug: "jawa-barat",          // harus ada di provinces.ts
  city: "Bekasi",
  citySlug: "bekasi",                  // harus ada di cities.ts & cocok provinsinya
  district: "Bekasi Selatan",          // opsional
  address: "Simpang Jl. Ahmad Yani",   // opsional
  latitude: -6.2383,                   // -90..90
  longitude: 106.9756,                 // -180..180
  category: "intersection",            // lihat daftar kategori
  streamType: "external",              // lihat bagian tipe stream
  sourceName: "Dinas Perhubungan Kota Bekasi",
  sourceSlug: "dishub-kota-bekasi",    // harus ada di sources.ts
  sourceUrl: "https://dishub.bekasikota.go.id",
  status: "online",                    // "online" | "offline" | "unknown"
  description: "Simpang utama di pusat Kota Bekasi.",
  isFeatured: true,                    // opsional, tampil di beranda
  tags: ["atcs", "simpang"],           // opsional, ikut terindeks pencarian
  lastChecked: "2026-09-20T08:00:00+07:00", // opsional, ISO 8601 dengan offset
  metadata: {                          // opsional
    direction: "Semua arah",
    road: "Jl. Ahmad Yani",
    operator: "Dinas Perhubungan Kota Bekasi",
  },
}
```

**Kategori yang tersedia:** `traffic`, `road`, `intersection`, `highway`, `public-space`, `port`, `airport`, `other`.

Yang divalidasi otomatis: bentuk objek, rentang koordinat, enum kategori/tipe stream/status, format URL (hanya `http`/`https`), keunikan `id` dan `slug`, keberadaan `provinceSlug`/`citySlug`/`sourceSlug`, serta konsistensi kota terhadap provinsinya.

### Menambah Kota

Edit **`src/data/cities.ts`**:

```ts
{
  name: "Singkawang",
  slug: "singkawang",
  province: "Kalimantan Barat",
  provinceSlug: "kalimantan-barat",
  region: "kalimantan",              // sumatera | jawa | kalimantan | sulawesi |
                                     // bali-nusa-tenggara | maluku | papua
  latitude: 0.907,
  longitude: 108.9847,
  isCapital: false,                  // opsional
}
```

Kota yang belum punya kamera tetap boleh terdaftar. Kota seperti itu:

- tetap mendapat halaman statis di `/cities/<slug>` dengan empty state yang sudah dirancang, dan
- muncul sebagai chip "belum ada kamera" di halaman provinsinya, sehingga cakupan yang belum tergarap terlihat jujur.

Konsekuensinya, **setiap kota di `cities.ts` menambah satu halaman pada build**. Halaman dengan kamera juga masuk ke `sitemap.xml`; halaman tanpa kamera sengaja tidak, karena isinya masih tipis.

### Menambah Provinsi

Edit **`src/data/provinces.ts`**:

```ts
{
  name: "Papua Barat Daya",
  slug: "papua-barat-daya",
  region: "papua",
  code: "96",          // kode BPS, tepat 2 digit
  capital: "Sorong",
}
```

Sama seperti kota, provinsi tanpa kamera tetap mendapat halaman `/provinces/<slug>` dengan empty state, dan kini ikut ditautkan dari indeks provinsi di beranda. Halaman provinsi/kota memakai `dynamicParams = false`, jadi slug yang tidak ada di `provinces.ts`/`cities.ts` menghasilkan **404 sungguhan**, bukan soft-404.

### Menambah Sumber

Edit **`src/data/sources.ts`**:

```ts
{
  id: "src-dishub-batam",
  name: "Dinas Perhubungan Kota Batam",
  slug: "dishub-kota-batam",         // dirujuk oleh camera.sourceSlug
  url: "https://dishub.batam.go.id", // portal publik resmi
  coverage: "Kota Batam",
  provinceSlug: "kepulauan-riau",    // opsional
  citySlug: "batam",                 // opsional
  description: "…",
  operatorType: "municipal",         // national | provincial | municipal | state-owned | other
}
```

---

## Tipe Stream yang Didukung

| `streamType` | Cara render | Catatan |
| --- | --- | --- |
| `hls` | `<video>` + `hls.js` | Butuh `streamUrl`. Di Safari memakai pemutaran native. |
| `mjpeg` | `<img>` | Butuh `streamUrl`. Dirender oleh pipeline gambar bawaan browser. |
| `image` | `<img>` | Butuh `streamUrl`. Snapshot; disegarkan berkala selama terlihat. |
| `iframe` | `<iframe sandbox>` | Butuh `streamUrl`. Untuk halaman yang memang boleh disematkan. |
| `youtube` | Embed `youtube-nocookie.com` | Butuh `streamUrl` berupa tautan tonton YouTube. |
| `external` | Kartu atribusi + tautan keluar | **Tidak boleh punya `streamUrl`.** Ini tipe default untuk kamera nyata. |

`streamType: "external"` berarti kami **tidak menyematkan** feed-nya sama sekali — hanya menautkan ke portal resmi operator. Skema Zod menolak konfigurasi yang tidak konsisten: tipe yang bisa disematkan wajib punya `streamUrl`, dan `external` dilarang punya `streamUrl`. Dengan begitu tidak mungkin ada embed mati yang diam-diam tampil sebagai "live".

`src/components/cctv/cctv-player.tsx` menangani seluruh status: memuat, menghubungkan, live, offline, error, tidak didukung, dan sumber eksternal. Tidak pernah ada iframe kosong yang rusak — selalu ada penjelasan dan tautan keluar.

---

## Sumber Data Resmi

Kamera yang **benar-benar bisa diputar di dalam aplikasi** berasal dari satu API publik resmi:

> **Ditjen Bina Marga, Kementerian PUPR — GIS FeatureServer**
> `https://gisportal.binamarga.pu.go.id/arcgis/rest/services/Hosted/cctv_jalnas_20260408/FeatureServer/0`
>
> Kueri: `?where=1%3D1&outFields=*&returnGeometry=false&f=json`

Lapisan ini menerbitkan **80 kamera jalan nasional** dengan koordinat resmi (`lat`/`lon`), nama ruas (`ruas`), kota (`kota`), dan URL stream (`url_stream`). Semua kamera itu diimpor dengan prefiks `id: "bm-…"` dan dibagi ke dalam tiga keluarga stream:

| Keluarga | Jumlah | Tipe | Cara diputar |
| --- | --- | --- | --- |
| `apace` | 32 | `youtube` | Kanal YouTube **resmi** BPJN (Balai Pelaksana Jalan Nasional) — disematkan via `youtube-nocookie.com`. Semua ID sudah dicek `playableInEmbed: true`. |
| `its` | 10 | `hls` | `https://its.binamarga.pu.go.id:8989/play/hls/CT-NN/index.m3u8` — mengirim `Access-Control-Allow-Origin: *` (termasuk preflight `OPTIONS`), jadi bisa dimuat `hls.js` langsung di browser. |
| `ch` | 38 | `external` | HLS di balik `apps.ptbtu.com:8078` — hostnya **tidak dapat dihubungi**, sehingga tidak diverifikasi dan tidak disematkan. Hanya kartu atribusi + tautan keluar. |

**Kebijakan verifikasi status.** Kolom `status` pada lapisan ArcGIS **tidak dipercaya apa adanya** — lapisan itu mengklaim semua kamera online, padahal sebagian mengembalikan playlist kosong. Karena itu setiap kamera diverifikasi ulang secara mandiri saat impor:

- `its` → isi playlist HLS (`#EXTM3U` + `#EXTINF`); HTTP 200 dengan body kosong berarti kamera mati.
- `apace` → `isLiveNow` pada halaman tonton YouTube.
- `ch` → `unknown`, karena hostnya tidak dapat dijangkau.

Hasil verifikasi terakhir (2026-09-26): **25 online, 17 offline, 38 unknown**. Nilai inilah yang ditulis ke dataset, bukan klaim dari lapisan sumber. Timestamp verifikasi disimpan di konstanta `CHECKED_NATIONAL` (`src/data/cctv.ts`).

**Yang sengaja tidak diimpor.** Beberapa portal operator hanya menyediakan penampil, bukan endpoint publik yang stabil:

- `jakcctv.jakarta.go.id` mewajibkan **login** → wajib `external`, tidak boleh disematkan atau dikikis.
- Kira-kira 20 host operator tol (`jmlive.jasamarga.com`, `cctv.citramarga.com`, `stream.bsdtol.com`, dst.) terlihat lewat `connect-src` pada CSP halaman operator. Ini kandidat putaran berikutnya, belum diverifikasi, jadi belum ada di dataset.
- Kamera ATMS Kemenhub yang disajikan lewat iframe `hubnet.kemenhub.go.id` belum diimpor.

---

## Kebijakan Sumber Data

Aturan yang tidak boleh dilanggar:

1. **Jangan mengarang URL stream langsung.** Kalau stream publik yang stabil tidak bisa diverifikasi, gunakan `streamType: "external"` dan tautkan ke halaman resmi operator.
2. **Jangan pernah menganggap tautan eksternal sebagai kamera live.** Tandai dengan jelas: LIVE, EXTERNAL, OFFLINE, atau UNAVAILABLE.
3. **Jangan mengikis (scrape) feed privat atau terautentikasi.** Hanya sumber yang benar-benar publik.
4. **Verifikasi URL sebelum menambahkannya.** Semua URL di `sources.ts` sudah diperiksa dapat diakses.
5. **Kreditkan operator.** Setiap kamera wajib punya `sourceName` + `sourceUrl`.
6. **Konten pihak ketiga tidak boleh didistribusikan ulang** tanpa izin. Situs ini tidak menyimpan rekaman apa pun.

Entri dengan `isSample: true` adalah **entri demonstrasi** yang dipakai untuk menguji jalur kode pemutar (HLS/gambar/iframe/YouTube). Entri ini diberi label "Contoh" di UI, dikecualikan dari statistik utama, dan diberi `noindex` agar tidak pernah disalahartikan sebagai CCTV Indonesia.

---

## Variabel Lingkungan

Aplikasi ini **tidak membutuhkan API key apa pun**. Satu-satunya variabel opsional adalah URL kanonik situs:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SITE_URL=https://domain-anda.example
```

Dipakai oleh `src/lib/site.ts` untuk `metadataBase`, URL kanonik, Open Graph, `sitemap.xml`, `robots.txt`, dan tautan berbagi. Bila kosong, dipakai nilai default.

---

## Troubleshooting

### HLS tidak mau diputar

- **Cek format URL.** Harus berakhiran `.m3u8` dan dilayani melalui **HTTPS**. Stream `http://` akan diblokir browser sebagai mixed content saat situs diakses via HTTPS.
- **Cek CORS.** Server stream harus mengirim `Access-Control-Allow-Origin`. Tanpa itu `hls.js` gagal memuat manifes. Ini penyebab paling umum kegagalan HLS.
- **Cek apakah manifesnya benar-benar master playlist.** Beberapa endpoint hanya mengembalikan daftar segmen.
- **Safari/iOS** memakai pemutaran native, bukan `hls.js` — perbedaan perilaku di situ wajar.
- **Kode error** ada di console dengan awalan `[hls]`. Pemutar mencoba pemulihan otomatis sekali (`startLoad()` untuk error jaringan, `recoverMediaError()` untuk error media) sebelum menampilkan status error.
- Kalau stream memang tidak stabil, pertimbangkan mengubahnya menjadi `streamType: "external"`. Itu pilihan yang jujur.

### Iframe tidak menampilkan apa pun

- Banyak situs mengirim header `X-Frame-Options: DENY` atau `Content-Security-Policy: frame-ancestors 'none'`, sehingga **tidak bisa** disematkan. Ini tidak bisa diakali dari sisi klien — gunakan `streamType: "external"`.
- Iframe dirender dengan atribut `sandbox`. Kalau kontennya butuh kemampuan tambahan, sesuaikan daftar `sandbox` di `cctv-player.tsx`.
- `referrerPolicy="no-referrer"` dipakai untuk iframe umum; sebagian penyedia butuh referrer, jadi perlu pengecualian.
- **Jangan pernah** menyematkan konten terautentikasi atau konten yang melarang penyematan secara eksplisit.

### Peta tidak muncul

- Kontainer peta **wajib punya tinggi eksplisit** — Leaflet merender setinggi 0px bila tingginya hanya ditentukan oleh konten. Ini bug Leaflet yang paling sering terjadi.
- Peta harus dimuat dengan `dynamic(..., { ssr: false })`. `leaflet` mengakses `window` saat impor, sehingga akan gagal bila dirender di server.

### `Internal: NoFallbackError` muncul di log server

Ini **bukan** bug aplikasi, melainkan artefak internal Next.js 15. Setiap permintaan ke rute yang memakai `dynamicParams = false` (`/cctv/[slug]`, `/cities/[citySlug]`, `/provinces/[provinceSlug]`) dengan slug yang tidak ada di `generateStaticParams` akan mencatat satu baris `Error: Internal: NoFallbackError` di console server. Respons yang diterima klien tetap **404 yang benar** beserta halaman "Halaman tidak ditemukan" milik aplikasi. Rute yang tidak cocok dengan pola apa pun (mis. `/halaman-acak`) tidak mencatat apa-apa — jadi baris log ini hanya muncul untuk slug yang bentuknya valid tapi isinya tidak dikenal. Ini harga yang dibayar untuk menghindari soft-404; jangan "diperbaiki" dengan mengembalikan `notFound()` biasa, karena `loading.tsx` akan lebih dulu mengalirkan shell HTTP 200.

### Peringatan hydration mismatch

Penyebab umum: mengakses `window`, `localStorage`, `new Date()`, atau `Date.now()` saat render. Semua store dipersist memakai `skipHydration` dan dihidrasi ulang setelah mount; komponen yang bergantung padanya harus digerbangi dengan `useMounted()` dari `@/hooks/use-mounted`.

---

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Server pengembangan |
| `npm run build` | Build produksi |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | ESLint |
| `npm run typecheck` | Pemeriksaan tipe (`tsc --noEmit`) |
| `npm run validate:data` | Validasi integritas data statis |

---

## Lisensi & Atribusi

Kode aplikasi ini terpisah dari kontennya.

**Seluruh rekaman CCTV adalah milik operator masing-masing.** Situs ini tidak memiliki, menyimpan, merekam, atau mendistribusikan ulang video apa pun. Semua kamera diatribusikan ke sumber resminya melalui `sourceName` + `sourceUrl`, dan dapat dilihat di halaman [Sumber](/sources).

Data operator berasal dari portal publik resmi instansi dan BUMN. Ketersediaan kamera dapat berubah sewaktu-waktu tanpa pemberitahuan. Kolom `status` adalah atribut katalog yang **diverifikasi saat impor**, bukan hasil pemantauan kesehatan secara langsung — kamera yang saat ini `online` bisa saja mati beberapa menit kemudian. Untuk kamera `external`, status tidak dapat diverifikasi sama sekali dan ditandai `unknown`.
# cctv
