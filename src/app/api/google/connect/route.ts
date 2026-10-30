import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/crm/auth";
import { googleAuthUrl, googleConfigured } from "@/lib/google-drive";
import { SITE } from "@/content/site";

export const runtime = "nodejs";

/** Pornește conectarea Google Drive (doar administratorul). */
export async function GET() {
  const s = await getSession();
  if (!s.isAdmin) return NextResponse.redirect(`${SITE.url}/crm/setari?tab=integrari&google_err=${encodeURIComponent("Doar administratorul poate conecta Google Drive.")}`);
  if (!googleConfigured()) return NextResponse.redirect(`${SITE.url}/crm/setari?tab=integrari&google_err=${encodeURIComponent("Lipsesc GOOGLE_CLIENT_ID și GOOGLE_CLIENT_SECRET în Vercel.")}`);
  const state = randomUUID();
  const res = NextResponse.redirect(googleAuthUrl(state));
  res.cookies.set("g_oauth_state", state, { httpOnly: true, secure: true, sameSite: "lax", maxAge: 600, path: "/" });
  return res;
}
