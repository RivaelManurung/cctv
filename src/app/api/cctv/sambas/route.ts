import { NextResponse } from "next/server";

const SAMBAS_API = "https://opendata.sambas.go.id/json/89";

export const revalidate = 300;

/**
 * Proxy untuk dataset CCTV lalu lintas resmi Kabupaten Sambas.
 * Endpoint sumber bersifat publik dan tidak memerlukan API key.
 */
export async function GET() {
  try {
    const response = await fetch(SAMBAS_API, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Sumber data CCTV Sambas sedang tidak tersedia." },
        { status: 502 },
      );
    }

    const data: unknown = await response.json();

    return NextResponse.json(
      {
        source: {
          name: "Open Data Kabupaten Sambas",
          url: SAMBAS_API,
          requiresApiKey: false,
        },
        data,
        fetchedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Gagal mengambil data CCTV Sambas." },
      { status: 502 },
    );
  }
}
