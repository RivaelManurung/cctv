import { CameraOff, SearchX } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared empty state for every list in the app.
 *
 * `action` is usually a "Reset filter" button; `icon` defaults to a camera
 * with a slash so the visual language stays consistent.
 */
export function CCTVEmptyState({
  title = "Tidak ada CCTV ditemukan",
  description = "Coba ubah filter atau kata pencarian.",
  action,
  icon,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center",
        className,
      )}
    >
      <span className="grid h-12 w-12 place-items-center rounded-full border border-border bg-background text-muted-foreground">
        {icon ?? <CameraOff className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
      </span>
      <div className="max-w-sm">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

/** Empty state specific to a search with no matches. */
export function NoSearchResults({
  query,
  action,
}: {
  query: string;
  action?: ReactNode;
}) {
  return (
    <CCTVEmptyState
      icon={<SearchX className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />}
      title="Tidak ada CCTV ditemukan"
      description={`Tidak ada kamera yang cocok dengan “${query}”. Coba kata kunci lain atau ubah filter.`}
      action={action}
    />
  );
}
