import { Building2, Camera, Globe, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { StatStrip } from "@/components/cctv/cctv-stats";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { realCCTVData, sampleCCTVData } from "@/data/cctv";
import { provinces } from "@/data/provinces";
import { buildMetadata } from "@/lib/metadata";
import { getStats } from "@/lib/stats";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Tentang",
  description:
    "CCTV Indonesia adalah katalog kamera CCTV publik Indonesia. Pelajari cara data dikumpulkan, mengapa kami tidak memiliki rekaman, dan bagaimana berkontribusi.",
  path: "/about",
  keywords: [
    "tentang cctv indonesia",
    "katalog cctv publik",
    "atribusi cctv",
    "data cctv terbuka",
  ],
});

/** A titled block of prose inside a Card. */
function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <Card id={id} className="scroll-mt-24">
      <CardHeader>
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h2>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {children}
      </CardContent>
    </Card>
  );
}

export default function AboutPage() {
  const stats = getStats(realCCTVData);
  const totalProvinces = provinces.length;

  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Tentang" }]}
      />

      <div className="mx-auto max-w-3xl">
        <header className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Tentang CCTV Indonesia
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            CCTV Indonesia adalah katalog independen yang menghimpun tautan ke
            kamera pemantau lalu lintas dan ruang publik yang dipublikasikan
            secara resmi oleh instansi di Indonesia. Tujuannya sederhana:
            membantu siapa pun menemukan kamera publik yang relevan tanpa harus
            menelusuri puluhan portal pemerintah satu per satu.
          </p>
        </header>

        <div className="mt-8">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Angka saat ini
          </h2>
          <StatStrip
            className="mt-3"
            items={[
              {
                label: "Kamera",
                value: stats.cameras,
                icon: Camera,
                accent: "bg-primary/10 text-primary",
              },
              {
                label: "Kota",
                value: stats.cities,
                icon: Building2,
                accent: "bg-muted text-muted-foreground",
              },
              {
                label: "Provinsi",
                value: stats.provinces,
                icon: MapPin,
                accent: "bg-muted text-muted-foreground",
              },
              {
                label: "Sumber",
                value: stats.sources,
                icon: Globe,
                accent: "bg-muted text-muted-foreground",
              },
            ]}
          />
        </div>

        <div className="mt-10 space-y-5">
          <Section id="apa-itu" title="Apa itu CCTV Indonesia">
            <p>
              CCTV Indonesia bukan lembaga pemerintah dan bukan penyedia
              kamera. Kami hanya mengurasi dan menyusun informasi yang sudah
              tersedia untuk umum — nama lokasi, kota, kategori, perkiraan
              koordinat, dan tautan ke halaman resmi operator.
            </p>
            <p>
              Setiap kamera selalu ditampilkan bersama operatornya. Katalog ini
              dimaksudkan sebagai pintu masuk, bukan pengganti portal resmi;
              untuk rekaman terbaru, selalu utamakan situs operator yang
              bersangkutan.
            </p>
          </Section>

          <Section id="cara-data" title="Bagaimana data dikumpulkan">
            <p>
              Entri kamera dikatalogkan secara manual dari halaman publik yang
              diterbitkan oleh operator, seperti portal dinas perhubungan dan
              program kota pintar. Kami tidak mengikis (scrape) feed privat,
              berautentikasi, atau di balik pembayaran, dan kami tidak
              menerobos pembatasan akses apa pun.
            </p>
            <p>
              Dataset ini bersifat statis dan dikurasi tangan: satu berkas data
              memuat seluruh kamera, dan tidak ada pengambilan data langsung
              saat situs dibuka. Daftar operator beserta cakupannya dapat
              dilihat di{" "}
              <Link
                href="/sources"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                halaman Sumber
              </Link>
              .
            </p>
          </Section>

          <Section id="tidak-memiliki" title="Kami tidak memiliki rekaman">
            <p>
              Semua rekaman CCTV adalah milik operator masing-masing. Situs ini{" "}
              <strong className="font-medium text-foreground">
                tidak memiliki, tidak merekam, tidak menyimpan, dan tidak
                mendistribusikan ulang
              </strong>{" "}
              video apa pun.
            </p>
            <p>
              Sebagian besar kamera dalam katalog bertipe{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                external
              </code>
              , yang berarti kami hanya menautkan ke halaman resmi operator dan
              tidak menyematkan (embed) feed-nya. Ketika sebuah kamera dapat
              disematkan, itu karena operator menyediakan endpoint publik yang
              memang boleh disematkan — tetap dengan atribusi penuh.
            </p>
          </Section>

          <Section id="status" title="Status kamera">
            <p>
              Label <em>online</em>, <em>offline</em>, atau <em>tidak
              diketahui</em> adalah atribut statis yang dicatat saat katalog
              disusun —{" "}
              <strong className="font-medium text-foreground">
                bukan hasil pemeriksaan kesehatan (health check) langsung
              </strong>
              .
            </p>
            <p>
              Artinya, status bisa saja sudah tidak sesuai kenyataan. Jika
              sebuah kamera tampak offline, kamera itu mungkin sudah kembali
              aktif; dan sebaliknya. Jangan menjadikan status di sini sebagai
              satu-satunya rujukan.
            </p>
          </Section>

          <Section id="akurasi" title="Akurasi dan keterbatasan">
            <p>
              Cakupan kami masih parsial. Saat ini baru{" "}
              <strong className="font-medium text-foreground">
                {formatNumber(stats.provinces)} dari {formatNumber(totalProvinces)} provinsi
              </strong>{" "}
              di Indonesia yang memiliki kamera dalam katalog, mencakup{" "}
              {formatNumber(stats.cities)} kota dan {formatNumber(stats.cameras)}{" "}
              kamera nyata.
            </p>
            <p>
              Koordinat yang ditampilkan adalah perkiraan lokasi dan dapat
              bergeser beberapa meter. Ketersediaan kamera berubah tanpa
              pemberitahuan, dan sebagian operator dapat menghentikan atau
              memindahkan siaran publiknya kapan saja. Selain itu, terdapat{" "}
              {formatNumber(sampleCCTVData.length)} entri{" "}
              <em>contoh</em> yang diberi label jelas dan hanya dipakai untuk
              menguji pemutar video — entri tersebut tidak pernah disajikan
              sebagai CCTV Indonesia yang sebenarnya dan tidak dihitung dalam
              statistik di halaman ini.
            </p>
          </Section>

          <Section
            id="privasi"
            title="Privasi dan penggunaan yang bertanggung jawab"
          >
            <p>
              Situs ini tidak memiliki sistem akun dan tidak menyimpan data
              pribadi di server. Daftar favorit dan riwayat pencarian hanya
              tersimpan di penyimpanan lokal (localStorage) peramban kamu dan
              tidak pernah dikirim ke mana pun.
            </p>
            <p>
              Rekaman CCTV menampilkan orang di ruang publik. Gunakan katalog
              ini secara bertanggung jawab: jangan memakainya untuk mengawasi
              individu, membocorkan privasi, atau tujuan yang melanggar hukum.
              Selengkapnya pada halaman{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Ketentuan
              </Link>
              .
            </p>
          </Section>

          <Section id="kontribusi" title="Kontribusi">
            <p>
              Menambahkan kamera baru cukup dengan menambah satu entri pada
              berkas{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                src/data/cctv.ts
              </code>
              . Tidak ada perubahan lain yang diperlukan: halaman, filter,
              penanda peta, statistik, dan sitemap semuanya diturunkan dari
              berkas itu.
            </p>
            <p>
              Setiap entri divalidasi dengan skema Zod melalui{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                npm run validate:data
              </code>
              . Harap jangan mengarang URL stream: gunakan{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">
                streamType: &quot;external&quot;
              </code>{" "}
              dan arahkan ke portal resmi operator kecuali kamu benar-benar
              memverifikasi endpoint publik yang boleh disematkan.
            </p>
          </Section>

          <Section id="lisensi" title="Lisensi dan atribusi">
            <p>
              Konten kamera, nama, dan merek tetap milik operatornya
              masing-masing dan ditampilkan semata-mata untuk atribusi. Kode
              antarmuka situs ini dikembangkan secara terbuka; jika kamu
              menggunakan kembali data atau kode, sertakan atribusi yang jelas
              kepada CCTV Indonesia dan kepada operator asal.
            </p>
            <p>
              Pertanyaan mengenai penggunaan dapat disampaikan melalui halaman{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Ketentuan
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
