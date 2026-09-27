"use client";

import { Heart, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/layout/logo";
import { HeaderSearch } from "@/components/layout/header-search";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useFavorites } from "@/hooks/use-library";
import { useHydrated } from "@/hooks/use-mounted";
import { MOBILE_MORE_LINKS, NAV_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { count } = useFavorites();
  const hydrated = useHydrated();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Add a border + blur only once the page has scrolled, so the header is
  // visually weightless at the top of the page.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70"
          : "border-b border-transparent bg-background",
      )}
    >
      <div className="container flex h-16 items-center gap-3">
        <Logo className="shrink-0" />

        <nav
          aria-label="Navigasi utama"
          className="ml-4 hidden items-center gap-0.5 lg:flex"
        >
          {NAV_LINKS.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
                {active ? (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary"
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <HeaderSearch className="hidden w-56 md:block xl:w-72" />

          <Button
            asChild
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
          >
            <Link href="/favorites" aria-label="Favorit saya">
              <Heart className="h-[18px] w-[18px]" aria-hidden="true" />
              {hydrated && count > 0 ? (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                  {count > 99 ? "99+" : count}
                </span>
              ) : null}
            </Link>
          </Button>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="container pb-3 md:hidden">
        <HeaderSearch />
      </div>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="right" className="w-[300px] p-0">
          <SheetHeader className="border-b border-border px-5 py-4 text-left">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigasi utama CCTV Indonesia
            </SheetDescription>
          </SheetHeader>
          <nav aria-label="Navigasi seluler" className="p-3">
            {[...NAV_LINKS, ...MOBILE_MORE_LINKS].map((link) => {
              const Icon = link.icon;
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                    active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60",
                  )}
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
            <Link
              href="/favorites"
              className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent/60"
            >
              <Heart
                className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-sm font-medium">Favorit</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {hydrated && count > 0
                    ? `${count} kamera tersimpan`
                    : "Belum ada kamera tersimpan"}
                </span>
              </span>
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
