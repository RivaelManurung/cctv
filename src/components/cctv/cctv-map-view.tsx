"use client";

import {
  Crosshair,
  List,
  Map as MapIcon,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { CameraPoster } from "@/components/cctv/camera-poster";
import type { CCTVMapProps } from "@/components/cctv/cctv-map";
import { CCTVEmptyState } from "@/components/cctv/cctv-empty-state";
import { MapSkeleton } from "@/components/cctv/cctv-skeleton";
import {
  CCTVStatusBadge,
  SampleBadge,
  StreamTypeBadge,
} from "@/components/cctv/cctv-status";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getCategory } from "@/data/categories";
import { useFilters } from "@/hooks/use-filters";
import { useIsDesktop } from "@/hooks/use-media-query";
import { filterByBounds } from "@/lib/geo";
import { cn, formatNumber } from "@/lib/utils";
import { useUIStore } from "@/stores/use-ui-store";
import type { CCTV, MapBounds } from "@/types/cctv";

/**
 * Leaflet touches `window`/`document` as soon as it is imported, so the map is
 * loaded lazily and never during SSR. The skeleton rendered by `loading` is
 * what the server actually ships.
 */
const CCTVMap = dynamic<CCTVMapProps>(
  () => import("@/components/cctv/cctv-map").then((module) => module.CCTVMap),
  {
    ssr: false,
    loading: () => <MapSkeleton className="h-full w-full" />,
  },
);

/** Shared height so the map and the list stay aligned on every breakpoint. */
const PANEL_HEIGHT =
  "h-[68dvh] min-h-[440px] lg:h-[calc(100dvh-17rem)] lg:min-h-[520px]";

export interface CCTVMapViewProps {
  cameras: CCTV[];
  className?: string;
  /** Camera id to focus on first paint, e.g. from the `/map?camera=` deep link. */
  focusCameraId?: string;
}

/**
 * Map + list split view.
 *
 * The map receives the full (URL-filtered) camera set so panning never removes
 * pins; only the right-hand list is narrowed down to the visible region.
 */
