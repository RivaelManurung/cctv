"use client";

import {
  Building2,
  Camera,
  CornerDownLeft,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { realCCTVData } from "@/data/cctv";
import { cities } from "@/data/cities";
import { provinces } from "@/data/provinces";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useRecentSearches } from "@/hooks/use-library";
import { searchCCTV } from "@/lib/cctv-query";
import { cn, normalizeForSearch } from "@/lib/utils";

type ResultKind = "camera" | "city" | "province";

interface Result {
  kind: ResultKind;
  id: string;
  title: string;
  subtitle: string;
  href: string;
}

const MAX_CAMERAS = 6;
const MAX_PLACES = 3;

/**
 * Global quick search in the header.
 *
 * Searches cameras, cities and provinces over the static dataset with no
 * network round-trip. Fully keyboard driven: ↑/↓ to move, ↵ to open,
 * Esc to dismiss.
 */
export function HeaderSearch({ className }: { className?: string }) {
  const router = useRouter();
  const { recentSearches, addSearch } = useRecentSearches();

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const debounced = useDebouncedValue(query, 180);
  const isPending = query.trim() !== debounced.trim();

  const results = useMemo<Result[]>(() => {
    const term = normalizeForSearch(debounced.trim());
    if (term.length < 2) return [];

    const cameraResults: Result[] = searchCCTV(realCCTVData, debounced)
      .slice(0, MAX_CAMERAS)
      .map((camera) => ({
        kind: "camera",
        id: `camera-${camera.id}`,
        title: camera.name,
        subtitle: `${camera.city}, ${camera.province}`,
        href: `/cctv/${camera.slug}`,
      }));

    const cityResults: Result[] = cities
      .filter((city) => normalizeForSearch(city.name).includes(term))
      .slice(0, MAX_PLACES)
      .map((city) => ({
        kind: "city",
        id: `city-${city.slug}`,
        title: city.name,
        subtitle: city.province,
        href: `/cities/${city.slug}`,
      }));

    const provinceResults: Result[] = provinces
      .filter((province) => normalizeForSearch(province.name).includes(term))
      .slice(0, MAX_PLACES)
      .map((province) => ({
        kind: "province",
        id: `province-${province.slug}`,
        title: province.name,
        subtitle: `Provinsi · ${province.capital}`,
        href: `/provinces/${province.slug}`,
      }));

    return [...cameraResults, ...cityResults, ...provinceResults];
  }, [debounced]);

  // Close on outside click.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // Reset the highlighted row whenever the result set changes.
  useEffect(() => setActiveIndex(-1), [debounced]);

  // Global ⌘K / Ctrl+K focus shortcut.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const go = (href: string) => {
    if (query.trim().length >= 2) addSearch(query.trim());
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(href);
  };

  const submitFreeText = () => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    addSearch(trimmed);
    setOpen(false);
    setQuery("");
    inputRef.current?.blur();
    router.push(`/cctv?q=${encodeURIComponent(trimmed)}`);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const active = activeIndex >= 0 ? results[activeIndex] : undefined;
      if (active) go(active.href);
      else submitFreeText();
      return;
    }
    if (event.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showPanel =
    open && (query.trim().length >= 2 || recentSearches.length > 0);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Cari lokasi, kota, atau kamera…"
          aria-label="Cari CCTV"
          aria-expanded={showPanel}
          aria-controls="header-search-results"
          role="combobox"
          autoComplete="off"
          className={cn(
            "h-9 w-full rounded-lg border border-input bg-muted/40 pl-9 pr-16 text-sm text-foreground",
            "placeholder:text-muted-foreground",
            "transition-colors hover:bg-muted/60 focus-visible:bg-background",
            "[&::-webkit-search-cancel-button]:appearance-none",
          )}
        />
        {isPending ? (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden="true"
          />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Bersihkan pencarian"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : (
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground lg:flex">
            ⌘K
          </kbd>
        )}
      </div>

      {showPanel ? (
        <div
          id="header-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[70vh] overflow-y-auto rounded-xl border border-border bg-popover p-1.5 text-popover-foreground shadow-overlay animate-fade-up"
        >
          {query.trim().length < 2 ? (
            <div className="p-1">
              <p className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Pencarian terakhir
              </p>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  type="button"
                  role="option"
                  aria-selected={false}
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <Search
                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="truncate">{term}</span>
                </button>
              ))}
            </div>
          ) : results.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              Tidak ada hasil untuk{" "}
              <span className="font-medium text-foreground">“{query}”</span>
            </p>
          ) : (
            results.map((result, index) => {
              const Icon =
                result.kind === "camera"
                  ? Camera
                  : result.kind === "city"
                    ? Building2
                    : MapPin;
              return (
                <button
                  key={result.id}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => go(result.href)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors",
                    index === activeIndex ? "bg-accent" : "hover:bg-accent/60",
                  )}
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {result.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {result.subtitle}
                    </span>
                  </span>
                  {index === activeIndex ? (
                    <CornerDownLeft
                      className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  ) : null}
                </button>
              );
            })
          )}

          {query.trim().length >= 2 && results.length > 0 ? (
            <button
              type="button"
              onClick={submitFreeText}
              className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-border px-2.5 py-2 text-left text-xs font-medium text-primary transition-colors hover:bg-accent"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              Lihat semua hasil untuk “{query.trim()}”
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
