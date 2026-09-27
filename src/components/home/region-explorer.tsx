import Link from "next/link";

import { RegionCard } from "@/components/shared/region-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { realCCTVData } from "@/data/cctv";
import { getRegionSummaries } from "@/lib/stats";
import { cn } from "@/lib/utils";

export interface RegionExplorerProps {
  className?: string;
}

/** Island-region explorer, ordered by camera coverage. */
export function RegionExplorer({ className }: RegionExplorerProps) {
  const regions = getRegionSummaries(realCCTVData);

  return (
    <section
      className={cn("", className)}
      aria-labelledby="region-explorer-heading"
    >
      <SectionHeader
        id="region-explorer-heading"
        title="Jelajahi Indonesia"
        description="Telusuri kamera per wilayah kepulauan"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/map">Lihat di peta</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {regions.map((summary) => (
          <RegionCard key={summary.region.slug} summary={summary} />
        ))}
      </div>
    </section>
  );
}
