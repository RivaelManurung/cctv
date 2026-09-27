import { Info } from "lucide-react";
import Link from "next/link";

import { SectionHeader } from "@/components/shared/section-header";
import { SourceCard } from "@/components/shared/source-card";
import { Button } from "@/components/ui/button";
import { realCCTVData } from "@/data/cctv";
import { getSourceSummaries } from "@/lib/stats";
import { cn } from "@/lib/utils";

export interface SourcesStripProps {
  className?: string;
  /** How many operators to show. */
  limit?: number;
}

/** The operators contributing the most cameras, with an attribution note. */
export function SourcesStrip({ className, limit = 6 }: SourcesStripProps) {
  const sources = getSourceSummaries(realCCTVData).slice(0, limit);

  if (sources.length === 0) return null;

  return (
    <section className={cn("", className)} aria-labelledby="sources-strip-heading">
      <SectionHeader
        id="sources-strip-heading"
        title="Sumber resmi"
        description="Kamera dipublikasikan oleh instansi dan operator resmi"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/sources">Lihat semua sumber</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sources.map((summary) => (
          <SourceCard key={summary.source.slug} summary={summary} />
        ))}
      </div>

      <p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>
          Seluruh rekaman CCTV merupakan milik operator masing-masing. Platform
          ini hanya menautkan ke portal resmi dan tidak menyimpan rekaman.
        </span>
      </p>
    </section>
  );
}
