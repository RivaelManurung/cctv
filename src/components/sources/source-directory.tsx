"use client";

import { Search, SearchX } from "lucide-react";
import { useMemo, useState } from "react";

import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import {
  OPERATOR_TYPE_LABELS,
  SourceCard,
} from "@/components/shared/source-card";
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
import { formatNumber, normalizeForSearch } from "@/lib/utils";
import type { Source, SourceSummary } from "@/types/cctv";

type OperatorFilter = Source["operatorType"] | "all";
type SortKey = "cameras" | "name";

const OPERATOR_ORDER: Source["operatorType"][] = [
  "national",
  "provincial",
  "municipal",
  "state-owned",
  "other",
];

/**
 * Searchable, filterable directory of camera operators.
 *
 * The full list is server-rendered from the initial state (no query, all
 * operators, sorted by camera count) so the page is fully usable before any
 * JavaScript runs; filtering only kicks in after the user interacts.
 */
export function SourceDirectory({
  summaries,
}: {
  summaries: SourceSummary[];
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 250);
  const [operator, setOperator] = useState<OperatorFilter>("all");
  const [sort, setSort] = useState<SortKey>("cameras");

  const filtered = useMemo(() => {
    const needle = normalizeForSearch(debouncedQuery);

    const matches = summaries.filter((summary) => {
      if (operator !== "all" && summary.source.operatorType !== operator) {
        return false;
      }
      if (!needle) return true;

      const haystack = normalizeForSearch(
        [
          summary.source.name,
          summary.source.coverage,
          summary.source.description,
          ...summary.provinces,
        ].join(" "),
      );
      return haystack.includes(needle);
    });

    return [...matches].sort((a, b) =>
      sort === "name"
        ? a.source.name.localeCompare(b.source.name, "id")
        : b.cameras - a.cameras ||
          a.source.name.localeCompare(b.source.name, "id"),
    );
  }, [summaries, debouncedQuery, operator, sort]);

  const isFiltered = query !== "" || operator !== "all" || sort !== "cameras";

  function resetFilters() {
    setQuery("");
    setOperator("all");
    setSort("cameras");
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari sumber, cakupan, atau provinsi…"
            aria-label="Cari sumber CCTV"
            className="pl-9"
          />
        </div>

        <Select
          value={operator}
          onValueChange={(value) => setOperator(value as OperatorFilter)}
        >
          <SelectTrigger
            aria-label="Filter jenis operator"
            className="sm:w-44"
          >
            <SelectValue placeholder="Jenis operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua operator</SelectItem>
            {OPERATOR_ORDER.map((type) => (
              <SelectItem key={type} value={type}>
                {OPERATOR_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sort}
          onValueChange={(value) => setSort(value as SortKey)}
        >
          <SelectTrigger aria-label="Urutkan sumber" className="sm:w-48">
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cameras">Kamera terbanyak</SelectItem>
            <SelectItem value="name">Nama A–Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Menampilkan {formatNumber(filtered.length)} dari{" "}
        {formatNumber(summaries.length)} sumber
      </p>

      {filtered.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((summary) => (
            <SourceCard key={summary.source.id} summary={summary} />
          ))}
        </div>
      ) : (
        <CCTVEmptyState
          icon={
            <SearchX className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          }
          title="Tidak ada sumber yang cocok"
          description="Coba ubah kata pencarian atau pilih jenis operator yang lain."
          action={
            isFiltered ? (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Atur ulang filter
              </Button>
            ) : undefined
          }
        />
      )}
    </div>
  );
}
