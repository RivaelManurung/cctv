import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Ketentuan",
  description:
    "Ketentuan penggunaan dan panduan penggunaan yang bertanggung jawab untuk CCTV Indonesia, termasuk kepemilikan konten, privasi, dan batasan tanggung jawab.",
  path: "/terms",
  keywords: [
    "ketentuan penggunaan cctv indonesia",
    "kebijakan privasi",
    "penggunaan bertanggung jawab",
  ],
});

/** Hardcoded effective date — never computed at render time. */
const EFFECTIVE_DATE = "1 Januari 2026";

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

export default function TermsPage() {
  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Ketentuan" }]}
      />

      <div className="mx-auto max-w-3xl">
        <header className="mt-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Ketentuan Penggunaan
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Dengan mengakses CCTV Indonesia, kamu menyetujui ketentuan di bawah
            ini. Bacalah dengan saksama sebelum menggunakan situs.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Berlaku efektif: {EFFECTIVE_DATE}
          </p>
        </header>

        <Alert className="mt-8" variant="default">
          <ShieldCheck aria-hidden="true" />
          <AlertTitle>Ringkasan singkat</AlertTitle>
          <AlertDescription>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                Semua rekaman CCTV milik operatornya masing-masing; situs ini
                tidak memiliki maupun menyimpan video.
              </li>
              <li>
                Tidak ada akun dan tidak ada data pribadi di server — favorit
                dan riwayat hanya tersimpan di peramban kamu.
              </li>
              <li>
                Ketersediaan kamera tidak dijamin dan dapat berubah kapan saja
                tanpa pemberitahuan.
              </li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="mt-10 space-y-5">
          <Section id="ketentuan-penggunaan" title="Ketentuan Penggunaan">
            <p>
              CCTV Indonesia menyediakan katalog informasi mengenai kamera
              pemantau publik di Indonesia beserta tautan ke portal resmi
              operatornya. Layanan ini disediakan untuk keperluan informasi
              umum.
            </p>
            <p>
              Kamu setuju untuk menggunakan situs ini sesuai dengan hukum yang
              berlaku di Indonesia dan tidak menyalahgunakannya untuk tujuan
              yang melanggar peraturan perundang-undangan.
            </p>
          </Section>

          <Section
            id="kepemilikan-konten"
            title="Sumber dan kepemilikan konten"
          >
            <p>
              Seluruh rekaman video, nama instansi, logo, dan merek adalah milik
              operator masing-masing. Situs ini hanya menghimpun tautan dan
              menyajikan informasi atribusi; kami tidak mengklaim hak apa pun
              atas konten pihak ketiga.
            </p>
            <p>
              Kamu tidak boleh menggandakan, menyiarkan ulang, atau
              mendistribusikan konten operator tanpa izin dari operator yang
              bersangkutan. Tautan ke portal resmi disediakan agar kamu dapat
              mengakses sumber aslinya secara langsung.
            </p>
          </Section>

          <Section
            id="ketersediaan"
            title="Tidak ada jaminan ketersediaan"
          >
            <p>
              Katalog ini bersifat statis dan disusun secara manual. Kami tidak
              menjamin bahwa kamera yang tercantum masih aktif, dapat diakses,
              atau bebas dari kesalahan. Status yang ditampilkan bukan hasil
              pemeriksaan langsung.
            </p>
            <p>
              Kami dapat menambah, mengubah, atau menghapus entri kapan saja
              tanpa pemberitahuan sebelumnya, dan dapat menghentikan sebagian
              atau seluruh layanan tanpa kewajiban apa pun.
            </p>
          </Section>

          <Section id="dilarang" title="Penggunaan yang dilarang">
            <p>Kamu dilarang menggunakan situs ini untuk:</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>
                memantau, menguntit, atau mengawasi individu secara melanggar
                privasi atau hukum;
              </li>
              <li>
                melakukan tindakan yang melanggar privasi, pelecehan, atau
                diskriminasi terhadap siapa pun;
              </li>
              <li>
                mengumpulkan data secara otomatis (scraping) yang membebani
                layanan atau melanggar ketentuan operator;
              </li>
              <li>
                menyalahgunakan tautan untuk mengakses sistem operator tanpa
                izin, termasuk upaya menerobos pembatasan akses;
              </li>
              <li>kegiatan lain yang melanggar hukum yang berlaku.</li>
            </ul>
          </Section>

          <Section
            id="privasi"
            title="Privasi dan perlindungan data"
          >
            <p>
              Situs ini tidak memiliki sistem akun dan tidak menyimpan data
              pribadi apa pun di server. Tidak ada nama, email, atau identitas
              pengguna yang kami kumpulkan.
            </p>
            <p>
              Daftar favorit dan riwayat pencarian kamu disimpan{" "}
              <strong className="font-medium text-foreground">
                hanya di localStorage peramban kamu sendiri
              </strong>{" "}
              dan tidak pernah meninggalkan perangkat. Menghapus data peramban
              akan menghapus preferensi tersebut secara permanen.
            </p>
          </Section>

          <Section id="tanggung-jawab" title="Batasan tanggung jawab">
            <p>
              Situs ini disediakan &quot;sebagaimana adanya&quot;. Sejauh
              diizinkan hukum, kami tidak bertanggung jawab atas kerugian
              langsung maupun tidak langsung yang timbul dari penggunaan situs,
              termasuk ketidakakuratan informasi, ketidaktersediaan kamera, atau
              tindakan pihak ketiga.
            </p>
            <p>
              Segala keputusan yang kamu ambil berdasarkan informasi di situs
              ini sepenuhnya menjadi tanggung jawabmu sendiri.
            </p>
          </Section>

          <Section id="perubahan" title="Perubahan ketentuan">
            <p>
              Kami dapat memperbarui ketentuan ini dari waktu ke waktu. Versi
              terbaru akan selalu dipublikasikan di halaman ini beserta tanggal
              berlaku yang diperbarui. Penggunaan situs setelah perubahan
              berarti kamu menyetujui ketentuan yang telah diperbarui.
            </p>
          </Section>

          <Section id="kontak" title="Kontak">
            <p>
              Untuk pertanyaan mengenai ketentuan ini, atribusi, atau permintaan
              penghapusan tautan, hubungi operator melalui portal resminya.
              Untuk konteks lebih lanjut mengenai cara kami mengumpulkan data,
              lihat halaman{" "}
              <Link
                href="/about"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Tentang
              </Link>{" "}
              dan{" "}
              <Link
                href="/sources"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sumber
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
