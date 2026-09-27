import {
  CCTVGridSkeleton,
  CCTVStatsSkeleton,
} from "@/components/cctv/cctv-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors `/provinces/[provinceSlug]`: breadcrumb, header, 3 stats, grid. */
export default function ProvinceDetailLoading() {
  return (
    <div className="container space-y-10 py-8 sm:py-12">
      <div className="space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-10 w-72 max-w-full" />
          <Skeleton className="h-4 w-52" />
        </div>
        <CCTVStatsSkeleton count={3} />
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-9 w-32 rounded-md" />
          <Skeleton className="h-9 w-44 rounded-md" />
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-6 w-52" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </div>

      <div className="space-y-6">
        <Skeleton className="h-6 w-48" />
        <CCTVGridSkeleton count={8} />
      </div>
    </div>
  );
}
