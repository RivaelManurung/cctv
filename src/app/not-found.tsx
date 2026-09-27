import { Compass, Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Halaman tidak ditemukan",
  robots: { index: false },
};

const SUGGESTIONS: { href: string; label: string }[] = [
  { href: "/cctv", label: "Jelajahi CCTV" },
  { href: "/map", label: "Peta" },
  { href: "/cities", label: "Kota" },
  { href: "/sources", label: "Sumber" },
];

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <p className="text-5xl font-semibold tracking-tight text-foreground">
          404
        </p>

        <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Halaman yang kamu cari mungkin telah dipindahkan, dihapus, atau tidak
          pernah ada.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button asChild className="gap-1.5">
            <Link href="/">
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              Ke beranda
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/cctv">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
              Jelajahi CCTV
            </Link>
          </Button>
        </div>

        <nav aria-label="Tautan yang disarankan" className="mt-10 w-full">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Mungkin kamu mencari
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
