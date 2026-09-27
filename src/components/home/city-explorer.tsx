import Link from "next/link";

import { CityCard } from "@/components/shared/city-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { realCCTVData } from "@/data/cctv";
import { getPopularCities } from "@/lib/stats";
import { cn } from "@/lib/utils";

export interface CityExplorerProps {
  className?: string;
}

/** Cities with the most cameras, ordered by derived coverage. */
export function CityExplorer({ className }: CityExplorerProps) {
  const cities = getPopularCities(realCCTVData, 12);

  return (
    <section className={cn("", className)} aria-labelledby="city-explorer-heading">
      <SectionHeader
        id="city-explorer-heading"
        title="CCTV berdasarkan kota"
        description="Kota dengan kamera terbanyak"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/cities">Lihat semua kota</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cities.map((summary) => (
          <CityCard key={summary.city.slug} summary={summary} />
        ))}
      </div>
    </section>
  );
}
