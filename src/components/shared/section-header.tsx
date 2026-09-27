import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Consistent section heading used across every page: an optional eyebrow-free
 * title, a supporting line, and a right-aligned action (usually a link).
 */
export function SectionHeader({
  title,
  description,
  action,
  className,
  id,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h2
          id={id}
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
