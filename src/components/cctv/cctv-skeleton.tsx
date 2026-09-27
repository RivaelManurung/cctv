import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Single camera card placeholder — mirrors the real card's proportions. */
export function CCTVCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
      aria-hidden="true"
    >
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2.5 p-3.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Grid of camera card placeholders. */
export function CCTVGridSkeleton({
  count = 8,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
      role="status"
      aria-label="Memuat kamera"
    >
      {Array.from({ length: count }, (_, index) => (
        <CCTVCardSkeleton key={index} />
      ))}
    </div>
  );
}

/** Rows placeholder matching `CCTVList`. */
export function CCTVListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="divide-y divide-border overflow-hidden rounded-xl border border-border"
      role="status"
      aria-label="Memuat kamera"
    >
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="flex items-center gap-4 bg-card p-3" aria-hidden="true">
          <Skeleton className="h-14 w-24 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** Stats strip placeholder. */
export function CCTVStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      role="status"
      aria-label="Memuat statistik"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="space-y-2 rounded-xl border border-border bg-card p-4"
          aria-hidden="true"
        >
          <Skeleton className="h-7 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/** City list placeholder. */
export function CityListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Memuat kota"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
          aria-hidden="true"
        >
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Full-height map placeholder. */
export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted/40",
        className,
      )}
      role="status"
      aria-label="Memuat peta"
    >
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] [background-size:40px_40px]" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground shadow-subtle">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
          Memuat peta…
        </div>
      </div>
    </div>
  );
}

/** Camera detail page placeholder. */
export function CCTVDetailSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat detail kamera">
      <div className="space-y-3" aria-hidden="true">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3 max-w-md" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="space-y-2 rounded-xl border border-border p-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
