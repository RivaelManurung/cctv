import {
  CCTVGridSkeleton,
  CCTVStatsSkeleton,
} from "@/components/cctv/cctv-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

/** Homepage-shaped skeleton shown while the route streams in. */
export default function HomeLoading() {
  return (
    <div aria-busy="true" aria-label="Memuat beranda">
      <section className="border-b border-border">
        <div className="container py-14 sm:py-20 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
            <div className="space-y-5">
              <Skeleton className="h-6 w-52 rounded-full" />
              <Skeleton className="h-12 w-3/4 max-w-md" />
              <Skeleton className="h-4 w-full max-w-lg" />
              <Skeleton className="h-14 w-full max-w-xl rounded-xl" />
              <div className="flex flex-wrap gap-3">
                <Skeleton className="h-10 w-40 rounded-md" />
                <Skeleton className="h-10 w-32 rounded-md" />
              </div>
            </div>
            <Skeleton className="hidden aspect-[2/1] w-full rounded-xl lg:block" />
          </div>
        </div>
      </section>

      <div className="container space-y-16 py-14 sm:space-y-24 sm:py-20">
        <CCTVStatsSkeleton count={4} />
        <CCTVGridSkeleton count={4} />
      </div>
    </div>
  );
}
