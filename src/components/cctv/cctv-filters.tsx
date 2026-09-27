"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

import { SidebarSection } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { getCategory } from "@/data/categories";
import { realCCTVData } from "@/data/cctv";
import { getCity } from "@/data/cities";
import { getProvince } from "@/data/provinces";
import { getRegion } from "@/data/regions";
import { getSource } from "@/data/sources";
import { useFilters } from "@/hooks/use-filters";
import { getFacets, searchCCTV, type FacetOption } from "@/lib/cctv-query";
import { cn, formatNumber } from "@/lib/utils";
import type { CCTVFilters as CCTVFiltersState } from "@/types/cctv";

/** Sentinel for the "semua" option — Radix Select forbids empty item values. */
const ALL = "__all__";
const FACET_LIMIT = 8;

const STATUS_LABELS: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  unknown: "Tidak diketahui",
};

/** Slug -> display name, so the sidebar never shows a raw slug. */
const FACET_RESOLVERS = {
  province: (slug: string) => getProvince(slug)?.name ?? slug,
  city: (slug: string) => getCity(slug)?.name ?? slug,
  source: (slug: string) => getSource(slug)?.name ?? slug,
  category: (slug: string) => getCategory(slug)?.labelId ?? slug,
};

export interface CCTVFiltersProps {
  /** Server-parsed filter state. */
  filters?: CCTVFiltersState;
  /** Merge a partial patch. Falls back to the URL-driven hook. */
  onPatch?: (patch: Partial<CCTVFiltersState>) => void;
  /** Toggle a single facet value. Falls back to the URL-driven hook. */
  onToggle?: (key: keyof CCTVFiltersState, value: string) => void;
  onReset?: () => void;
  activeCount?: number;
  className?: string;
}

/**
 * Resolves the filter props against the URL-driven {@link useFilters} hook.
 *
 * When a handler prop is supplied the component behaves as a controlled
 * component; otherwise it drives the URL itself. That is what lets the
 * Server Component page render these client components without passing
 * functions across the RSC boundary.
 */
function useFilterControls(props: CCTVFiltersProps) {
  const live = useFilters();
  const controlled =
    props.onPatch !== undefined ||
    props.onToggle !== undefined ||
    props.onReset !== undefined;

  return {
    filters: controlled ? (props.filters ?? live.filters) : live.filters,
    activeCount: controlled
      ? (props.activeCount ?? live.activeCount)
      : live.activeCount,
    patch: props.onPatch ?? live.setFilters,
    toggle: props.onToggle ?? live.toggleFilter,
    reset: props.onReset ?? live.resetFilters,
  };
}

