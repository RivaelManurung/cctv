"use client";

import {
  LocateFixed,
  Maximize,
  Minimize,
  Minus,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories } from "@/data/categories";
import { getCity } from "@/data/cities";
import { realCCTVData } from "@/data/cctv";
import { provinces } from "@/data/provinces";
import { useFilters } from "@/hooks/use-filters";
import { cn } from "@/lib/utils";
import type { CCTVFilters } from "@/types/cctv";

/* ------------------------------------------------------------------ *
 * Shared option shape
 * ------------------------------------------------------------------ */

/** Sentinel for the "no filter" entry — Radix forbids an empty item value. */
const ALL = "all";

interface FilterOption {
  value: string;
  label: string;
  count: number;
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "unknown", label: "Tidak diketahui" },
];

/* ------------------------------------------------------------------ *
 * Imperative browser APIs
 *
 * Both live here (not in the map component) so the DOM-facing logic has a
 * single home; neither ever runs during render.
 * ------------------------------------------------------------------ */

export interface UserLocation {
  latitude: number;
  longitude: number;
}

/**
 * Feature-detected geolocation request. Resolves `null` (and surfaces a toast)
 * when the browser has no support, the user denies permission or the request
 * times out — so callers never have to handle a rejection.
 */
export function requestUserLocation(): Promise<UserLocation | null> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      toast.error("Perangkat ini tidak mendukung layanan lokasi.");
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => {
        toast.error(
          "Lokasi tidak dapat diakses. Periksa izin lokasi peramban Anda.",
        );
        resolve(null);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    );
  });
}

/**
 * Fullscreen API binding for a container element.
 *
 * `fullscreenchange` is observed so the state stays correct when the user
 * leaves fullscreen with the browser's own Escape shortcut.
 */
export function useFullscreen(targetRef: RefObject<HTMLElement | null>) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const element = targetRef.current;
    if (!element) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      if (typeof element.requestFullscreen !== "function") {
        toast.error("Mode layar penuh tidak didukung perangkat ini.");
        return;
      }
      await element.requestFullscreen();
    } catch {
      toast.error("Tidak dapat mengubah mode layar penuh.");
    }
  }, [targetRef]);

  return { isFullscreen, toggleFullscreen };
}

/* ------------------------------------------------------------------ *
 * Map controls
 * ------------------------------------------------------------------ */

export interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate?: () => void;
  onReset: () => void;
  onFullscreen?: () => void;
  isFullscreen?: boolean;
  className?: string;
}

/** Vertical stack of floating map controls, pinned to the top-right. */
export function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onReset,
  onFullscreen,
  isFullscreen = false,
  className,
}: MapControlsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // The controls live *inside* the Leaflet container, so without this every
  // button click would also pan/drag the map. Leaflet is imported lazily so
  // this module stays safe to evaluate on the server.
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    let cancelled = false;
    void import("leaflet").then((leaflet) => {
      if (cancelled) return;
      leaflet.DomEvent.disableClickPropagation(element);
      leaflet.DomEvent.disableScrollPropagation(element);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute right-4 top-4 z-[5] flex flex-col gap-0.5 rounded-lg border border-border bg-background/90 p-1 shadow-elevated backdrop-blur",
        className,
      )}
    >
      <TooltipProvider delayDuration={200}>
        <ControlButton label="Perbesar" onClick={onZoomIn}>
          <Plus aria-hidden="true" />
        </ControlButton>
        <ControlButton label="Perkecil" onClick={onZoomOut}>
          <Minus aria-hidden="true" />
        </ControlButton>

        <span className="my-0.5 h-px bg-border" aria-hidden="true" />

        <ControlButton label="Kembali ke Indonesia" onClick={onReset}>
          <RotateCcw aria-hidden="true" />
        </ControlButton>

        {onLocate ? (
          <ControlButton label="Lokasi saya" onClick={onLocate}>
            <LocateFixed aria-hidden="true" />
          </ControlButton>
        ) : null}

        {onFullscreen ? (
          <ControlButton
            label={isFullscreen ? "Keluar layar penuh" : "Layar penuh"}
            onClick={onFullscreen}
          >
            {isFullscreen ? (
              <Minimize aria-hidden="true" />
            ) : (
              <Maximize aria-hidden="true" />
            )}
          </ControlButton>
        ) : null}
      </TooltipProvider>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={label}
          onClick={onClick}
          className="h-9 w-9 rounded-md text-foreground"
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
}

/* ------------------------------------------------------------------ *
 * Filter bar
 * ------------------------------------------------------------------ */

export interface MapFilterBarProps {
  className?: string;
}

/**
 * URL-backed filter strip for the map.
 *
 * On desktop it renders four inline selects; below `md` the same fields move
 * into a bottom sheet so the map keeps as much vertical space as possible.
 */
