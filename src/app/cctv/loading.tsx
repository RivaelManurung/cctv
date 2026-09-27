import { CCTVGridSkeleton, CCTVStatsSkeleton } from "@/components/cctv/cctv-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Route-level skeleton for `/cctv` — mirrors the explorer's two-column layout. */
export default function Loading() {
  return (
    <div className="container py-8 lg:py-10">
      <Skeleton className="mb-4 h-4 w-40" />

      <div className="mb-6 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="mb-8">
        <CCTVStatsSkeleton />
      </div>

      <div className="flex items-start gap-8">
        <div className="hidden w-64 shrink-0 space-y-4 lg:block xl:w-72">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-xl" />
          ))}
        </div>

        <div className="min-w-0 flex-1 space-y-5">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-9 w-40 rounded-md" />
          <CCTVGridSkeleton count={8} />
        </div>
      </div>
    </div>
  );
}
