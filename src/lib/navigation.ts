import {
  Building2,
  Camera,
  Globe,
  Heart,
  Home,
  Info,
  Map,
  ScrollText,
  Search,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Short description used in the mobile "Lainnya" sheet. */
  description?: string;
}

/** Primary desktop navigation. */
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/cctv", label: "CCTV", icon: Camera },
  { href: "/map", label: "Peta", icon: Map },
  { href: "/cities", label: "Kota", icon: Building2 },
  { href: "/sources", label: "Sumber", icon: Globe },
];

/** Mobile bottom tab bar. */
export const MOBILE_TABS: NavLink[] = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/cctv", label: "Jelajahi", icon: Search },
  { href: "/map", label: "Peta", icon: Map },
  { href: "/favorites", label: "Favorit", icon: Heart },
];

/** Everything else, surfaced in the mobile "Lainnya" sheet. */
export const MOBILE_MORE_LINKS: NavLink[] = [
  {
    href: "/cities",
    label: "Kota",
    icon: Building2,
    description: "Telusuri CCTV berdasarkan kota",
  },
  {
    href: "/sources",
    label: "Sumber Resmi",
    icon: Globe,
    description: "Operator dan instansi penyedia kamera",
  },
  {
    href: "/about",
    label: "Tentang",
    icon: Info,
    description: "Tentang platform dan cara kerja data",
  },
  {
    href: "/terms",
    label: "Ketentuan",
    icon: ScrollText,
    description: "Ketentuan penggunaan dan privasi",
  },
];

export const FOOTER_EXPLORE: NavLink[] = [
  { href: "/cctv", label: "CCTV", icon: Camera },
  { href: "/map", label: "Peta", icon: Map },
  { href: "/cities", label: "Kota", icon: Building2 },
];

export const FOOTER_INFORMATION: NavLink[] = [
  { href: "/about", label: "Tentang", icon: Info },
  { href: "/terms", label: "Ketentuan", icon: ScrollText },
  { href: "/sources", label: "Sumber", icon: Globe },
];
