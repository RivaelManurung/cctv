import {
  Anchor,
  Building2,
  Camera,
  Landmark,
  Milestone,
  Mountain,
  Plane,
  Route,
  Ship,
  Split,
  TrafficCone,
  TreePalm,
  Trees,
  Video,
  Waves,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps the icon *names* stored in the data layer to lucide components.
 *
 * The data layer only ever stores strings, which keeps `src/data/*` free of
 * React imports and safely serialisable across the RSC boundary.
 */
const ICONS: Record<string, LucideIcon> = {
  TrafficCone,
  Route,
  Split,
  Milestone,
  Landmark,
  Anchor,
  Plane,
  Video,
  Mountain,
  Building2,
  Trees,
  Waves,
  TreePalm,
  Ship,
};

/** Resolves an icon name, falling back to a generic camera icon. */
export function getIcon(name: string | undefined): LucideIcon {
  if (!name) return Camera;
  return ICONS[name] ?? Camera;
}
