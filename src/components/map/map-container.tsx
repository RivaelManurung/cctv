"use client";

import type { ReactNode } from "react";
import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";

import { INDONESIA_CENTER, INDONESIA_ZOOM } from "@/lib/geo";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ *
 * Tile provider
 *
 * Kept as module constants so the provider is defined exactly once and
 * can never drift between the map and any future basemap switch.
 * ------------------------------------------------------------------ */

export const OSM_TILE_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

export const OSM_TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const OSM_MAX_ZOOM = 19;

/** Lowest zoom that still shows the whole archipelago sensibly. */
export const MAP_MIN_ZOOM = 4;

export interface MapContainerProps {
  children?: ReactNode;
  /** Map centre. Defaults to the geographic centre of Indonesia. */
  center?: [number, number];
  /** Initial zoom. Defaults to the archipelago-wide zoom. */
  zoom?: number;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
  scrollWheelZoom?: boolean;
}

/**
 * Thin wrapper around react-leaflet's `MapContainer`.
 *
 * It exists so the rest of the app never imports react-leaflet directly
 * (keeping the Leaflet dependency behind a single, client-only seam) and so
 * the zoom control is always disabled — the app ships its own controls.
 */
export function MapContainer({
  children,
  center = INDONESIA_CENTER,
  zoom = INDONESIA_ZOOM,
  minZoom = MAP_MIN_ZOOM,
  maxZoom = OSM_MAX_ZOOM,
  className,
  scrollWheelZoom = true,
}: MapContainerProps) {
  return (
    <LeafletMapContainer
      center={center}
      zoom={zoom}
      minZoom={minZoom}
      maxZoom={maxZoom}
      scrollWheelZoom={scrollWheelZoom}
      zoomControl={false}
      className={cn("h-full w-full", className)}
    >
      {children}
    </LeafletMapContainer>
  );
}

/**
 * OpenStreetMap raster tiles. Dark-mode inversion is handled globally by
 * `.dark .leaflet-tile-pane` in `globals.css`, so nothing is duplicated here.
 */
export function MapTileLayer() {
  return (
    <TileLayer
      url={OSM_TILE_URL}
      attribution={OSM_TILE_ATTRIBUTION}
      maxZoom={OSM_MAX_ZOOM}
      crossOrigin
    />
  );
}
