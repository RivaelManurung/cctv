"use client";

import L from "leaflet";
import { memo, useMemo } from "react";
import { Marker } from "react-leaflet";

import type { CameraStatus, CCTV } from "@/types/cctv";

/* ------------------------------------------------------------------ *
 * Marker appearance
 *
 * Leaflet's default marker images are deliberately avoided — they resolve
 * their URLs at runtime and break under bundlers. A `divIcon` styled with the
 * app's own `.cctv-marker` classes is both robust and theme-aware.
 * ------------------------------------------------------------------ */

const STATUS_BACKGROUND: Record<CameraStatus, string> = {
  online: "hsl(var(--success))",
  offline: "hsl(var(--destructive))",
  unknown: "hsl(var(--warning))",
};

const STATUS_FOREGROUND: Record<CameraStatus, string> = {
  online: "hsl(var(--success-foreground))",
  offline: "hsl(var(--destructive-foreground))",
  unknown: "hsl(var(--warning-foreground))",
};

/** Inline lucide "video" glyph — no runtime asset, no extra dependency. */
const CAMERA_GLYPH =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>';

const MARKER_SIZE = 32;

function createCameraIcon(status: CameraStatus, isActive: boolean): L.DivIcon {
  const background = STATUS_BACKGROUND[status];
  const foreground = STATUS_FOREGROUND[status];

  const activeStyle = isActive
    ? "transform:scale(1.18);box-shadow:0 0 0 3px hsl(var(--ring) / 0.45),0 6px 16px -4px rgb(0 0 0 / 0.35);"
    : "";

  const pulse = isActive
    ? `<span class="animate-pulse-ring" style="position:absolute;inset:0;border-radius:9999px;background:${background};"></span>`
    : "";

  return L.divIcon({
    className: "cctv-marker",
    html:
      `<span class="cctv-marker__pin relative" style="background:${background};color:${foreground};${activeStyle}">` +
      pulse +
      `<span style="position:relative;display:flex;align-items:center;justify-content:center;">${CAMERA_GLYPH}</span>` +
      "</span>",
    iconSize: [MARKER_SIZE, MARKER_SIZE],
    // The pin is circular, so the coordinate sits at its centre.
    iconAnchor: [MARKER_SIZE / 2, MARKER_SIZE / 2],
    popupAnchor: [0, -MARKER_SIZE / 2 - 2],
  });
}

export interface CCTVMarkerProps {
  camera: CCTV;
  isActive?: boolean;
  onSelect?: (id: string) => void;
}

/** A single camera pin. Memoised so clustering re-renders stay cheap. */
export const CCTVMarker = memo(function CCTVMarker({
  camera,
  isActive = false,
  onSelect,
}: CCTVMarkerProps) {
  const icon = useMemo(
    () => createCameraIcon(camera.status, isActive),
    [camera.status, isActive],
  );

  const position = useMemo<[number, number]>(
    () => [camera.latitude, camera.longitude],
    [camera.latitude, camera.longitude],
  );

  const eventHandlers = useMemo(
    () => ({ click: () => onSelect?.(camera.id) }),
    [onSelect, camera.id],
  );

  return (
    <Marker
      position={position}
      icon={icon}
      keyboard
      title={camera.name}
      alt={`${camera.name} — ${camera.city}, ${camera.province}`}
      zIndexOffset={isActive ? 1000 : 0}
      eventHandlers={eventHandlers}
    />
  );
});
