import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { waitUntil } from "@vercel/functions";
import { syncFileToDrive } from "@/lib/google-drive";

/**
 * Arhivarea automată a documentelor în modulul Fișiere (bucket privat „crm-files”).
 * Documentele generate de CRM ajung în folderul potrivit, la clientul și proiectul lor:
 *  - briefurile trimise prin formularul de pe site → 01 Brief (când lead-ul devine client)
 *  - contractele semnate de ambele părți → 02 Contract
 *  - facturile emise → 10 Facturi
 * Erorile nu opresc fluxul principal: arhivarea e un bonus, nu o condiție.
 */

const BUCKET = "crm-files";
const safeName = (n: string) => n.replace(/[^\w.\-]+/g, "_").slice(-100);

type Target = { client_id?: string | null; project_id?: string | null; folder: string; name: string };

async function alreadyArchived(sb: SupabaseClient, t: Target) {
  let q = sb.from("files").select("id").eq("folder", t.folder).eq("name", t.name).limit(1);
  q = t.client_id ? q.eq("client_id", t.client_id) : q.is("client_id", null);
  const { data } = await q;
  return !!data?.length;
}

/** Încarcă un fișier nou (PDF generat) și îl înregistrează în Fișiere. */
export async function archiveBuffer(sb: SupabaseClient, t: Target & { buf: Buffer; mime: string }) {
  try {
    if (await alreadyArchived(sb, t)) return;
    const path = `${t.client_id ?? "intern"}/${t.project_id ?? "general"}/${t.folder}/${Date.now()}_${safeName(t.name)}`;
    const { error } = await sb.storage.from(BUCKET).upload(path, t.buf, { contentType: t.mime, upsert: false });
    if (error) throw error;
    const { data: row } = await sb.from("files").insert({ client_id: t.client_id ?? null, project_id: t.project_id ?? null, folder: t.folder, name: t.name, path, mime: t.mime, size: t.buf.length }).select("id").single();
    if (row) waitUntil(syncFileToDrive(row.id));
  } catch (e) {
    console.error("[arhivă]", t.folder, t.name, e);
  }
}

/** Briefurile atașate de vizitatori pe site sunt deja în spațiul de stocare: le legăm de client în 01 Brief. */
export async function archiveLeadBrief(sb: SupabaseClient, leadId: string, clientId: string) {
  try {
    const { data: lead } = await sb.from("leads").select("attachment_path").eq("id", leadId).maybeSingle();
    const path = lead?.attachment_path as string | null | undefined;
    if (!path) return;
    const name = (path.split("/").pop() ?? "brief").replace(/^\d+_/, "");
    const t = { client_id: clientId, folder: "01 Brief", name };
    if (await alreadyArchived(sb, t)) return;
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    const mime = ext === "pdf" ? "application/pdf" : ["png", "jpg", "jpeg", "webp"].includes(ext) ? `image/${ext === "jpg" ? "jpeg" : ext}` : "application/octet-stream";
    const { data: row } = await sb.from("files").insert({ ...t, project_id: null, path, mime }).select("id").single();
    if (row) waitUntil(syncFileToDrive(row.id));
  } catch (e) {
    console.error("[arhivă] brief", e);
  }
}
