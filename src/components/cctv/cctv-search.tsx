"use client";

import { Clock, Search, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFilters } from "@/hooks/use-filters";
import { useRecentSearches } from "@/hooks/use-library";
import { cn, formatNumber } from "@/lib/utils";

export interface CCTVSearchProps {
  /** Current term — normally the server-parsed `?q=` value. */
  value?: string;
  /**
   * Commit handler. When omitted the component writes `?q=` to the URL itself
   * via {@link useFilters}, which is what keeps the page a Server Component.
   */
  onCommit?: (term: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

/**
 * Debounced search field for the explorer.
 *
 * The URL is the single source of truth: a debounced commit rewrites `?q=` so
 * a refresh, a shared link and the back button all restore the same results.
 */
export function CCTVSearch({
  value,
  onCommit,
  placeholder = "Cari nama kamera, jalan, atau kota…",
  className,
  autoFocus = false,
}: CCTVSearchProps) {
  const live = useFilters();
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();

  const controlled = onCommit !== undefined;
  const externalQuery = controlled ? (value ?? live.filters.q) : live.filters.q;

  const [term, setTerm] = useState(value ?? live.filters.q);
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const lastCommitted = useRef(value ?? live.filters.q);

  const debounced = useDebouncedValue(term, 250);
  const setFilters = live.setFilters;

  // Debounced commit — this is the only place typing reaches the URL.
  useEffect(() => {
    if (debounced === lastCommitted.current) return;
    lastCommitted.current = debounced;
    if (onCommit) onCommit(debounced);
    else setFilters({ q: debounced });
    if (debounced.trim().length >= 2) addSearch(debounced.trim());
  }, [debounced, onCommit, setFilters, addSearch]);

  // Reflect query changes made elsewhere (chips, reset, back button).
  useEffect(() => {
    if (externalQuery === lastCommitted.current) return;
    lastCommitted.current = externalQuery;
    setTerm(externalQuery);
  }, [externalQuery]);

  // Dismiss the recent-searches panel on an outside pointer press.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const commitNow = (next: string) => {
    lastCommitted.current = next;
    if (onCommit) onCommit(next);
    else setFilters({ q: next });
    if (next.trim().length >= 2) addSearch(next.trim());
  };

  const showRecent = open && term.trim().length === 0 && recentSearches.length > 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />

      <input
        ref={inputRef}
        type="search"
        value={term}
        autoFocus={autoFocus}
        onChange={(event) => {
          setTerm(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitNow(term);
            setOpen(false);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        placeholder={placeholder}
        aria-label="Cari CCTV"
        role="combobox"
        aria-expanded={showRecent}
        aria-controls="cctv-search-recent"
        aria-autocomplete="list"
        autoComplete="off"
        className={cn(
          "h-10 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-10 text-sm text-foreground",
          "placeholder:text-muted-foreground",
          "transition-colors hover:bg-muted/60 focus-visible:bg-background",
          "[&::-webkit-search-cancel-button]:appearance-none",
        )}
      />

      {term ? (
        <button
          type="button"
          onClick={() => {
            setTerm("");
            commitNow("");
            inputRef.current?.focus();
          }}
          aria-label="Bersihkan pencarian"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      ) : null}

      {showRecent ? (
        <div
          id="cctv-search-recent"
          role="listbox"
          aria-label="Pencarian terakhir"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-overlay animate-fade-up"
        >
          <p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Pencarian terakhir
          </p>

          {recentSearches.map((item) => (
            <button
              key={item}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => {
                setTerm(item);
                commitNow(item);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent"
            >
              <Clock
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="truncate">{item}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              clearSearches();
              setOpen(false);
            }}
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg border-t border-border px-2.5 py-2 text-left text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Hapus riwayat
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Live result summary announced to assistive tech as the filters change. */
export function SearchResultCount({
  count,
  query,
  className,
}: {
  count: number;
  query?: string;
  className?: string;
}) {
  const term = query?.trim() ?? "";

  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="font-medium tabular-nums text-foreground">
        {formatNumber(count)}
      </span>{" "}
      kamera ditemukan
      {term ? (
        <>
          {" "}
          untuk{" "}
          <span className="font-medium text-foreground">“{term}”</span>
        </>
      ) : null}
    </p>
  );
}
