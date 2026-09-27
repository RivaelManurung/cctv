"use client";

import { ArrowUpDown } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import { SORT_OPTIONS, type SortOption } from "@/types/cctv";

const SORT_LABELS: Record<SortOption, string> = {
  recommended: "Direkomendasikan",
  "name-asc": "Nama A–Z",
  "name-desc": "Nama Z–A",
  recent: "Terbaru",
  "status-online": "Online lebih dulu",
};

/** Sort control. Falls back to writing `?sort=` to the URL when uncontrolled. */
export function SortSelect({
  value,
  onChange,
  className,
}: {
  value?: SortOption;
  onChange?: (value: SortOption) => void;
  className?: string;
}) {
  const live = useFilters();
  const controlled = onChange !== undefined;
  const current = controlled ? (value ?? live.filters.sort) : live.filters.sort;
  const setSort =
    onChange ?? ((next: SortOption) => live.setFilters({ sort: next }));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ArrowUpDown
        className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block"
        aria-hidden="true"
      />
      <Select
        value={current}
        onValueChange={(next) => setSort(next as SortOption)}
      >
        <SelectTrigger
          aria-label="Urutkan hasil"
          className="h-9 w-full min-w-[10.5rem]"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option} value={option}>
              {SORT_LABELS[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
