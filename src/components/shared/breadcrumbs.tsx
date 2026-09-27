import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Accessible breadcrumb trail.
 *
 * Pass the FULL trail including the root, e.g.
 * `[{ label: "Beranda", href: "/" }, { label: "Kota", href: "/cities" }, { label: "Bekasi" }]`.
 * The final item is rendered as the current page and is not a link.
 */
export function Breadcrumbs({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? (
                <ChevronRight
                  className="h-3 w-3 shrink-0 text-border"
                  aria-hidden="true"
                />
              ) : null}

              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className="max-w-[16rem] truncate font-medium text-foreground"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="max-w-[16rem] truncate rounded-sm transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
