"use client";

import { memo } from "react";

import { CCTVCard } from "@/components/cctv/cctv-card";
import { cn } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

/**
 * Responsive camera grid.
 *
 * `priorityCount` lets the host page mark the first row as above-the-fold so
 * only those images load eagerly.
 */
export const CCTVGrid = memo(function CCTVGrid({
  cameras,
  className,
  priorityCount = 0,
}: {
  cameras: CCTV[];
  className?: string;
  priorityCount?: number;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {cameras.map((camera, index) => (
        <CCTVCard
          key={camera.id}
          camera={camera}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
});
