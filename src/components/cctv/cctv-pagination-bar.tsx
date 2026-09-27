"use client";

import { Pagination } from "@/components/shared/pagination";
import { PAGE_SIZE } from "@/lib/cctv-query";
import { cn, formatNumber } from "@/lib/utils";

/**
 * Pagination summary plus the shared {@link Pagination} control.
 *
 * Kept separate from `Pagination` so the "Menampilkan X–Y dari Z kamera" line
 * can render even on a single page, where the control itself renders nothing.
 */
export function PaginationBar({
  page,
  pageCount,
  total,
  shown,
  className,
}: {
  page: number;
  pageCount: number;
  total: number;
  shown: number;
  className?: string;
}) {
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = total === 0 ? 0 : start + Math.max(shown, 1) - 1;

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        {total === 0 ? (
          "Tidak ada kamera untuk ditampilkan"
        ) : (
          <>
            Menampilkan{" "}
            <span className="font-medium tabular-nums text-foreground">
              {formatNumber(start)}–{formatNumber(end)}
            </span>{" "}
            dari{" "}
            <span className="font-medium tabular-nums text-foreground">
              {formatNumber(total)}
            </span>{" "}
            kamera
          </>
        )}
      </p>

      <Pagination
        page={page}
        pageCount={pageCount}
        className="sm:justify-end"
      />
    </div>
  );
}
