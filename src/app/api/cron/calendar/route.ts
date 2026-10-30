import { NextResponse, type NextRequest } from "next/server";
import { syncCalendar } from "@/lib/google-calendar";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/** Rulată zilnic de Vercel Cron: aduce Google Calendar la zi (ce a scăpat sincronizării automate). */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Unauthorized", { status: 401 });
  const r = await syncCalendar(200);
  return NextResponse.json({ ok: true, result: r });
}
