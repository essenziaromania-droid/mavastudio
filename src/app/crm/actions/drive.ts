"use server";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/events";
import { syncAllToDrive } from "@/lib/google-drive";

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
