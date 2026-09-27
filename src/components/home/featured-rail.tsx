"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { CCTVCard } from "@/components/cctv/cctv-card";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

export interface FeaturedRailProps {
  /** Featured cameras, resolved on the server and passed down. */
  cameras: CCTV[];
  className?: string;
}

/**
 * Horizontally scrollable rail of featured cameras.
 *
 * The camera list arrives as a prop (rather than being imported here) so the
 * full dataset never enters the client bundle — only the featured entries are
 * serialised across the boundary. No stream is ever autoplayed; `CCTVCard`
 * handles activation on demand.
 */
export function FeaturedRail({ cameras, className }: FeaturedRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 4);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByPage = useCallback((direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * Math.max(el.clientWidth * 0.8, 240),
      behavior: "smooth",
    });
  }, []);

  if (cameras.length === 0) return null;

  return (
    <section className={cn("", className)} aria-labelledby="live-cctv-heading">
      <SectionHeader
        id="live-cctv-heading"
        title="Live CCTV"
        description="Pantau lokasi populer"
        action={
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 md:flex">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => scrollByPage(-1)}
                disabled={!canScrollPrev}
                aria-label="Geser kamera ke kiri"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => scrollByPage(1)}
                disabled={!canScrollNext}
                aria-label="Geser kamera ke kanan"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/cctv?featured=true">Lihat semua</Link>
            </Button>
          </div>
        }
      />

      <div
        ref={scrollerRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 no-scrollbar sm:mx-0 sm:px-0"
      >
        {cameras.map((camera, index) => (
          <div
            key={camera.id}
            className="w-[80%] shrink-0 snap-start sm:w-[46%] lg:w-[calc(25%-12px)]"
          >
            <CCTVCard camera={camera} priority={index < 2} />
          </div>
        ))}
      </div>
    </section>
  );
}
