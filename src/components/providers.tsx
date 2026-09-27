"use client";

import { ThemeProvider } from "next-themes";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "sonner";

import { TooltipProvider } from "@/components/ui/tooltip";
import { useLibraryStore } from "@/stores/use-library-store";
import { useUIStore } from "@/stores/use-ui-store";

/**
 * Client-side providers.
 *
 * The persisted stores deliberately use `skipHydration`, so we trigger
 * rehydration here — after mount — which is what keeps the server-rendered
 * markup (always empty) identical to the first client render.
 */
function StoreHydrator() {
  useEffect(() => {
    void useLibraryStore.persist.rehydrate();
    void useUIStore.persist.rehydrate();
  }, []);

  return null;
}

/**
 * Development-only data integrity check. Runs once in the browser so a bad
 * camera entry surfaces immediately instead of producing a confusing 404 or
 * a broken map marker.
 */
function DataIntegrityGuard() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    let cancelled = false;
    void (async () => {
      const [{ validateDataset }, data] = await Promise.all([
        import("@/lib/validation"),
        Promise.all([
          import("@/data/cctv"),
          import("@/data/provinces"),
          import("@/data/cities"),
          import("@/data/sources"),
          import("@/data/categories"),
        ]),
      ]);
      if (cancelled) return;

      const [cctv, provinces, cities, sources, categories] = data;
      const issues = validateDataset({
        cameras: cctv.cctvData,
        provinces: provinces.provinces,
        cities: cities.cities,
        sources: sources.sources,
        categories: categories.categories,
      });

      const errors = issues.filter((issue) => issue.level === "error");
      if (errors.length > 0) {
        console.error(
          `[cctv-data] ${errors.length} integrity error(s) found. Run \`npm run validate:data\` for the full report.`,
        );
        for (const error of errors) {
          console.error(`  [${error.code}] ${error.message}`);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {/*
        A single TooltipProvider for the whole app. Radix Tooltip throws at
        runtime without an ancestor provider, so this must wrap everything
        that can render a <Tooltip> — the player, the view-mode toggle, the
        map controls, and every card action.
      */}
      <TooltipProvider delayDuration={200} skipDelayDuration={300}>
        <StoreHydrator />
        <DataIntegrityGuard />
        {children}
        <Toaster
          position="bottom-right"
          closeButton
          richColors
          toastOptions={{
            classNames: {
              toast:
                "rounded-lg border border-border bg-popover text-popover-foreground shadow-overlay",
              description: "text-muted-foreground",
            },
          }}
        />
      </TooltipProvider>
    </ThemeProvider>
  );
}
