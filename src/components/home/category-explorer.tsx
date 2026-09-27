import Link from "next/link";

import { CategoryCard } from "@/components/shared/category-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { realCCTVData } from "@/data/cctv";
import { getCategorySummaries } from "@/lib/stats";
import { cn } from "@/lib/utils";

export interface CategoryExplorerProps {
  className?: string;
}

/** Camera-category explorer, most populated first. */
export function CategoryExplorer({ className }: CategoryExplorerProps) {
  const categories = getCategorySummaries(realCCTVData);

  return (
    <section
      className={cn("", className)}
      aria-labelledby="category-explorer-heading"
    >
      <SectionHeader
        id="category-explorer-heading"
        title="Kategori CCTV"
        description="Telusuri kamera berdasarkan jenis pemantauan"
        action={
          <Button asChild variant="ghost" size="sm">
            <Link href="/cctv">Semua kamera</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((summary) => (
          <CategoryCard key={summary.category.slug} summary={summary} />
        ))}
      </div>
    </section>
  );
}
