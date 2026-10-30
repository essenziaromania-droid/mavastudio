"use server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/events";
import { syncAllToDrive } from "@/lib/google-drive";
import { syncCalendar } from "@/lib/google-calendar";

const BACK = "/crm/setari?tab=integrari";

/** Deconectează Google Drive. Dosarele și fișierele deja copiate rămân în Drive. */
export async function disconnectGoogle() {
  const s = await getSession();
  if (!s.isAdmin) return;
  await createAdminClient().from("integrations").delete().eq("provider", "google");
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a deconectat Google Drive", entity: "setari", entity_id: "google" });
  redirect(`${BACK}&google_off=1`);
}

/** Creează dosarele lipsă și copiază în Drive fișierele încă nesincronizate (în tranșe). */
export async function runDriveSync() {
  const s = await getSession();
  if (!s.isAdmin) return;
  const r = await syncAllToDrive(25);
  redirect(`${BACK}&drive_sync=${r.clients}-${r.files}-${r.remaining}`);
}

/** Alege ce tipuri de elemente apar în Google Calendar. */
export async function saveCalendarTypes(fd: FormData) {
  const s = await getSession();
  if (!s.isAdmin) return;
  const sb = createAdminClient();
  const { data } = await sb.from("integrations").select("data").eq("provider", "google").maybeSingle();
  if (!data) redirect(BACK);
  const cal_types = { events: fd.get("events") === "on", tasks: fd.get("tasks") === "on", projects: fd.get("projects") === "on", social: fd.get("social") === "on" };
  await sb.from("integrations").update({ data: { ...data!.data, cal_types } }).eq("provider", "google");
  const r = await syncCalendar(100);
  redirect(`${BACK}&cal_sync=${r ? `${r.created}-${r.updated}-${r.deleted}-${r.pending}` : "0-0-0-0"}`);
}

/** Sincronizează acum Google Calendar. */
export async function runCalendarSync() {
  const s = await getSession();
  if (!s.isAdmin) return;
  const r = await syncCalendar(120);
  redirect(`${BACK}&cal_sync=${r ? `${r.created}-${r.updated}-${r.deleted}-${r.pending}` : "0-0-0-0"}`);
}
