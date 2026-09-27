import { ImageResponse } from "next/og";

import { getCategory } from "@/data/categories";
import { getCCTV } from "@/data/cctv";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import type { CameraStatus } from "@/types/cctv";

/**
 * Dynamic Open Graph card for a camera page.
 *
 * `ImageResponse` renders with Satori, which does not understand Tailwind —
 * every style below is inline and every multi-child node declares
 * `display: "flex"` explicitly, as Satori requires.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${SITE_NAME} — kamera CCTV publik Indonesia`;

const BACKGROUND = "#070b14";
const PANEL = "#111a2b";
const BORDER = "#233047";
const FOREGROUND = "#f8fafc";
const MUTED = "#94a3b8";
const SUBTLE = "#64748b";

const STATUS: Record<
  CameraStatus,
  { label: string; color: string; border: string; background: string }
> = {
  online: {
    label: "Online",
    color: "#34d399",
    border: "rgba(52, 211, 153, 0.35)",
    background: "rgba(52, 211, 153, 0.12)",
  },
  offline: {
    label: "Offline",
    color: "#f87171",
    border: "rgba(248, 113, 113, 0.35)",
    background: "rgba(248, 113, 113, 0.12)",
  },
  unknown: {
    label: "Tidak diketahui",
    color: "#fbbf24",
    border: "rgba(251, 191, 36, 0.35)",
    background: "rgba(251, 191, 36, 0.12)",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const camera = getCCTV(slug);
  const category = camera ? getCategory(camera.category) : undefined;

  const status = camera ? STATUS[camera.status] : null;
  const name = camera?.name ?? SITE_NAME;
  const location = camera
    ? `${camera.city}, ${camera.province}`
    : "Kamera publik di seluruh Indonesia";
  const categoryLabel = category?.labelId ?? (camera ? camera.category : "Kamera publik");
  const sourceName = camera?.sourceName ?? SITE_TAGLINE;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          padding: "64px 72px",
          backgroundColor: BACKGROUND,
          color: FOREGROUND,
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        {/* Wordmark + status */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: PANEL,
                border: `1px solid ${BORDER}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 22,
                  height: 22,
                  borderRadius: 999,
                  border: "3px solid #38bdf8",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.3 }}>
                {SITE_NAME}
              </span>
              <span style={{ fontSize: 15, color: MUTED }}>{SITE_TAGLINE}</span>
            </div>
          </div>

          {status ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: status.background,
                border: `1px solid ${status.border}`,
                color: status.color,
                fontSize: 19,
                fontWeight: 600,
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 11,
                  height: 11,
                  borderRadius: 999,
                  backgroundColor: status.color,
                }}
              />
              {status.label}
            </div>
          ) : null}
        </div>

        {/* Camera identity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: 22,
              color: SUBTLE,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            {categoryLabel}
          </span>
          <span
            style={{
              fontSize: 68,
              fontWeight: 700,
              lineHeight: 1.12,
              letterSpacing: -1.5,
            }}
          >
            {name}
          </span>
          <span style={{ fontSize: 32, color: MUTED }}>{location}</span>
        </div>

        {/* Attribution */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 26,
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <span style={{ fontSize: 21, color: MUTED }}>
            Sumber: {sourceName}
          </span>
          <span style={{ fontSize: 18, color: SUBTLE }}>
            Tautan ke portal resmi operator
          </span>
        </div>
      </div>
    ),
    size,
  );
}
