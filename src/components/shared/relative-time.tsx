"use client";

import { useMounted } from "@/hooks/use-mounted";
import { cn, formatDateId, formatRelativeId } from "@/lib/utils";

/**
 * Renders a timestamp as "7 hari yang lalu" — without a hydration mismatch.
 *
 * `formatRelativeId` depends on the current wall-clock time, so rendering it
 * during SSR would produce a string that can differ from the client's. Instead
 * the server (and the first client render) emit the deterministic absolute
 * date, and the relative phrasing is swapped in after mount.
 *
 * The `<time dateTime>` element is always machine-readable, so the semantic
 * value is correct even before hydration.
 */
export function RelativeTime({
  iso,
  className,
  absoluteClassName,
}: {
  iso: string | undefined;
  className?: string;
  absoluteClassName?: string;
}) {
  const mounted = useMounted();
  const absolute = formatDateId(iso);

  if (!iso) {
    return <span className={className}>—</span>;
  }

  return (
    <time dateTime={iso} title={absolute} className={cn(className)}>
      {mounted ? (
        formatRelativeId(iso)
      ) : (
        <span className={absoluteClassName}>{absolute}</span>
      )}
    </time>
  );
}
