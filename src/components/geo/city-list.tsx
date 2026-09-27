"use client";

import { Building2, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import { CityCard } from "@/components/shared/city-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn, formatNumber, normalizeForSearch } from "@/lib/utils";
import type { CitySummary } from "@/types/cctv";

type CitySort = "cameras" | "name" | "online";

const SORT_LABELS: Record<CitySort, string> = {
  cameras: "Kamera terbanyak",
  name: "Nama A–Z",
  online: "Online terbanyak",
};

const SORT_ORDER: CitySort[] = ["cameras", "name", "online"];

const ALL_PROVINCES = "all";

export interface CityListProps {
  /** Every city that has at least one real camera, pre-computed on the server. */
  cities: CitySummary[];
  className?: string;
}

/**
 * Searchable, sortable directory of Indonesian cities with public cameras.
 *
 * Fully client-side: the server renders the complete list and filtering only
 * kicks in after interaction, so the first paint is identical on both sides
 * (no hydration mismatch) and the content stays crawlable.
 */
export function CityList({ cities, className }: CityListProps) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState<string>(ALL_PROVINCES);
  const [sort, setSort] = useState<CitySort>("cameras");

  const debouncedQuery = useDebouncedValue(query, 200);

  // Province options are derived from the data itself, so the filter can never
  // offer a province that yields zero results.
  const provinceOptions = useMemo(() => {
    const bySlug = new Map<string, string>();
    for (const summary of cities) {
      if (!bySlug.has(summary.city.provinceSlug)) {
        bySlug.set(summary.city.provinceSlug, summary.city.province);
      }
    }
    return [...bySlug.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "id"));
  }, [cities]);

  const results = useMemo(() => {
    const terms = normalizeForSearch(debouncedQuery)
      .split(/\s+/)
      .filter(Boolean);

    const filtered = cities.filter((summary) => {
      if (province !== ALL_PROVINCES && summary.city.provinceSlug !== province) {
        return false;
      }
      if (terms.length === 0) return true;
      const haystack = normalizeForSearch(
        `${summary.city.name} ${summary.city.province}`,
      );
      return terms.every((term) => haystack.includes(term));
    });

    return [...filtered].sort((a, b) => {
      if (sort === "name") return a.city.name.localeCompare(b.city.name, "id");
      if (sort === "online") {
        return (
          b.online - a.online ||
          a.city.name.localeCompare(b.city.name, "id")
        );
      }
      return (
        b.cameras - a.cameras || a.city.name.localeCompare(b.city.name, "id")
      );
    });
  }, [cities, debouncedQuery, province, sort]);

  const isFiltered =
    query.trim().length > 0 || province !== ALL_PROVINCES || sort !== "cameras";

  const reset = () => {
    setQuery("");
    setProvince(ALL_PROVINCES);
    setSort("cameras");
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* ----------------------------- Controls ----------------------------- */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-subtle sm:p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari kota atau provinsi…"
            aria-label="Cari kota atau provinsi"
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Select value={province} onValueChange={setProvince}>
            <SelectTrigger
              className="w-full sm:w-52"
              aria-label="Filter provinsi"
            >
              <SelectValue placeholder="Semua provinsi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_PROVINCES}>Semua provinsi</SelectItem>
              {provinceOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={sort}
            onValueChange={(value) => setSort(value as CitySort)}
          >
            <SelectTrigger className="w-full sm:w-52" aria-label="Urutkan kota">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_ORDER.map((key) => (
                <SelectItem key={key} value={key}>
                  {SORT_LABELS[key]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --------------------------- Result count --------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Menampilkan{" "}
          <span className="font-medium text-foreground">
            {formatNumber(results.length)}
          </span>{" "}
          dari {formatNumber(cities.length)} kota
        </p>
        {isFiltered ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={reset}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Atur ulang
          </Button>
        ) : null}
      </div>

      {/* ------------------------------ Results ----------------------------- */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((summary) => (
            <CityCard key={summary.city.slug} summary={summary} />
          ))}
        </div>
      ) : (
        <CCTVEmptyState
          icon={
            <Building2
              className="h-5 w-5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          }
          title="Kota tidak ditemukan"
          description="Tidak ada kota yang cocok dengan pencarian atau filter saat ini. Coba kata kunci lain atau atur ulang filter."
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={reset}
              className="gap-1.5"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Atur ulang filter
            </Button>
          }
        />
      )}
    </div>
  );
}
