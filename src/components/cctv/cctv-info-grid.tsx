import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Definition-list grid used by the camera detail page.
 *
 * Server-safe: no hooks, no client-only APIs. `CCTVInfoItem` accepts an
 * optional link, and external links always carry `nofollow` so we never pass
 * authority to operator sites we merely credit.
 */

export interface CCTVInfoGridProps {
  children: ReactNode;
  className?: string;
}

/** Responsive 2 / 3 / 4 column definition-list grid. */
export function CCTVInfoGrid({ children, className }: CCTVInfoGridProps) {
  return (
    <dl
      className={cn(
        "grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </dl>
  );
}

export interface CCTVInfoItemProps {
  /** Short Indonesian label, e.g. "Lokasi". */
  label: string;
  /** Already-formatted value. */
  value: ReactNode;
  /** Optional leading glyph (a rendered lucide icon). */
  icon?: ReactNode;
  /** When present the value becomes a link. */
  href?: string;
  /** External links open in a new tab and are marked `nofollow`. */
  external?: boolean;
  className?: string;
}

/** A single label/value pair inside a {@link CCTVInfoGrid}. */
export function CCTVInfoItem({
  label,
  value,
  icon,
  href,
  external = false,
  className,
}: CCTVInfoItemProps) {
  const body = (
    <span className="inline-flex items-center gap-1.5">
      {icon ? (
        <span className="shrink-0 text-muted-foreground" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span className="min-w-0">{value}</span>
    </span>
  );

  return (
    <div className={cn("min-w-0", className)}>
      <dt className="text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm font-medium text-foreground">
        {href ? (
          external ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="rounded-sm transition-colors hover:text-primary"
            >
              {body}
            </a>
          ) : (
            <Link
              href={href}
              className="rounded-sm transition-colors hover:text-primary"
            >
              {body}
            </Link>
          )
        ) : (
          body
        )}
      </dd>
    </div>
  );
}
