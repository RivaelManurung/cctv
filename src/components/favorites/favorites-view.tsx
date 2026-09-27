"use client";

import { Compass, Map as MapIcon, Trash2 } from "lucide-react";
import Link from "next/link";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import { CCTVResults, ViewModeToggle } from "@/components/cctv/cctv-results";
import { CCTVGridSkeleton } from "@/components/cctv/cctv-skeleton";
import { RecentlyViewed } from "@/components/cctv/recently-viewed";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useFavoriteCameras, useFavorites } from "@/hooks/use-library";
import { useMounted } from "@/hooks/use-mounted";
import { formatNumber } from "@/lib/utils";

/**
 * Client-side favourites list.
 *
 * Favourites live in `localStorage`, which does not exist during SSR. We gate
 * the whole view behind `useMounted()` so the server markup and the first
 * client render are byte-for-byte identical (both show the skeleton) and only
 * swap to the real list after rehydration — never a hydration mismatch.
 */
export function FavoritesView() {
  const mounted = useMounted();
  const favorites = useFavoriteCameras();
  const { count, clearFavorites } = useFavorites();

  if (!mounted) {
    return <CCTVGridSkeleton count={8} />;
  }

  // Indonesian does not inflect for number, so 1 and n share the same noun.
  const summary =
    count === 0
      ? "Belum ada kamera yang kamu simpan"
      : `${formatNumber(count)} kamera tersimpan`;

  const emptyState = (
    <CCTVEmptyState
      title="Belum ada CCTV favorit"
      description="Tambahkan kamera ke favorit untuk mengaksesnya dengan cepat."
      action={
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Button asChild size="sm">
            <Link href="/cctv">
              <Compass aria-hidden="true" />
              Jelajahi CCTV
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/map">
              <MapIcon aria-hidden="true" />
              Lihat Peta
            </Link>
          </Button>
        </div>
      }
    />
  );

  return (
    <div className="space-y-10">
      <section aria-label="Kamera Saya" className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {summary}
          </p>

          {count > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <ViewModeToggle />
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Hapus semua
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Hapus semua favorit?</DialogTitle>
                    <DialogDescription>
                      {formatNumber(count)} kamera akan dihapus dari daftar
                      favorit di peramban ini. Tindakan ini tidak dapat
                      dibatalkan.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <Button
                      variant="destructive"
                      onClick={() => clearFavorites()}
                    >
                      Hapus semua
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ) : null}
        </div>

        <CCTVResults cameras={favorites} emptyState={emptyState} />
      </section>

      {/* Self-hides until the store has hydrated, so no orphan heading. */}
      <RecentlyViewed />
    </div>
  );
}
