"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * URL-driven pagination.
 *
 * Preserves every existing query param (so filters survive paging) and only
 * rewrites `page`. Renders nothing when there is a single page.
 */
export function Pagination({
  page,
  pageCount,
  className,
}: {
  page: number;
  pageCount: number;
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const goTo = useCallback(
    (next: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next <= 1) params.delete("page");
      else params.set("page", String(next));

      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: true });
    },
    [pathname, router, searchParams],
  );

  if (pageCount <= 1) return null;

  // A sliding window of at most 5 page numbers around the current page.
  const windowSize = 5;
  let start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(pageCount, start + windowSize - 1);
  start = Math.max(1, end - windowSize + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav
      aria-label="Navigasi halaman"
      className={cn("flex items-center justify-center gap-1.5", className)}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => goTo(page - 1)}
        disabled={page <= 1}
        className="gap-1"
        aria-label="Halaman sebelumnya"
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">Sebelumnya</span>
      </Button>

      {start > 1 ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo(1)}
            className="h-8 w-8 p-0 tabular-nums"
            aria-label="Halaman 1"
          >
            1
          </Button>
          {start > 2 ? (
            <span className="px-1 text-xs text-muted-foreground" aria-hidden="true">
              …
            </span>
          ) : null}
        </>
      ) : null}

      {pages.map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? "default" : "ghost"}
          size="sm"
          onClick={() => goTo(pageNumber)}
          className="h-8 w-8 p-0 tabular-nums"
          aria-label={`Halaman ${pageNumber}`}
          aria-current={pageNumber === page ? "page" : undefined}
        >
          {pageNumber}
        </Button>
      ))}

      {end < pageCount ? (
        <>
          {end < pageCount - 1 ? (
            <span className="px-1 text-xs text-muted-foreground" aria-hidden="true">
              …
            </span>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => goTo(pageCount)}
            className="h-8 w-8 p-0 tabular-nums"
            aria-label={`Halaman ${pageCount}`}
          >
            {pageCount}
          </Button>
        </>
      ) : null}

      <Button
        variant="outline"
        size="sm"
        onClick={() => goTo(page + 1)}
        disabled={page >= pageCount}
        className="gap-1"
        aria-label="Halaman berikutnya"
      >
        <span className="hidden sm:inline">Berikutnya</span>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Button>
    </nav>
  );
}
