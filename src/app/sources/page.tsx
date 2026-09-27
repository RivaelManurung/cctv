import { Camera, Globe, Info, MapPin, Wifi } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { StatStrip } from "@/components/cctv/cctv-stats";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SourceDirectory } from "@/components/sources/source-directory";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { realCCTVData } from "@/data/cctv";
import { buildMetadata } from "@/lib/metadata";
import { getSourceSummaries, getStats } from "@/lib/stats";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Sumber CCTV",
  description:
    "Direktori resmi operator kamera CCTV publik di Indonesia. Setiap kamera diatribusikan kepada operatornya; situs ini tidak memiliki maupun menyimpan rekaman apa pun.",
  path: "/sources",
  keywords: [
    "sumber cctv indonesia",
    "operator cctv",
    "atcs",
    "dishub",
    "kamera lalu lintas publik",
  ],
});

export default function SourcesPage() {
  const summaries = getSourceSummaries(realCCTVData);
  const stats = getStats(realCCTVData);

  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Sumber" }]}
      />

      <header className="mt-6 max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Sumber CCTV
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Setiap kamera dalam katalog ini diatribusikan kepada operator yang
          mempublikasikannya — dinas perhubungan, pemerintah daerah, maupun
          instansi lain. CCTV Indonesia hanya menghimpun tautan ke halaman
          resmi mereka: kami tidak memiliki, menyimpan, merekam, atau
          mendistribusikan ulang rekaman apa pun.
        </p>
      </header>

      <StatStrip
        className="mt-8"
        items={[
          {
            label: "Sumber resmi",
            value: summaries.length,
            icon: Globe,
            accent: "bg-primary/10 text-primary",
          },
          {
            label: "Kamera",
            value: stats.cameras,
            icon: Camera,
            accent: "bg-muted text-muted-foreground",
            hint: "teratribusi",
          },
          {
            label: "Provinsi",
            value: stats.provinces,
            icon: MapPin,
            accent: "bg-muted text-muted-foreground",
          },
          {
            label: "Online",
            value: stats.online,
            icon: Wifi,
            accent: "bg-success/10 text-success",
            hint: `${formatNumber(stats.offline)} offline`,
          },
        ]}
      />

      <div className="mt-10">
        <SourceDirectory summaries={summaries} />
      </div>

      <Alert className="mt-10">
        <Info aria-hidden="true" />
        <AlertTitle>Catatan atribusi</AlertTitle>
        <AlertDescription>
          Seluruh rekaman CCTV merupakan milik operator masing-masing. Situs ini
          tidak memiliki maupun menyimpan video, dan hanya menautkan ke portal
          resmi. Status kamera adalah atribut statis, bukan pemeriksaan
          langsung. Selengkapnya di{" "}
          <Link
            href="/about"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Tentang
          </Link>{" "}
          dan{" "}
          <Link
            href="/terms"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Ketentuan
          </Link>
          .
        </AlertDescription>
      </Alert>
    </div>
  );
}
