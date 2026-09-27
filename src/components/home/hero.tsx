"use client";

import { ArrowRight, Map as MapIcon, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * The hero is a client module because it exports the interactive
 * {@link HeroSearch} (local state + `router.push`) and the brief scopes both
 * components to this single file. It deliberately imports NO dataset, so the
 * client bundle stays tiny — every figure on the homepage is rendered by
 * server sections elsewhere.
 */

/* ------------------------------------------------------------------ *
 * Decorative archipelago
 *
 * A hand-drawn, abstract silhouette — NOT a real map. Real Indonesian
 * coordinates are projected into the SVG viewBox so the pulsing "camera"
 * dots sit roughly where the cities are. Fully aria-hidden.
 * ------------------------------------------------------------------ */

const VIEW_W = 800;
const VIEW_H = 400;

// Bounding box of the Indonesian archipelago.
const LNG_MIN = 95;
const LNG_MAX = 141;
const LAT_MAX = 6;
const LAT_MIN = -11;

function project(lat: number, lng: number): { x: number; y: number } {
  return {
    x: ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * VIEW_W,
    y: ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * VIEW_H,
  };
}

/** Real coordinates of cities that publish public cameras in this dataset. */
const CAMERA_POINTS: { name: string; lat: number; lng: number }[] = [
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Palembang", lat: -2.9761, lng: 104.7754 },
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Pontianak", lat: -0.0263, lng: 109.3425 },
  { name: "Balikpapan", lat: -1.2379, lng: 116.8529 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Manado", lat: 1.4748, lng: 124.8421 },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { name: "Kupang", lat: -10.1772, lng: 123.607 },
  { name: "Ambon", lat: -3.6954, lng: 128.1814 },
  { name: "Jayapura", lat: -2.5337, lng: 140.7181 },
];

/** Abstract blobs, positioned to loosely mirror Sumatera→Papua. */
const ARCHIPELAGO_PATHS: string[] = [
  // Sumatera — long north-west diagonal.
  "M8 12 C32 6 58 40 78 72 C104 112 124 152 154 192 C176 224 194 256 208 288 C214 304 202 308 190 296 C160 266 130 226 104 186 C78 146 54 100 28 58 C16 38 0 20 8 12 Z",
  // Kalimantan — large central mass.
  "M250 150 C240 110 262 84 302 79 C342 74 382 90 396 120 C406 146 400 176 384 196 C368 216 338 226 308 220 C278 214 254 194 247 174 C243 164 247 158 250 150 Z",
  // Jawa — thin, horizontal.
  "M205 288 C230 281 262 285 292 295 C312 302 332 310 346 320 C352 325 346 331 336 327 C311 316 281 308 251 302 C231 298 211 298 202 296 C197 295 199 291 205 288 Z",
  // Bali & Nusa Tenggara — small scattered islands.
  "M352 344 C362 339 373 341 377 348 C379 353 372 357 364 355 C355 352 349 348 352 344 Z",
  "M386 350 C399 345 413 349 416 357 C418 363 408 367 396 363 C388 360 382 354 386 350 Z",
  "M470 372 C486 365 501 371 504 380 C506 387 494 391 480 386 C471 383 465 376 470 372 Z",
  // Sulawesi — the K-shaped island.
  "M430 250 C425 230 436 210 456 200 C471 192 481 174 479 154 C477 134 486 114 501 104 C516 96 529 107 523 124 C517 144 506 159 501 174 C499 184 506 194 516 204 C529 217 531 234 519 244 C506 255 489 249 481 237 C473 225 469 219 459 221 C446 225 437 239 430 250 Z",
  // Maluku — two small clumps.
  "M560 220 C555 200 566 180 586 172 C601 166 616 175 613 192 C610 208 599 220 589 232 C579 244 567 240 563 232 C561 228 560 224 560 220 Z",
  "M625 165 C632 157 643 161 644 171 C645 180 636 186 628 181 C622 177 621 169 625 165 Z",
  // Papua — large eastern mass.
  "M640 150 C660 129 700 119 740 127 C770 133 795 149 800 174 C805 200 790 225 765 240 C740 254 705 258 680 248 C655 238 640 215 635 190 C632 175 634 160 640 150 Z",
];

const QUICK_SEARCHES = ["Jakarta", "Bandung", "Ahmad Yani", "Tol", "Pelabuhan"];

function ArchipelagoVisual({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative aspect-[2/1] w-full select-none", className)}
    >
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full text-primary/10"
        role="presentation"
      >
        {ARCHIPELAGO_PATHS.map((d, index) => (
          <path key={index} d={d} fill="currentColor" />
        ))}
      </svg>

      {/* Camera dots — projected from real coordinates. */}
      {CAMERA_POINTS.map((point, index) => {
        const { x, y } = project(point.lat, point.lng);
        return (
          <span
            key={point.name}
            className="absolute grid h-3 w-3 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{
              left: `${(x / VIEW_W) * 100}%`,
              top: `${(y / VIEW_H) * 100}%`,
            }}
          >
            <span
              className="absolute h-3 w-3 animate-pulse-ring rounded-full bg-primary/30"
              style={{ animationDelay: `${(index % 5) * 0.4}s` }}
            />
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-subtle" />
          </span>
        );
      })}
    </div>
  );
}

export interface HeroSearchProps {
  className?: string;
  /** Placeholder copy for the field. */
  placeholder?: string;
  /** Quick-search chip labels, rendered as links to `/cctv?q=`. */
  suggestions?: readonly string[];
}

/**
 * Prominent search field. Commits only on submit (Enter or the button) and
 * navigates to `/cctv?q=…`; no debounce is needed.
 */
export function HeroSearch({
  className,
  placeholder = "Cari kota, jalan, atau nama kamera…",
  suggestions = QUICK_SEARCHES,
}: HeroSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = query.trim();
    router.push(term ? `/cctv?q=${encodeURIComponent(term)}` : "/cctv");
  }

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <form
        role="search"
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 shadow-subtle transition-[box-shadow,border-color] focus-within:border-primary/40 focus-within:shadow-elevated"
      >
        <Search
          className="ml-2.5 h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label="Cari kamera CCTV"
          autoComplete="off"
          className="h-10 flex-1 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
        />
        <Button type="submit" className="h-10 shrink-0 px-5">
          Cari
        </Button>
      </form>

      {suggestions.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Populer:</span>
          {suggestions.map((term) => (
            <Link
              key={term}
              href={`/cctv?q=${encodeURIComponent(term)}`}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {term}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface HeroProps {
  className?: string;
}

/** The homepage hero: headline, search and primary calls to action. */
export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-background",
        className,
      )}
    >
      {/* Ambient background — purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle,hsl(var(--border))_1px,transparent_1px)] [background-size:28px_28px] [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
        <div className="absolute -left-24 -top-32 h-80 w-80 animate-pulse rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-accent/70 blur-3xl" />
      </div>

      <div className="container relative py-14 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-subtle">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Kamera publik dari instansi resmi
            </span>

            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
                CCTV Indonesia
              </span>
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              Pantau kamera publik dan kondisi lalu lintas di berbagai wilayah
              Indonesia.
            </p>

            <HeroSearch className="mt-8" />

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="gap-2">
                <Link href="/cctv">
                  Jelajahi CCTV
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/map">
                  <MapIcon className="h-4 w-4" aria-hidden="true" />
                  Lihat Peta
                </Link>
              </Button>
            </div>
          </div>

          <ArchipelagoVisual className="animate-fade-in" />
        </div>
      </div>
    </section>
  );
}