/** Sidebar facet panel used on desktop and inside the mobile sheet. */
export function CCTVFilters(props: CCTVFiltersProps) {
  const { filters, activeCount, patch, toggle, reset } =
    useFilterControls(props);

  // Facets are derived from the search-scoped set so the panel never offers a
  // combination that yields zero cameras.
  const facetSource = useMemo(
    () => (filters.q.trim() ? searchCCTV(realCCTVData, filters.q) : realCCTVData),
    [filters.q],
  );
  const facets = useMemo(
    () => getFacets(facetSource, filters, FACET_RESOLVERS),
    [facetSource, filters],
  );

  return (
    <div className={cn("pb-2", props.className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {activeCount > 0
            ? `${formatNumber(activeCount)} filter aktif`
            : "Tanpa filter"}
        </p>
        {activeCount > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="h-7 px-2 text-xs"
          >
            Reset
          </Button>
        ) : null}
      </div>

      <SidebarSection title="Provinsi">
        <Select
          value={filters.province || ALL}
          onValueChange={(next) =>
            // Changing province invalidates any city scoped to the old one.
            patch({ province: next === ALL ? "" : next, city: "" })
          }
        >
          <SelectTrigger aria-label="Filter provinsi">
            <SelectValue placeholder="Semua provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua provinsi</SelectItem>
            {facets.provinces.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} ({formatNumber(option.count)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarSection>

      <SidebarSection title="Kota">
        <Select
          value={filters.city || ALL}
          onValueChange={(next) => patch({ city: next === ALL ? "" : next })}
        >
          <SelectTrigger aria-label="Filter kota">
            <SelectValue placeholder="Semua kota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua kota</SelectItem>
            {facets.cities.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label} ({formatNumber(option.count)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SidebarSection>

      {facets.districts.length > 0 ? (
        <SidebarSection title="Distrik">
          <FacetCheckboxList
            idPrefix="district"
            options={facets.districts}
            selected={filters.district}
            onToggle={(value) => toggle("district", value)}
          />
        </SidebarSection>
      ) : null}

      <SidebarSection title="Kategori">
        <FacetCheckboxList
          idPrefix="category"
          options={facets.categories}
          selected={filters.category}
          onToggle={(value) => toggle("category", value)}
        />
      </SidebarSection>

      <SidebarSection title="Status">
        <FacetCheckboxList
          idPrefix="status"
          options={facets.statuses}
          selected={filters.status}
          onToggle={(value) => toggle("status", value)}
        />
      </SidebarSection>

      <SidebarSection title="Sumber">
        <FacetCheckboxList
          idPrefix="source"
          options={facets.sources}
          selected={filters.source}
          onToggle={(value) => toggle("source", value)}
        />
      </SidebarSection>

      <SidebarSection title="Fitur" className="border-b-0">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="cctv-filter-featured" className="text-sm text-foreground">
            Hanya kamera unggulan
          </label>
          <Switch
            id="cctv-filter-featured"
            checked={filters.featured}
            onCheckedChange={(checked) => patch({ featured: checked })}
          />
        </div>
      </SidebarSection>
    </div>
  );
}

/**
 * Single-select facet list with counts.
 *
 * Values are mutually exclusive (the filter state is single-valued), so the
 * checkboxes behave like radios: selecting one replaces the previous value.
 */
function FacetCheckboxList({
  idPrefix,
  options,
  selected,
  onToggle,
  limit = FACET_LIMIT,
}: {
  idPrefix: string;
  options: FacetOption[];
  selected: string;
  onToggle: (value: string) => void;
  limit?: number;
}) {
  const [expanded, setExpanded] = useState(false);

  if (options.length === 0) {
    return <p className="text-xs text-muted-foreground">Tidak ada pilihan.</p>;
  }

  const visible = expanded ? options : options.slice(0, limit);
  const hiddenCount = options.length - limit;

  return (
    <div className="space-y-2">
      <ul id={`${idPrefix}-list`} className="space-y-1.5">
        {visible.map((option) => {
          const id = `${idPrefix}-${option.value}`;
          return (
            <li key={option.value} className="flex items-center gap-2.5">
              <Checkbox
                id={id}
                checked={selected === option.value}
                onCheckedChange={() => onToggle(option.value)}
              />
              <label
                htmlFor={id}
                className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 text-sm leading-none"
              >
                <span className="truncate text-foreground">{option.label}</span>
                <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                  {formatNumber(option.count)}
                </span>
              </label>
            </li>
          );
        })}
      </ul>

      {hiddenCount > 0 ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          aria-controls={`${idPrefix}-list`}
          className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-medium text-primary transition-colors hover:text-primary/80"
        >
          {expanded
            ? "Tampilkan lebih sedikit"
            : `Tampilkan semua (${formatNumber(options.length)})`}
          <ChevronDown
            className={cn("h-3 w-3 transition-transform", expanded && "rotate-180")}
            aria-hidden="true"
          />
        </button>
      ) : null}
    </div>
  );
}

interface ActiveChip {
  key: keyof CCTVFiltersState;
  label: string;
  value: string;
}

function buildChips(filters: CCTVFiltersState): ActiveChip[] {
  const chips: ActiveChip[] = [];
  const query = filters.q.trim();

  if (query) chips.push({ key: "q", label: "Kata kunci", value: `“${query}”` });
  if (filters.province) {
    chips.push({
      key: "province",
      label: "Provinsi",
      value: getProvince(filters.province)?.name ?? filters.province,
    });
  }
  if (filters.city) {
    chips.push({
      key: "city",
      label: "Kota",
      value: getCity(filters.city)?.name ?? filters.city,
    });
  }
  if (filters.district) {
    chips.push({ key: "district", label: "Distrik", value: filters.district });
  }
  if (filters.category) {
    chips.push({
      key: "category",
      label: "Kategori",
      value: getCategory(filters.category)?.labelId ?? filters.category,
    });
  }
  if (filters.status) {
    chips.push({
      key: "status",
      label: "Status",
      value: STATUS_LABELS[filters.status] ?? filters.status,
    });
  }
  if (filters.feed === "unavailable") {
    chips.push({ key: "feed", label: "Feed", value: "Belum tersedia" });
  }
  if (filters.source) {
    chips.push({
      key: "source",
      label: "Sumber",
      value: getSource(filters.source)?.name ?? filters.source,
    });
  }
  if (filters.region) {
    chips.push({
      key: "region",
      label: "Wilayah",
      value: getRegion(filters.region)?.name ?? filters.region,
    });
  }
  if (filters.featured) {
    chips.push({ key: "featured", label: "Fitur", value: "Unggulan" });
  }

  return chips;
}

/** Removable chips for every active filter, plus a "reset all" action. */
export function ActiveFilterChips({
  filters: filtersProp,
  onClear,
  onReset,
  className,
}: {
  filters?: CCTVFiltersState;
  onClear?: (key: keyof CCTVFiltersState) => void;
  onReset?: () => void;
  className?: string;
}) {
  const live = useFilters();
  const controlled = onClear !== undefined || onReset !== undefined;
  const filters = controlled ? (filtersProp ?? live.filters) : live.filters;
  const clear = onClear ?? live.clearFilter;
  const reset = onReset ?? live.resetFilters;

  const chips = useMemo(() => buildChips(filters), [filters]);

  if (chips.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 py-1 pl-2.5 pr-1 text-xs"
        >
          <span className="text-muted-foreground">{chip.label}</span>
          <span className="max-w-[10rem] truncate font-medium text-foreground">
            {chip.value}
          </span>
          <button
            type="button"
            onClick={() => clear(chip.key)}
            aria-label={`Hapus filter ${chip.label}`}
            className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-3 w-3" aria-hidden="true" />
          </button>
        </span>
      ))}

      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={reset}
        className="h-7 px-2 text-xs"
      >
        Reset semua
      </Button>
    </div>
  );
}

export interface FilterSheetProps extends CCTVFiltersProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Mobile filter drawer.
 *
 * `modal={false}` is deliberate: Radix Select portals its listbox to
 * `document.body`, and a modal Dialog sets `pointer-events: none` on the body,
 * which would make the province/city dropdowns unclickable.
 */
export function FilterSheet({
  open,
  onOpenChange,
  className,
  ...filterProps
}: FilterSheetProps) {
  const { activeCount, reset } = useFilterControls(filterProps);
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = open !== undefined;
  const sheetOpen = isControlled ? open : internalOpen;
  const setOpen = (next: boolean) => {
    if (isControlled) onOpenChange?.(next);
    else setInternalOpen(next);
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setOpen} modal={false}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn("gap-2 lg:hidden", className)}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filter
          {activeCount > 0 ? (
            <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-[10px] font-semibold tabular-nums text-secondary-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="flex max-h-[85vh] flex-col gap-0 rounded-t-xl p-0"
      >
        <SheetHeader className="border-b border-border px-5 py-4 pr-12 text-left">
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>
            Persempit hasil berdasarkan lokasi, kategori, status, dan sumber.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <CCTVFilters {...filterProps} />
        </div>

        <SheetFooter className="flex-row items-center justify-between gap-3 border-t border-border px-5 py-4 sm:justify-between sm:space-x-0">
          <span className="text-xs text-muted-foreground">
            {activeCount > 0
              ? `${formatNumber(activeCount)} filter aktif`
              : "Belum ada filter"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
              disabled={activeCount === 0}
            >
              Reset
            </Button>
            <Button type="button" size="sm" onClick={() => setOpen(false)}>
              Terapkan
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
