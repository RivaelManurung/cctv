import { Skeleton } from "@/components/ui/skeleton";

export default function SourcesLoading() {
  return (
    <div className="container py-8 lg:py-12">
      <Skeleton className="h-4 w-40" />

      <div className="mt-6 space-y-3">
        <Skeleton className="h-8 w-56 max-w-full" />
        <Skeleton className="h-4 w-full max-w-2xl" />
        <Skeleton className="h-4 w-3/4 max-w-xl" />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="space-y-2 rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }, (_, index) => (
          <div
            key={index}
            className="space-y-3 rounded-xl border border-border bg-card p-5"
          >
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
