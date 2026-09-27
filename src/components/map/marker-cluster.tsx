"use client";

import L from "leaflet";
import { memo, useCallback, useMemo, useState } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";

import { CCTVMarker } from "@/components/cctv/cctv-marker";
import { boundsToLatLngTuple } from "@/lib/geo";
import type { CCTV } from "@/types/cctv";

/* ------------------------------------------------------------------ *
 * Clustering
 *
 * Implemented in-house (no marker-cluster plugin): cameras are bucketed into
 * a lat/lng grid whose cell size shrinks with zoom, so zooming in naturally
 * de-clusters. Above `CLUSTER_BREAK_ZOOM` every camera is drawn individually.
 * ------------------------------------------------------------------ */

/** At and above this zoom a cluster is pure noise, so pins win. */
const CLUSTER_BREAK_ZOOM = 13;

/** Hard ceiling on simultaneously rendered pins — protects the frame budget. */
const MAX_INDIVIDUAL_MARKERS = 400;

const MIN_CELL_DEGREES = 0.5;

interface ClusterBucket {
  key: string;
  cameras: CCTV[];
  latitude: number;
  longitude: number;
  north: number;
  south: number;
  east: number;
  west: number;
}

/** Current zoom level, re-read whenever the map finishes zooming. */
function useZoomLevel(): number {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());

  const handleZoomEnd = useCallback(() => setZoom(map.getZoom()), [map]);
  const handlers = useMemo(() => ({ zoomend: handleZoomEnd }), [handleZoomEnd]);

  useMapEvents(handlers);

  return zoom;
}

function buildBuckets(cameras: CCTV[], cell: number): ClusterBucket[] {
  const groups = new Map<string, CCTV[]>();

  for (const camera of cameras) {
    const key = `${Math.floor(camera.latitude / cell)}:${Math.floor(camera.longitude / cell)}`;
    const group = groups.get(key);
    if (group) group.push(camera);
    else groups.set(key, [camera]);
  }

  const buckets: ClusterBucket[] = [];

  for (const [key, group] of groups) {
    let north = -Infinity;
    let south = Infinity;
    let east = -Infinity;
    let west = Infinity;
    let latitude = 0;
    let longitude = 0;

    for (const camera of group) {
      north = Math.max(north, camera.latitude);
      south = Math.min(south, camera.latitude);
      east = Math.max(east, camera.longitude);
      west = Math.min(west, camera.longitude);
      latitude += camera.latitude;
      longitude += camera.longitude;
    }

    buckets.push({
      key,
      cameras: group,
      latitude: latitude / group.length,
      longitude: longitude / group.length,
      north,
      south,
      east,
      west,
    });
  }

  return buckets;
}

function singletonBucket(camera: CCTV): ClusterBucket {
  return {
    key: camera.id,
    cameras: [camera],
    latitude: camera.latitude,
    longitude: camera.longitude,
    north: camera.latitude,
    south: camera.latitude,
    east: camera.longitude,
    west: camera.longitude,
  };
}

function createClusterIcon(count: number): L.DivIcon {
  return L.divIcon({
    // Reuse `.cctv-marker` so Leaflet's default white `divIcon` box never shows.
    className: "cctv-marker",
    html:
      '<span style="display:flex;align-items:center;justify-content:center;height:38px;min-width:38px;padding:0 9px;border-radius:9999px;' +
      "background:hsl(var(--primary));color:hsl(var(--primary-foreground));border:2px solid hsl(var(--background));" +
      'box-shadow:0 4px 12px -2px rgb(0 0 0 / 0.28);font-size:12px;font-weight:600;line-height:1;letter-spacing:-0.01em;">' +
      `${count}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

const ClusterMarker = memo(function ClusterMarker({
  bucket,
  onActivate,
}: {
  bucket: ClusterBucket;
  onActivate: (bucket: ClusterBucket) => void;
}) {
  const icon = useMemo(
    () => createClusterIcon(bucket.cameras.length),
    [bucket.cameras.length],
  );

  const position = useMemo<[number, number]>(
    () => [bucket.latitude, bucket.longitude],
    [bucket.latitude, bucket.longitude],
  );

  const eventHandlers = useMemo(
    () => ({ click: () => onActivate(bucket) }),
    [onActivate, bucket],
  );

  return (
    <Marker
      position={position}
      icon={icon}
      keyboard
      title={`${bucket.cameras.length} kamera di area ini`}
      alt={`Klaster ${bucket.cameras.length} kamera`}
      eventHandlers={eventHandlers}
    />
  );
});

export interface MarkerClusterProps {
  cameras: CCTV[];
  onSelect?: (id: string) => void;
  activeId?: string | null;
}

/**
 * Renders either individual pins or cluster badges for the current zoom.
 *
 * Bucketing is memoised on `[cameras, zoom]` so panning never recomputes it.
 */
export const MarkerCluster = memo(function MarkerCluster({
  cameras,
  onSelect,
  activeId,
}: MarkerClusterProps) {
  const map = useMap();
  const zoom = useZoomLevel();

  const buckets = useMemo(() => {
    if (zoom >= CLUSTER_BREAK_ZOOM) {
      return cameras.map(singletonBucket);
    }

    const baseCell = MIN_CELL_DEGREES / 2 ** (zoom - 5);
    // Rather than dropping cameras, coarsen the grid when the set is huge.
    const cell =
      cameras.length > MAX_INDIVIDUAL_MARKERS
        ? baseCell * Math.ceil(cameras.length / MAX_INDIVIDUAL_MARKERS)
        : baseCell;

    return buildBuckets(cameras, cell);
  }, [cameras, zoom]);

  const handleActivate = useCallback(
    (bucket: ClusterBucket) => {
      map.fitBounds(boundsToLatLngTuple(bucket), {
        padding: [56, 56],
        maxZoom: CLUSTER_BREAK_ZOOM + 1,
      });
    },
    [map],
  );

  return (
    <>
      {buckets.map((bucket) =>
        bucket.cameras.length === 1 ? (
          <CCTVMarker
            key={bucket.key}
            camera={bucket.cameras[0]}
            isActive={bucket.cameras[0].id === activeId}
            onSelect={onSelect}
          />
        ) : (
          <ClusterMarker
            key={bucket.key}
            bucket={bucket}
            onActivate={handleActivate}
          />
        ),
      )}
    </>
  );
});
