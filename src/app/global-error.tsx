"use client";

import { useEffect } from "react";

/**
 * Last-resort error boundary.
 *
 * It replaces the root layout entirely, so the app shell (providers, context,
 * the global stylesheet and `next/link`) is unavailable here. Everything below
 * is therefore self-contained: plain HTML plus an inline stylesheet, so the
 * panel still looks intentional even when the app has failed to boot.
 */
const STYLES = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
      "Helvetica Neue", Arial, sans-serif;
  }
  .ge-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: #ffffff;
    color: #0f172a;
  }
  .ge-panel { max-width: 420px; text-align: center; }
  .ge-icon {
    width: 56px;
    height: 56px;
    margin: 0 auto;
    border-radius: 9999px;
    border: 1px solid #e2e8f0;
    display: grid;
    place-items: center;
    color: #64748b;
  }
  .ge-title { font-size: 20px; font-weight: 600; margin: 20px 0 0; }
  .ge-text {
    font-size: 14px;
    line-height: 1.6;
    color: #64748b;
    margin: 8px 0 0;
  }
  .ge-actions {
    margin-top: 24px;
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .ge-btn, .ge-link {
    font: inherit;
    font-size: 14px;
    font-weight: 500;
    border-radius: 8px;
    padding: 9px 16px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
  }
  .ge-btn { border: 1px solid transparent; background: #2563eb; color: #ffffff; }
  .ge-link { border: 1px solid #e2e8f0; color: #0f172a; background: transparent; }
  .ge-code {
    margin-top: 24px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 11px;
    color: #94a3b8;
  }
  @media (prefers-color-scheme: dark) {
    .ge-wrap { background: #070b14; color: #f8fafc; }
    .ge-icon { border-color: #1e293b; color: #94a3b8; }
    .ge-text { color: #94a3b8; }
    .ge-link { border-color: #1e293b; color: #f8fafc; }
    .ge-code { color: #64748b; }
  }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="id">
      <head>
        <style>{STYLES}</style>
      </head>
      <body>
        <div className="ge-wrap">
          <div className="ge-panel">
            <span className="ge-icon" aria-hidden="true">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </span>

            <h1 className="ge-title">Terjadi kesalahan</h1>
            <p className="ge-text">
              Sesuatu tidak berjalan seperti seharusnya. Coba muat ulang halaman
              ini.
            </p>

            <div className="ge-actions">
              <button
                type="button"
                className="ge-btn"
                onClick={() => reset()}
              >
                Coba lagi
              </button>
              {/*
                Deliberately a plain <a> rather than next/link: global-error
                replaces the root layout, so the Next router and its prefetch
                machinery may be unavailable here. A full document navigation
                is the only guaranteed way back to a working page.
              */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a className="ge-link" href="/">
                Kembali ke beranda
              </a>
            </div>

            {error.digest ? (
              <p className="ge-code">Kode kesalahan: {error.digest}</p>
            ) : null}
          </div>
        </div>
      </body>
    </html>
  );
}
