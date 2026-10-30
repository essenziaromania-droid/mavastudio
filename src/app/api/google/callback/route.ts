import { NextResponse, type NextRequest } from "next/server";
import { getSession } from "@/lib/crm/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/events";
import { createRootFolders, exchangeCode, getDriveConnection } from "@/lib/google-drive";
import { CALENDAR_SCOPE, scheduleCalendarSync } from "@/lib/google-calendar";
import { SITE } from "@/content/site";

export const runtime = "nodejs";

/** Google se întoarce aici după ce administratorul acceptă accesul. */
export async function GET(req: NextRequest) {
  const back = (q: string) => {
    const res = NextResponse.redirect(`${SITE.url}/crm/setari?tab=integrari&${q}`);
    res.cookies.delete("g_oauth_state");
    return res;
  };
  const s = await getSession();
  if (!s.isAdmin) return back(`google_err=${encodeURIComponent("Doar administratorul poate conecta Google Drive.")}`);
  const p = req.nextUrl.searchParams;
  if (p.get("error")) return back(`google_err=${encodeURIComponent("Conectarea a fost anulată.")}`);
  if (!p.get("state") || p.get("state") !== req.cookies.get("g_oauth_state")?.value) return back(`google_err=${encodeURIComponent("Sesiune expirată. Încearcă din nou.")}`);
  try {
    const t = await exchangeCode(p.get("code") ?? "");
    // Dacă dosarele principale există deja (reconectare), le păstrăm.
    const prev = await getDriveConnection();
    const folders = prev?.data.root_id ? prev.data : await createRootFolders(t.access_token);
    const data = { ...prev?.data, ...folders, scopes: t.scope };
    const { error } = await createAdminClient()
      .from("integrations")
      .upsert({ provider: "google", account_email: t.email, refresh_token: t.refresh_token, data, connected_at: new Date().toISOString() });
    if (error) throw new Error(error.message.includes("integrations") ? "Rulează migrarea 0007_google_drive.sql în Supabase." : error.message);
    await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a conectat Google Drive (${t.email ?? "cont Google"})`, entity: "setari", entity_id: "google" });
    // Prima sincronizare a calendarului, în fundal.
    if (t.scope.includes(CALENDAR_SCOPE)) scheduleCalendarSync();
    return back("google_ok=1");
  } catch (e) {
    return back(`google_err=${encodeURIComponent(e instanceof Error ? e.message : "Conectarea a eșuat.")}`);
  }
}
