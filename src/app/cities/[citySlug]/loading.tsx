import {
  CCTVGridSkeleton,
  CCTVStatsSkeleton,
} from "@/components/cctv/cctv-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors `/cities/[citySlug]`: breadcrumb, header, 2 stats, camera grid. */
export default function CityDetailLoading() {
  return (
    <div className="container space-y-10 py-8 sm:py-12">
      <div className="space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-10 w-64 max-w-full" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-56" />
        </div>
        <CCTVStatsSkeleton count={2} />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-6 w-40" />
        <CCTVGridSkeleton count={8} />
      </div>
    </div>
  );
}
