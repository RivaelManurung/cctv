import Link from "next/link";

import { Logo } from "@/components/layout/logo";
import { realCCTVData } from "@/data/cctv";
import { FOOTER_EXPLORE, FOOTER_INFORMATION } from "@/lib/navigation";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import { getStats } from "@/lib/stats";
import { formatNumber } from "@/lib/utils";

export function Footer() {
  const stats = getStats(realCCTVData);
  const year = 2026;

  return (
    <footer className="mt-16 border-t border-border bg-muted/30 pb-24 lg:pb-0">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE_DESCRIPTION}
            </p>
            <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Kamera
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                  {formatNumber(stats.cameras)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Kota
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                  {formatNumber(stats.cities)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Provinsi
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                  {formatNumber(stats.provinces)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                  Sumber
                </dt>
                <dd className="mt-0.5 text-lg font-semibold tabular-nums text-foreground">
                  {formatNumber(stats.sources)}
                </dd>
              </div>
            </dl>
          </div>

          <nav aria-label="Tautan jelajahi">
            <h2 className="text-sm font-semibold text-foreground">Jelajahi</h2>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Tautan informasi">
            <h2 className="text-sm font-semibold text-foreground">Informasi</h2>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_INFORMATION.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE_NAME}. Seluruh rekaman CCTV merupakan milik operator
            masing-masing.
          </p>
          <p>
            Data dari{" "}
            <Link
              href="/sources"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {formatNumber(stats.sources)} sumber publik resmi
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
