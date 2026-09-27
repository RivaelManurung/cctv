"use client";

import "leaflet/dist/leaflet.css";

import type { LatLngBounds } from "leaflet";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMap, useMapEvents } from "react-leaflet";

import { CCTVPopup } from "@/components/cctv/cctv-popup";
import { MapContainer, MapTileLayer } from "@/components/map/map-container";
import {
  MapControls,
  requestUserLocation,
  useFullscreen,
} from "@/components/map/map-controls";
import { MarkerCluster } from "@/components/map/marker-cluster";
import { INDONESIA_CENTER, INDONESIA_ZOOM } from "@/lib/geo";
import { useUIStore } from "@/stores/use-ui-store";
import { cn } from "@/lib/utils";
import type { CCTV, MapBounds } from "@/types/cctv";

/** Zoom used when focusing a single camera — past the clustering break point. */
const FOCUS_ZOOM = 14;

export interface CCTVMapProps {
  cameras: CCTV[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  className?: string;
}

function toMapBounds(bounds: LatLngBounds): MapBounds {
  return {
    north: bounds.getNorth(),
    south: bounds.getSouth(),
    east: bounds.getEast(),
    west: bounds.getWest(),
  };
}

/* ------------------------------------------------------------------ *
 * Map behaviour helpers — every one of them is a leaf component so the
 * map is never re-created when its inputs change.
 * ------------------------------------------------------------------ */

/** Publishes the visible region on every pan/zoom, including the first paint. */
function BoundsReporter({
  onBoundsChange,
}: {
  onBoundsChange?: (bounds: MapBounds) => void;
}) {
  const map = useMap();

  const report = useCallback(() => {
    onBoundsChange?.(toMapBounds(map.getBounds()));
  }, [map, onBoundsChange]);

  // Memoised so Leaflet's listeners are never re-bound on an unrelated render.
  const handlers = useMemo(
    () => ({ moveend: report, zoomend: report }),
    [report],
  );

  useMapEvents(handlers);

  useEffect(() => {
    report();
  }, [report]);

  return null;
}

/** Pans/zooms to the active camera without re-mounting the map. */
function FlyToCamera({ camera }: { camera: CCTV | null }) {
  const map = useMap();

  useEffect(() => {
    if (!camera) return;
    map.flyTo(
      [camera.latitude, camera.longitude],
      Math.max(map.getZoom(), FOCUS_ZOOM),
      { duration: 0.75 },
    );
  }, [map, camera]);

  return null;
}

/** Keeps Leaflet's internal size in sync with the container (fullscreen, tabs). */
function ResizeHandler() {
  const map = useMap();

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());

    return () => observer.disconnect();
  }, [map]);

  return null;
}

/** Clicking the map background (never a pin or popup) clears the selection. */
function MapClickClear({ onClear }: { onClear: () => void }) {
  const handlers = useMemo(() => ({ click: onClear }), [onClear]);
  useMapEvents(handlers);
  return null;
}

interface MapControllerProps {
  cameras: CCTV[];
  activeCamera: CCTV | null;
  highlightId: string | null;
  onSelect?: (id: string) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  onPopupClose: (cameraId: string) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

function MapController({
  cameras,
  activeCamera,
  highlightId,
  onSelect,
  onBoundsChange,
  onPopupClose,
  isFullscreen,
  onToggleFullscreen,
}: MapControllerProps) {
  const map = useMap();

  const handleZoomIn = useCallback(() => map.zoomIn(), [map]);
  const handleZoomOut = useCallback(() => map.zoomOut(), [map]);

  const handleReset = useCallback(() => {
    map.flyTo(INDONESIA_CENTER, INDONESIA_ZOOM, { duration: 0.7 });
  }, [map]);

  const handleLocate = useCallback(async () => {
    // Geolocation is only ever requested from this click handler.
    const location = await requestUserLocation();
    if (!location) return;
    map.flyTo([location.latitude, location.longitude], FOCUS_ZOOM, {
      duration: 0.9,
    });
  }, [map]);

  const handleClear = useCallback(() => onSelect?.(""), [onSelect]);

  const handlePopupClose = useCallback(() => {
    if (activeCamera) onPopupClose(activeCamera.id);
  }, [activeCamera, onPopupClose]);

  return (
    <>
      <MarkerCluster
        cameras={cameras}
        activeId={highlightId}
        onSelect={onSelect}
      />

      <FlyToCamera camera={activeCamera} />
      <BoundsReporter onBoundsChange={onBoundsChange} />
      <ResizeHandler />
      <MapClickClear onClear={handleClear} />

      {activeCamera ? (
        <CCTVPopup
          key={activeCamera.id}
          camera={activeCamera}
          onClose={handlePopupClose}
        />
      ) : null}

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
        onLocate={handleLocate}
        onFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
      />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Public component
 * ------------------------------------------------------------------ */

/**
 * The inner Leaflet map.
 *
 * This module imports `leaflet` and its stylesheet at the top level, so it
 * must only ever be loaded through `next/dynamic` with `ssr: false` (see
 * `cctv-map-view.tsx`).
 */
export function CCTVMap({
  cameras,
  activeId = null,
  onSelect,
  onBoundsChange,
  className,
}: CCTVMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(containerRef);

  // Hovering a list row highlights its pin without moving the map.
  const focusedCameraId = useUIStore((state) => state.focusedCameraId);

  const activeCamera = useMemo(
    () => (activeId ? cameras.find((camera) => camera.id === activeId) ?? null : null),
    [cameras, activeId],
  );

  const highlightId = focusedCameraId ?? activeId;

  // Read inside the close handler so a pin switch can never clear the new pin.
  const activeIdRef = useRef<string | null>(activeId);
  activeIdRef.current = activeId;

  const handlePopupClose = useCallback(
    (cameraId: string) => {
      if (activeIdRef.current === cameraId) onSelect?.("");
    },
    [onSelect],
  );

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border border-border bg-muted",
        className,
      )}
    >
      <MapContainer
        center={INDONESIA_CENTER}
        zoom={INDONESIA_ZOOM}
        className="h-full w-full"
      >
        <MapTileLayer />
        <MapController
          cameras={cameras}
          activeCamera={activeCamera}
          highlightId={highlightId}
          onSelect={onSelect}
          onBoundsChange={onBoundsChange}
          onPopupClose={handlePopupClose}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </MapContainer>
    </div>
  );
}
