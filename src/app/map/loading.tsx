import { MapSkeleton } from "@/components/cctv/cctv-skeleton";

/** Route-level fallback for `/map` — the map itself is client-only. */
export default function MapLoading() {
  return (
    <div className="container space-y-5 py-6" role="status" aria-label="Memuat peta">
      <div className="space-y-2" aria-hidden="true">
        <div className="h-4 w-40 animate-pulse rounded-md bg-muted" />
        <div className="h-8 w-72 animate-pulse rounded-md bg-muted" />
      </div>

      <div
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        aria-hidden="true"
      >
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="h-[4.5rem] animate-pulse rounded-xl border border-border bg-card"
          />
        ))}
      </div>

      <MapSkeleton className="h-[68dvh] min-h-[440px] w-full lg:h-[calc(100dvh-17rem)]" />
    </div>
  );
}
