import { cities } from "@/data/cities";
import type { CCTV, City, MapBounds } from "@/types/cctv";

/* ------------------------------------------------------------------ *
 * Indonesia defaults
 * ------------------------------------------------------------------ */

/** Geographic centre of the Indonesian archipelago. */
export const INDONESIA_CENTER: [number, number] = [-2.5, 118.0];
export const INDONESIA_ZOOM = 5;

/** Rough bounding box that comfortably contains every province. */
export const INDONESIA_BOUNDS: MapBounds = {
  north: 6.5,
  south: -11.5,
  west: 94.0,
  east: 141.5,
};

/* ------------------------------------------------------------------ *
 * Distance
 * ------------------------------------------------------------------ */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance in kilometres. */
export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** "12 km" / "340 km" — compact enough for a chip. */
export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString("id-ID")} km`;
}

/**
 * Nearest cities to `city`, excluding itself. Computed geometrically rather
 * than stored, so adding a city automatically keeps every neighbour list
 * correct.
 */
export function getNearbyCities(city: City, limit = 6): City[] {
  return cities
    .filter((candidate) => candidate.slug !== city.slug)
    .map((candidate) => ({
      city: candidate,
      distance: haversineKm(
        city.latitude,
        city.longitude,
        candidate.latitude,
        candidate.longitude,
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map((entry) => entry.city);
}

/** Nearby cities that actually have cameras, so the section is never empty. */
export function getNearbyCitiesWithCameras(
  city: City,
  cameras: CCTV[],
  limit = 4,
): { city: City; cameras: number; distanceKm: number }[] {
  const counts = new Map<string, number>();
  for (const camera of cameras) {
    counts.set(camera.citySlug, (counts.get(camera.citySlug) ?? 0) + 1);
  }

  return cities
    .filter((candidate) => candidate.slug !== city.slug)
    .map((candidate) => ({
      city: candidate,
      cameras: counts.get(candidate.slug) ?? 0,
      distanceKm: haversineKm(
        city.latitude,
        city.longitude,
        candidate.latitude,
        candidate.longitude,
      ),
    }))
    .filter((entry) => entry.cameras > 0)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/* ------------------------------------------------------------------ *
 * Bounds
 * ------------------------------------------------------------------ */

/** Smallest bounding box containing every camera, or `null` when empty. */
export function boundsFromCameras(cameras: CCTV[]): MapBounds | null {
  if (cameras.length === 0) return null;

  let north = -Infinity;
  let south = Infinity;
  let east = -Infinity;
  let west = Infinity;

  for (const camera of cameras) {
    north = Math.max(north, camera.latitude);
    south = Math.min(south, camera.latitude);
    east = Math.max(east, camera.longitude);
    west = Math.min(west, camera.longitude);
  }

  return { north, south, east, west };
}

/** Leaflet/MapLibre-style bounds tuple: [[south, west], [north, east]]. */
export function boundsToLatLngTuple(
  bounds: MapBounds,
): [[number, number], [number, number]] {
  return [
    [bounds.south, bounds.west],
    [bounds.north, bounds.east],
  ];
}

/** True when a coordinate falls inside the given box. */
export function isWithinBounds(
  latitude: number,
  longitude: number,
  bounds: MapBounds,
): boolean {
  return (
    latitude <= bounds.north &&
    latitude >= bounds.south &&
    longitude <= bounds.east &&
    longitude >= bounds.west
  );
}

export function filterByBounds(cameras: CCTV[], bounds: MapBounds): CCTV[] {
  return cameras.filter((camera) =>
    isWithinBounds(camera.latitude, camera.longitude, bounds),
  );
}

/** Centre point of a set of cameras, falling back to Indonesia's centre. */
export function centerFromCameras(cameras: CCTV[]): [number, number] {
  if (cameras.length === 0) return INDONESIA_CENTER;
  let lat = 0;
  let lng = 0;
  for (const camera of cameras) {
    lat += camera.latitude;
    lng += camera.longitude;
  }
  return [lat / cameras.length, lng / cameras.length];
}
