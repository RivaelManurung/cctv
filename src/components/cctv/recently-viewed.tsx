"use client";

import { History } from "lucide-react";
import Link from "next/link";

import { CCTVCard } from "@/components/cctv/cctv-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { useRecentlyViewed } from "@/hooks/use-library";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";

/**
 * "Terakhir dilihat" rail, backed by localStorage.
 *
 * Renders nothing at all until the store has hydrated, which both avoids a
 * hydration mismatch and prevents an empty heading from flashing.
 */
export function RecentlyViewed({
  className,
  limit = 6,
}: {
  className?: string;
  limit?: number;
}) {
  const mounted = useMounted();
  const cameras = useRecentlyViewed();

  if (!mounted || cameras.length === 0) return null;

  const visible = cameras.slice(0, limit);

  return (
    <section className={cn("w-full", className)} aria-labelledby="recently-viewed-heading">
      <SectionHeader
        id="recently-viewed-heading"
        title="Terakhir dilihat"
        description="Kamera yang baru saja kamu buka"
        action={
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link href="/favorites">
              <History className="h-3.5 w-3.5" aria-hidden="true" />
              Favorit saya
            </Link>
          </Button>
        }
      />

      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 no-scrollbar sm:mx-0 sm:px-0">
        {visible.map((camera) => (
          <div
            key={camera.id}
            className="w-[260px] shrink-0 snap-start sm:w-[280px]"
          >
            <CCTVCard camera={camera} />
          </div>
        ))}
      </div>
    </section>
  );
}
