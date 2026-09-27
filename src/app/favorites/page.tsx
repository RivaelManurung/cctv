import type { Metadata } from "next";

import { FavoritesView } from "@/components/favorites/favorites-view";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Favorit",
  description:
    "Kamera CCTV yang kamu simpan sebagai favorit. Daftar ini tersimpan hanya di peramban kamu dan tidak pernah dikirim ke server.",
  path: "/favorites",
  // Personal, device-local content — never index it.
  robots: { index: false, follow: true },
});

export default function FavoritesPage() {
  return (
    <div className="container py-8 lg:py-12">
      <Breadcrumbs
        items={[{ label: "Beranda", href: "/" }, { label: "Favorit" }]}
      />

      <header className="mt-6 max-w-2xl">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Kamera Saya
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Kumpulan kamera yang kamu tandai sebagai favorit. Daftar ini
          tersimpan di peramban kamu sendiri, jadi hanya kamu yang bisa
          melihatnya.
        </p>
      </header>

      <div className="mt-8">
        <FavoritesView />
      </div>
    </div>
  );
}
