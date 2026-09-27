"use client";

import { Link2Off, Wifi, WifiOff, type LucideIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useFilters } from "@/hooks/use-filters";
import type { FeedFilterCounts } from "@/lib/cctv-query";
import { cn, formatNumber } from "@/lib/utils";

type SegmentValue = "online" | "offline" | "unavailable";

const SEGMENTS: {
  value: SegmentValue;
  label: string;
  icon: LucideIcon;
  countKey: keyof FeedFilterCounts;
  hint?: string;
}[] = [
  {
    value: "online",
    label: "Online",
    icon: Wifi,
    countKey: "online",
    hint: "Kamera yang sumbernya melaporkan sedang aktif",
  },
  {
    value: "offline",
    label: "Offline",
    icon: WifiOff,
    countKey: "offline",
    hint: "Kamera yang sumbernya melaporkan sedang tidak aktif",
  },
  {
    value: "unavailable",
    label: "Belum tersedia",
    icon: Link2Off,
    countKey: "unavailable",
    // Worth spelling out: this is not a status, it is the absence of a feed.
    hint: "Feed tidak bisa disematkan di sini — kami hanya menautkan ke portal resmi operator",
  },
];

export interface FeedFilterProps {
  /**
   * Counts computed on the server with the availability axis cleared, so each
   * button reports what you would get by picking it under the current filters.
   */
  counts: FeedFilterCounts;
  className?: string;
}

/**
 * Prominent availability filter for the explorer.
 *
 * Online and offline are the camera's `status`; "belum tersedia" is the separate
 * feed axis (`?feed=unavailable`). The row reads as one choice, so picking a
 * segment clears the other axis rather than stacking two filters the user
 * cannot see.
 *
 * Selecting the active segment again deselects it, which clears both axes —
 * the same toggle-off behaviour as the sidebar facets.
 */
export function FeedFilter({ counts, className }: FeedFilterProps) {
  const { filters, setFilters } = useFilters();

  const current: SegmentValue | "" =
    filters.feed === "unavailable"
      ? "unavailable"
      : filters.status === "online" || filters.status === "offline"
        ? filters.status
        : "";

  const select = (next: string) => {
    if (next === "online" || next === "offline") {
      setFilters({ status: next, feed: "" });
      return;
    }
    if (next === "unavailable") {
      setFilters({ status: "", feed: "unavailable" });
      return;
    }
    // Deselected: clear both axes.
    setFilters({ status: "", feed: "" });
  };

  return (
    <ToggleGroup
      type="single"
      value={current}
      onValueChange={select}
      aria-label="Saring kamera berdasarkan ketersediaan feed"
      className={cn(
        "flex-wrap justify-start gap-0.5 rounded-lg border border-border bg-card p-0.5",
        className,
      )}
    >
      {SEGMENTS.map((segment) => {
        const Icon = segment.icon;
        return (
          <ToggleGroupItem
            key={segment.value}
            value={segment.value}
            title={segment.hint}
            className="h-8 gap-1.5 rounded-md px-2.5 text-xs font-medium data-[state=on]:bg-accent"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {segment.label}
            <span className="tabular-nums text-muted-foreground">
              {formatNumber(counts[segment.countKey])}
            </span>
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
