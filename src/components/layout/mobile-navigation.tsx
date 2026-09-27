"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFavorites } from "@/hooks/use-library";
import { useHydrated } from "@/hooks/use-mounted";
import { MOBILE_MORE_LINKS, MOBILE_TABS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Bottom tab bar for mobile, plus a "Lainnya" sheet for the secondary links.
 *
 * Hidden from `lg` up, where the header navigation takes over.
 */
export function MobileNavigation() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const hydrated = useHydrated();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav
        aria-label="Navigasi bawah"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
      >
        <ul className="grid grid-cols-5">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(pathname, tab.href);
            const showBadge = tab.href === "/favorites" && hydrated && count > 0;
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="relative">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    {showBadge ? (
                      <span className="absolute -right-1.5 -top-1 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-primary px-0.5 text-[9px] font-semibold leading-none text-primary-foreground">
                        {count > 9 ? "9+" : count}
                      </span>
                    ) : null}
                  </span>
                  <span>{tab.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              className="flex w-full flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors"
            >
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
              <span>Lainnya</span>
            </button>
          </li>
        </ul>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-8 lg:hidden">
          <SheetHeader className="text-left">
            <SheetTitle>Lainnya</SheetTitle>
            <SheetDescription>
              Jelajahi kota, sumber resmi, dan informasi platform.
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Navigasi tambahan" className="mt-2 px-4">
            {MOBILE_MORE_LINKS.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMoreOpen(false)}
                  className="flex items-start gap-3 rounded-lg px-3 py-3 transition-colors hover:bg-accent/60"
                >
                  <Icon
                    className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{link.label}</span>
                    {link.description ? (
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}
