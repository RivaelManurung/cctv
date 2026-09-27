"use client";

import { Grid3x3, List } from "lucide-react";
import type { ReactNode } from "react";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import { CCTVGrid } from "@/components/cctv/cctv-grid";
import { CCTVList } from "@/components/cctv/cctv-list";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { selectViewMode, useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

/**
 * Grid / list switcher bound to the persisted UI store.
 *
 * The store skips hydration, so the first client render matches the server
 * ("grid") and only switches to the saved preference after rehydration —
 * which is a normal post-mount update, not a hydration mismatch.
 */
export function ViewModeToggle({ className }: { className?: string }) {
  const viewMode = useUIStore(selectViewMode);
  const setViewMode = useUIStore((state) => state.setViewMode);

  // "map" is a route, not a layout, so the toggle only offers grid and list.
  const value = viewMode === "list" ? "list" : "grid";

  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(next) => {
        if (next === "grid" || next === "list") setViewMode(next);
      }}
      className={cn("rounded-lg border border-border p-0.5", className)}
      aria-label="Ubah tata letak"
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="grid"
            aria-label="Tampilan kisi"
            className="h-8 w-8 rounded-md data-[state=on]:bg-accent"
          >
            <Grid3x3 className="h-4 w-4" aria-hidden="true" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Kisi</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <ToggleGroupItem
            value="list"
            aria-label="Tampilan daftar"
            className="h-8 w-8 rounded-md data-[state=on]:bg-accent"
          >
            <List className="h-4 w-4" aria-hidden="true" />
          </ToggleGroupItem>
        </TooltipTrigger>
        <TooltipContent>Daftar</TooltipContent>
      </Tooltip>
    </ToggleGroup>
  );
}

/**
 * Renders a camera collection using the user's preferred layout, or the
 * supplied empty state when there is nothing to show.
 *
 * Every list in the app goes through this, so grid/list behaviour can never
 * diverge between the explorer, city pages and favourites.
 */
export function CCTVResults({
  cameras,
  className,
  priorityCount = 0,
  emptyState,
}: {
  cameras: CCTV[];
  className?: string;
  priorityCount?: number;
  emptyState?: ReactNode;
}) {
  const viewMode = useUIStore(selectViewMode);

  if (cameras.length === 0) {
    return <>{emptyState ?? <CCTVEmptyState />}</>;
  }

  if (viewMode === "list") {
    return <CCTVList cameras={cameras} className={className} />;
  }

  return (
    <CCTVGrid
      cameras={cameras}
      className={className}
      priorityCount={priorityCount}
    />
  );
}
