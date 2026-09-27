import {
  CCTVStatsSkeleton,
  CityListSkeleton,
} from "@/components/cctv/cctv-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors `/cities` so the header, stats and list keep their final size. */
export default function CitiesLoading() {
  return (
    <div className="container space-y-8 py-8 sm:py-12">
      <div className="space-y-6">
        <Skeleton className="h-4 w-40" />
        <div className="max-w-2xl space-y-3">
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      <CCTVStatsSkeleton count={4} />

      <CityListSkeleton count={9} />
    </div>
  );
}
