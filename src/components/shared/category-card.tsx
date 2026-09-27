import Link from "next/link";

import { getIcon } from "@/lib/icons";
import { cn, formatNumber } from "@/lib/utils";
import type { CategorySummary } from "@/types/cctv";

/** Camera-category tile linking into a filtered explorer view. */
export function CategoryCard({
  summary,
  className,
}: {
  summary: CategorySummary;
  className?: string;
}) {
  const { category, cameras } = summary;
  const Icon = getIcon(category.icon);

  return (
    <Link
      href={`/cctv?category=${category.slug}`}
      className={cn(
        "group/category flex flex-col rounded-xl border border-border bg-card p-5",
        "transition-[border-color,box-shadow] duration-200",
        "hover:border-primary/30 hover:shadow-elevated focus-visible:shadow-elevated",
        className,
      )}
    >
      <span
        className={cn(
          "grid h-10 w-10 place-items-center rounded-lg",
          category.accent,
        )}
        aria-hidden="true"
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} />
      </span>

      <h3 className="mt-4 text-sm font-semibold tracking-tight text-foreground">
        {category.labelId}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-xs leading-relaxed text-muted-foreground">
        {category.description}
      </p>

      <p className="mt-4 border-t border-border pt-3 text-xs font-medium tabular-nums text-muted-foreground">
        {formatNumber(cameras)} kamera
      </p>
    </Link>
  );
}
