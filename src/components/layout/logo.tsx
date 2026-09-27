import Link from "next/link";

import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/lib/site";

/**
 * Wordmark + camera glyph. Rendered as a link unless `asLink` is false.
 */
export function Logo({
  className,
  showText = true,
  asLink = true,
}: {
  className?: string;
  showText?: boolean;
  asLink?: boolean;
}) {
  const content = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="relative grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-subtle"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-[18px] w-[18px]"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 8.5 16 5v14L2 15.5z" />
          <path d="M16 10.5 22 8v8l-6-2.5" />
          <circle cx="7" cy="12" r="1.6" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {showText ? (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            {SITE_NAME}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Pantau Publik
          </span>
        </span>
      ) : null}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link
      href="/"
      className="rounded-md outline-none transition-opacity hover:opacity-80"
      aria-label={`${SITE_NAME} — beranda`}
    >
      {content}
    </Link>
  );
}
