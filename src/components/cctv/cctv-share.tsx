"use client";

import { Check, Copy, MessageCircle, Send, Share2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { CCTV } from "@/types/cctv";

/** Small inline X (Twitter) glyph — lucide dropped the bird mark. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export interface CCTVShareProps {
  camera: CCTV;
  /** Custom trigger element. Defaults to a "Bagikan" button. */
  trigger?: ReactNode;
  className?: string;
}

/**
 * Share menu for a camera: copy link, native Web Share (when available) and
 * the usual social intents.
 *
 * The absolute URL is resolved in an effect, never during render, so the
 * server and the first client render produce identical markup.
 */
export function CCTVShare({ camera, trigger, className }: CCTVShareProps) {
  const { copied, copy } = useCopyToClipboard();
  const [shareUrl, setShareUrl] = useState("");
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    setShareUrl(absoluteUrl(`/cctv/${camera.slug}`));
  }, [camera.slug]);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  const shareText = `${camera.name} — ${camera.city}, ${camera.province} | ${SITE_NAME}`;

  const handleCopy = () => {
    if (!shareUrl) return;
    void copy(shareUrl, "Tautan kamera disalin");
  };

  const handleNativeShare = () => {
    if (!canNativeShare || !shareUrl) return;
    // Feature-detected inside the handler only — `navigator` never runs during
    // render, so there is no hydration risk.
    void navigator
      .share({ title: camera.name, text: shareText, url: shareUrl })
      .catch(() => {
        // The user dismissed the share sheet; nothing to report.
      });
  };

  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      icon: <MessageCircle className="h-4 w-4" aria-hidden="true" />,
    },
    {
      key: "x",
      label: "X",
      href: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      icon: <XIcon className="h-4 w-4" />,
    },
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      icon: <Send className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger ?? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            aria-label={`Bagikan ${camera.name}`}
          >
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Bagikan
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className={cn("w-56", className)}>
        <DropdownMenuLabel>Bagikan kamera</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={(event) => {
            // Keep the menu open so the "copied" tick is actually visible.
            event.preventDefault();
            handleCopy();
          }}
        >
          {copied ? (
            <Check className="h-4 w-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="h-4 w-4" aria-hidden="true" />
          )}
          Salin tautan
        </DropdownMenuItem>

        {canNativeShare ? (
          <DropdownMenuItem onSelect={handleNativeShare}>
            <Share2 className="h-4 w-4" aria-hidden="true" />
            Bagikan…
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        {socialLinks.map((link) => (
          <DropdownMenuItem key={link.key} asChild>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Bagikan ke ${link.label}`}
            >
              {link.icon}
              {link.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
