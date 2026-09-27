import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "CCTV ID",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    // Matches the design tokens: --background is hsl(0 0% 100%) in light mode
    // and hsl(222 47% 5%) in dark mode.
    background_color: "#ffffff",
    theme_color: "#0b1220",
    orientation: "portrait-primary",
    lang: "id",
    dir: "ltr",
    categories: ["travel", "navigation", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Jelajahi CCTV",
        short_name: "Jelajahi",
        url: "/cctv",
      },
      {
        name: "Peta CCTV",
        short_name: "Peta",
        url: "/map",
      },
    ],
  };
}
