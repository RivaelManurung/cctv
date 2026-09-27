"use client";

import { ArrowRight, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Popup } from "react-leaflet";

import {
  CCTVStatusBadge,
  LiveBadge,
  SampleBadge,
  StreamTypeBadge,
} from "@/components/cctv/cctv-status";
import { getCategory } from "@/data/categories";
import { sanitizeExternalUrl } from "@/lib/utils";
import type { CCTV, StreamType } from "@/types/cctv";

/** Stream types that are actually embedded and therefore genuinely live. */
const LIVE_STREAM_TYPES: readonly StreamType[] = ["hls", "mjpeg"];

/**
 * Leaflet builds the popup chrome itself, so the wrapper is restyled from the
 * popup root with Tailwind arbitrary variants. This keeps every popup rule in
 * the component that owns it — `globals.css` is never touched — while still
 * matching the app's tokens in both light and dark mode.
 */
const POPUP_CLASSNAME = [
  "cctv-popup",
  "[&_.leaflet-popup-content-wrapper]:rounded-xl",
  "[&_.leaflet-popup-content-wrapper]:border",
  "[&_.leaflet-popup-content-wrapper]:border-border",
  "[&_.leaflet-popup-content-wrapper]:bg-popover",
  "[&_.leaflet-popup-content-wrapper]:p-0",
  "[&_.leaflet-popup-content-wrapper]:text-popover-foreground",
  "[&_.leaflet-popup-content-wrapper]:shadow-overlay",
  "[&_.leaflet-popup-content]:m-0",
  "[&_.leaflet-popup-content]:leading-normal",
  "[&_.leaflet-popup-tip]:bg-popover",
  "[&_.leaflet-popup-tip]:shadow-none",
].join(" ");

export interface CCTVPopupProps {
  camera: CCTV;
  onClose?: () => void;
}

/** Compact info card shown when a camera pin is selected on the map. */
export function CCTVPopup({ camera, onClose }: CCTVPopupProps) {
  const category = getCategory(camera.category);
  const isExternal = camera.streamType === "external";
  const isLive = LIVE_STREAM_TYPES.includes(camera.streamType);
  const sourceUrl = sanitizeExternalUrl(camera.sourceUrl);

  const position = useMemo<[number, number]>(
    () => [camera.latitude, camera.longitude],
    [camera.latitude, camera.longitude],
  );

  const eventHandlers = useMemo(
    () => ({ remove: () => onClose?.() }),
    [onClose],
  );

  return (
    <Popup
      position={position}
      className={POPUP_CLASSNAME}
      autoPan
      keepInView
      closeButton
      minWidth={244}
      maxWidth={300}
      eventHandlers={eventHandlers}
    >
      <div className="w-[244px] p-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {isLive ? (
            <LiveBadge />
          ) : (
            <CCTVStatusBadge status={camera.status} size="sm" />
          )}
          <StreamTypeBadge streamType={camera.streamType} size="sm" />
          {camera.isSample ? <SampleBadge /> : null}
        </div>

        <h3 className="mt-2 text-sm font-semibold leading-snug">
          {camera.name}
        </h3>

        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span className="truncate">
            {camera.city}, {camera.province}
          </span>
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
            {category?.labelId ?? camera.category}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            {camera.sourceName}
          </span>
        </div>

        {isExternal ? (
          <p className="mt-2.5 rounded-md border border-border bg-muted/50 px-2 py-1.5 text-[11px] leading-snug text-muted-foreground">
            Siaran tidak disematkan di sini. Buka halaman resmi operator untuk
            melihat kamera ini.
          </p>
        ) : null}

        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/cctv/${camera.slug}`}
            className="inline-flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Buka Kamera
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>

          {isExternal && sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-input px-3 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Sumber resmi
            </a>
          ) : null}
        </div>
      </div>
    </Popup>
  );
}
