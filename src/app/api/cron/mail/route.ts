import { NextResponse, type NextRequest } from "next/server";
import { syncMailbox } from "@/lib/mailbox";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

/**
 * Verifică emailurile noi. Rulată zilnic de Vercel Cron; poate fi apelată mai des
 * dintr-un serviciu extern (ex. cron-job.org) cu antetul Authorization: Bearer CRON_SECRET.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get("authorization") !== `Bearer ${secret}`) return new NextResponse("Unauthorized", { status: 401 });
  const r = await syncMailbox({ max: 150 });
  return NextResponse.json({ ok: true, result: r });
}
