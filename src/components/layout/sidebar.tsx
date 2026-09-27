import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Sticky secondary column used by the browse routes (`/cctv`, `/cities`,
 * `/provinces`) to give desktop the "sidebar + content" layout.
 *
 * Hidden below `lg`, where the same controls move into a bottom sheet.
 */
export function Sidebar({
  children,
  className,
  sticky = true,
}: {
  children: ReactNode;
  className?: string;
  sticky?: boolean;
}) {
  return (
    <aside
      aria-label="Panel samping"
      className={cn(
        "hidden w-64 shrink-0 lg:block xl:w-72",
        sticky && "sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1",
        className,
      )}
    >
      {children}
    </aside>
  );
}

/** A titled group of controls inside a `Sidebar`. */
export function SidebarSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("border-b border-border py-5 first:pt-0", className)}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}
