import { CCTVDetailSkeleton } from "@/components/cctv/cctv-skeleton";

/** Route-level loading state for `/cctv/[slug]`. */
export default function Loading() {
  return (
    <div className="container py-6 md:py-8">
      <CCTVDetailSkeleton />
    </div>
  );
}
