"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

/**
 * Route-level error boundary.
 *
 * The raw error is logged for diagnostics only — the message is never shown to
 * the visitor, since it can leak internal details. Only the (opaque) digest is
 * surfaced, and only when Next.js provides one.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] items-center justify-center py-16">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-border bg-muted/40 text-muted-foreground">
          <AlertTriangle
            className="h-6 w-6"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </span>

        <h1 className="mt-5 text-xl font-semibold tracking-tight text-foreground">
          Terjadi kesalahan
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Sesuatu tidak berjalan seperti seharusnya. Coba muat ulang halaman
          ini.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <Button onClick={() => reset()} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Coba lagi
          </Button>
          <Button asChild variant="outline" className="gap-1.5">
            <Link href="/">
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              Kembali ke beranda
            </Link>
          </Button>
        </div>

        {error.digest ? (
          <p className="mt-6 font-mono text-[11px] text-muted-foreground/70">
            Kode kesalahan: {error.digest}
          </p>
        ) : null}
      </div>
    </div>
  );
}