export function MapFilterBar({ className }: MapFilterBarProps) {
  const { filters, setFilters, activeCount, resetFilters } = useFilters();

  const provinceOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    for (const camera of realCCTVData) {
      counts.set(camera.provinceSlug, (counts.get(camera.provinceSlug) ?? 0) + 1);
    }
    return provinces
      .filter((province) => counts.has(province.slug))
      .map((province) => ({
        value: province.slug,
        label: province.name,
        count: counts.get(province.slug) ?? 0,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "id"));
  }, []);

  const cityOptions = useMemo<FilterOption[]>(() => {
    const counts = new Map<string, number>();
    for (const camera of realCCTVData) {
      if (filters.province && camera.provinceSlug !== filters.province) {
        continue;
      }
      counts.set(camera.citySlug, (counts.get(camera.citySlug) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([slug, count]) => ({
        value: slug,
        label: getCity(slug)?.name ?? slug,
        count,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "id"));
  }, [filters.province]);

  const categoryOptions = useMemo<FilterOption[]>(
    () => categories.map((category) => ({ value: category.slug, label: category.labelId, count: 0 })),
    [],
  );

  const renderFields = (idPrefix: string) => (
    <FilterFields
      idPrefix={idPrefix}
      province={filters.province}
      city={filters.city}
      category={filters.category}
      status={filters.status}
      provinceOptions={provinceOptions}
      cityOptions={cityOptions}
      categoryOptions={categoryOptions}
      onChange={setFilters}
    />
  );

  return (
    <section
      aria-label="Filter peta"
      className={cn(
        "rounded-xl border border-border bg-card p-3 shadow-subtle",
        className,
      )}
    >
      <div className="hidden md:block">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {renderFields("desktop")}
        </div>

        {activeCount > 0 ? (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              {activeCount} filter aktif
            </p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              <X aria-hidden="true" />
              Reset filter
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1 justify-center"
            >
              <SlidersHorizontal aria-hidden="true" />
              Filter
              {activeCount > 0 ? (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-semibold text-secondary-foreground">
                  {activeCount}
                </span>
              ) : null}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[85dvh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter peta</SheetTitle>
              <SheetDescription>
                Pilih provinsi, kota, kategori, atau status kamera.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-5 flex flex-col gap-4">
              {renderFields("mobile")}
            </div>
            {activeCount > 0 ? (
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={resetFilters}
              >
                <X aria-hidden="true" />
                Reset filter
              </Button>
            ) : null}
          </SheetContent>
        </Sheet>

        {activeCount > 0 ? (
          <Button type="button" variant="ghost" size="sm" onClick={resetFilters}>
            Reset
          </Button>
        ) : null}
      </div>
    </section>
  );
}

interface FilterFieldsProps {
  idPrefix: string;
  province: string;
  city: string;
  category: string;
  status: string;
  provinceOptions: FilterOption[];
  cityOptions: FilterOption[];
  categoryOptions: FilterOption[];
  onChange: (patch: Partial<CCTVFilters>) => void;
}

function FilterFields({
  idPrefix,
  province,
  city,
  category,
  status,
  provinceOptions,
  cityOptions,
  categoryOptions,
  onChange,
}: FilterFieldsProps) {
  const cityDisabled = cityOptions.length === 0;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-province`} className="text-xs text-muted-foreground">
          Provinsi
        </Label>
        <Select
          value={province || ALL}
          onValueChange={(value) =>
            onChange({ province: value === ALL ? "" : value, city: "" })
          }
        >
          <SelectTrigger id={`${idPrefix}-province`} className="h-9 bg-background">
            <SelectValue placeholder="Semua provinsi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua provinsi</SelectItem>
            {provinceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                <span className="ml-1 text-muted-foreground">({option.count})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-city`} className="text-xs text-muted-foreground">
          Kota
        </Label>
        <Select
          value={city || ALL}
          onValueChange={(value) => onChange({ city: value === ALL ? "" : value })}
          disabled={cityDisabled}
        >
          <SelectTrigger id={`${idPrefix}-city`} className="h-9 bg-background">
            <SelectValue placeholder="Semua kota" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua kota</SelectItem>
            {cityOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
                <span className="ml-1 text-muted-foreground">({option.count})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-category`} className="text-xs text-muted-foreground">
          Kategori
        </Label>
        <Select
          value={category || ALL}
          onValueChange={(value) =>
            onChange({ category: value === ALL ? "" : value })
          }
        >
          <SelectTrigger id={`${idPrefix}-category`} className="h-9 bg-background">
            <SelectValue placeholder="Semua kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua kategori</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-status`} className="text-xs text-muted-foreground">
          Status
        </Label>
        <Select
          value={status || ALL}
          onValueChange={(value) => onChange({ status: value === ALL ? "" : value })}
        >
          <SelectTrigger id={`${idPrefix}-status`} className="h-9 bg-background">
            <SelectValue placeholder="Semua status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Semua status</SelectItem>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
