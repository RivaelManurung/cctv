import { BadgeCheck, Globe, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AboutTeaserProps {
  className?: string;
}

const POINTS: { icon: typeof Globe; title: string; description: string }[] = [
  {
    icon: Globe,
    title: "Semua data dari sumber publik",
    description: "Katalog disusun dari portal resmi instansi dan operator.",
  },
  {
    icon: ShieldCheck,
    title: "Tanpa penyimpanan rekaman",
    description: "Kami tidak memiliki, merekam, atau menyimpan video apa pun.",
  },
  {
    icon: BadgeCheck,
    title: "Atribusi ke operator",
    description: "Setiap kamera mencantumkan sumber dan tautan resminya.",
  },
  {
    icon: RefreshCw,
    title: "Status dapat berubah",
    description: "Ketersediaan kamera bergantung pada kebijakan operator.",
  },
];

/** Two-column band explaining what the platform is — and is not. */
export function AboutTeaser({ className }: AboutTeaserProps) {
  return (
    <section
      className={cn("", className)}
      aria-labelledby="about-teaser-heading"
    >
      <div className="grid gap-8 rounded-xl border border-border bg-card p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Tentang platform
          </span>
          <h2
            id="about-teaser-heading"
            className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Agregator kamera publik Indonesia
          </h2>

          <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
            CCTV Indonesia merangkum kamera publik dan pemantau lalu lintas dari
            instansi serta operator resmi di berbagai wilayah. Setiap entri
            mengarah ke portal resmi penyedianya.
          </p>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Kami tidak memiliki, merekam, atau menyimpan rekaman apa pun.
            Ketersediaan dan status kamera dapat berubah sewaktu-waktu sesuai
            kebijakan operator.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/about">Tentang platform</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/terms">Ketentuan penggunaan</Link>
            </Button>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:content-center">
          {POINTS.map((point) => {
            const Icon = point.icon;
            return (
              <li key={point.title} className="flex gap-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground">
                    {point.title}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                    {point.description}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