export function CCTVMapView({
  cameras,
  className,
  focusCameraId,
}: CCTVMapViewProps) {
  const isDesktop = useIsDesktop();
  const mapSplit = useUIStore((state) => state.mapSplit);
  const setMapSplit = useUIStore((state) => state.setMapSplit);
  const setFocusedCameraId = useUIStore((state) => state.setFocusedCameraId);
  const { resetFilters } = useFilters();

  // Seeded once from the deep link; selection afterwards is purely local state.
  const [activeId, setActiveId] = useState<string | null>(
    focusCameraId ?? null,
  );
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [mobileTab, setMobileTab] = useState<"map" | "list">("map");

  const rowRefs = useRef(new Map<string, HTMLLIElement>());

  const visibleCameras = useMemo(
    () => (bounds ? filterByBounds(cameras, bounds) : cameras),
    [cameras, bounds],
  );

  const handleSelect = useCallback((id: string) => {
    setActiveId(id ? id : null);
  }, []);

  const handleBoundsChange = useCallback((next: MapBounds) => {
    setBounds(next);
  }, []);

  const showMap = isDesktop || mobileTab === "map";
  const showList = isDesktop ? mapSplit : mobileTab === "list";
  const split = isDesktop && mapSplit;

  // Bring the row for the selected pin into view without scrolling the page.
  useEffect(() => {
    if (!activeId) return;
    rowRefs.current
      .get(activeId)
      ?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeId, visibleCameras]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {formatNumber(visibleCameras.length)}
          </span>{" "}
          kamera di area ini
        </p>

        {isDesktop ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setMapSplit(!mapSplit)}
            aria-pressed={!mapSplit}
          >
            {mapSplit ? (
              <>
                <PanelRightClose aria-hidden="true" />
                Peta penuh
              </>
            ) : (
              <>
                <PanelRightOpen aria-hidden="true" />
                Tampilkan daftar
              </>
            )}
          </Button>
        ) : (
          <ToggleGroup
            type="single"
            value={mobileTab}
            onValueChange={(value) => {
              if (value === "map" || value === "list") setMobileTab(value);
            }}
            aria-label="Pilih tampilan peta atau daftar"
            className="rounded-lg border border-border bg-card p-0.5"
          >
            <ToggleGroupItem value="map" className="gap-1.5 px-3 text-xs">
              <MapIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Peta
            </ToggleGroupItem>
            <ToggleGroupItem value="list" className="gap-1.5 px-3 text-xs">
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              Daftar
            </ToggleGroupItem>
          </ToggleGroup>
        )}
      </div>

      <div
        className={cn(
          "grid gap-4",
          split ? "lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" : "grid-cols-1",
        )}
      >
        <div className={cn("relative", PANEL_HEIGHT, !showMap && "hidden")}>
          <CCTVMap
            cameras={cameras}
            activeId={activeId}
            onSelect={handleSelect}
            onBoundsChange={handleBoundsChange}
            className="h-full w-full"
          />
        </div>

        {showList ? (
          <div
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
              "max-h-[72dvh] lg:max-h-[calc(100dvh-17rem)]",
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
              <p className="text-xs text-muted-foreground">
                Geser peta untuk memperbarui daftar
              </p>
              {activeId ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setActiveId(null)}
                >
                  <X aria-hidden="true" />
                  Bersihkan
                </Button>
              ) : null}
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              {cameras.length === 0 ? (
                <CCTVEmptyState
                  title="Tidak ada kamera yang cocok"
                  description="Ubah atau hapus filter untuk melihat kamera di peta."
                  action={
                    <Button type="button" variant="outline" size="sm" onClick={resetFilters}>
                      Reset filter
                    </Button>
                  }
                />
              ) : visibleCameras.length === 0 ? (
                <CCTVEmptyState
                  title="Tidak ada kamera di area ini"
                  description="Geser atau perkecil peta untuk melihat kamera lain."
                />
              ) : (
                <ul className="space-y-1.5">
                  {visibleCameras.map((camera) => (
                    <MapCameraRow
                      key={camera.id}
                      camera={camera}
                      isActive={camera.id === activeId}
                      onSelect={handleSelect}
                      onHover={setFocusedCameraId}
                      rowRef={(node) => {
                        if (node) rowRefs.current.set(camera.id, node);
                        else rowRefs.current.delete(camera.id);
                      }}
                    />
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

interface MapCameraRowProps {
  camera: CCTV;
  isActive: boolean;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  rowRef: (node: HTMLLIElement | null) => void;
}

function MapCameraRow({
  camera,
  isActive,
  onSelect,
  onHover,
  rowRef,
}: MapCameraRowProps) {
  const category = getCategory(camera.category);

  return (
    <li
      ref={rowRef}
      onMouseEnter={() => onHover(camera.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        "flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
        isActive
          ? "border-primary/60 bg-accent/50 ring-1 ring-primary/30"
          : "border-border bg-card hover:bg-accent/40",
      )}
    >
      <Link
        href={`/cctv/${camera.slug}`}
        className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-border"
        tabIndex={-1}
        aria-hidden="true"
      >
        <CameraPoster camera={camera} compact />
      </Link>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/cctv/${camera.slug}`}
            className="truncate text-sm font-medium transition-colors hover:text-primary"
          >
            {camera.name}
          </Link>
          {camera.isSample ? <SampleBadge /> : null}
        </div>

        <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
          <MapIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {camera.city}
            {category ? ` · ${category.labelId}` : ""}
          </span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <StreamTypeBadge
          streamType={camera.streamType}
          size="sm"
          className="hidden sm:inline-flex"
        />
        <CCTVStatusBadge status={camera.status} size="sm" showLabel={false} />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("h-8 w-8", isActive && "text-primary")}
          aria-label={`Tampilkan ${camera.name} di peta`}
          aria-pressed={isActive}
          onClick={() => onSelect(camera.id)}
        >
          <Crosshair aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
