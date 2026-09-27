import { CCTVGridSkeleton } from "@/components/cctv/cctv-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesLoading() {
  return (
    <div className="container py-8 lg:py-12">
      <Skeleton className="h-4 w-40" />

      <div className="mt-6 space-y-2">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <div className="mt-8">
        <CCTVGridSkeleton count={8} />
      </div>
    </div>
  );
}
