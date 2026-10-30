"use server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { addActivity, notify } from "@/lib/events";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { SITE } from "@/content/site";
import { clientByToken, portalFile, reviewable } from "@/lib/portal";
import { formatTimecode } from "@/lib/timecode";
import { scheduleCalendarSync } from "@/lib/google-calendar";

export type PortalState = { ok?: boolean; error?: string };

const crm = (path: string) => `${process.env.NEXT_PUBLIC_CRM_URL ?? SITE.url + "/crm"}${path}`;
const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max);

/** Anunță echipa: notificare în CRM, intrare în istoricul clientului și email. */
async function alertTeam(p: { clientId: string; clientName: string; projectId?: string | null; title: string; body: string; link: string }) {
  const sb = createAdminClient();
  await addActivity(sb, { client_id: p.clientId, project_id: p.projectId ?? null, type: "nota", title: p.title, description: p.body.slice(0, 300) });
  await notify(sb, { type: "client", title: p.title, body: p.clientName, link: p.link });
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: `💬 ${p.title}`,
    html: brandedEmail({ title: p.title, bodyHtml: `<p><b>${escapeHtml(p.clientName)}</b></p><p style="white-space:pre-line;background:#F6F7FE;border-radius:12px;padding:14px">${escapeHtml(p.body)}</p>`, cta: { label: "Deschide în CRM", url: crm(p.link.replace(/^\/crm/, "")) } }),
  });
}

/** Comentariu al clientului pe un fișier (la video, legat de secunda din clip). */
export async function portalComment(_: PortalState, fd: FormData): Promise<PortalState> {
  const token = clean(fd.get("token"), 40);
  const client = await clientByToken(token);
  if (!client) return { error: "Link invalid." };
  const file = await portalFile(client.id, clean(fd.get("file_id"), 40));
  if (!file) return { error: "Fișierul nu a fost găsit." };
  const body = clean(fd.get("body"), 2000);
  if (body.length < 2) return { error: "Scrie comentariul." };
  const t = Number(fd.get("timecode"));
  const timecode = Number.isFinite(t) && t >= 0 && String(fd.get("timecode") ?? "") !== "" ? Math.round(t * 100) / 100 : null;
  const name = clean(fd.get("name"), 80) || client.contact_name || client.name;

  const sb = createAdminClient();
  const { error } = await sb.from("file_comments").insert({ file_id: file.id, author_type: "client", author_name: name, body, timecode });
  if (error) return { error: "Comentariul nu a putut fi salvat." };
  await alertTeam({
    clientId: client.id,
    clientName: client.name,
    projectId: file.project_id,
    title: `Comentariu nou pe ${file.name}${timecode != null ? ` (la ${formatTimecode(timecode)})` : ""}`,
    body: `${name}: ${body}`,
    link: `/crm/fisiere/${file.id}`,
  });
  revalidatePath(`/portal/${token}/fisier/${file.id}`);
  return { ok: true };
}

/** Clientul aprobă un material sau cere modificări. La modificări se creează automat un task. */
export async function portalReview(_: PortalState, fd: FormData): Promise<PortalState> {
  const token = clean(fd.get("token"), 40);
  const client = await clientByToken(token);
  scheduleCalendarSync();
  if (!client) return { error: "Link invalid." };
  const file = await portalFile(client.id, clean(fd.get("file_id"), 40));
  if (!file || !reviewable(file.folder)) return { error: "Fișierul nu a fost găsit." };
  const decision = fd.get("decision") === "aprobat" ? "aprobat" : "modificari";
  const note = clean(fd.get("note"), 2000);
  if (decision === "modificari" && note.length < 3) return { error: "Descrie pe scurt ce modificări dorești." };

  const sb = createAdminClient();
  await sb.from("files").update({ review_status: decision, review_note: note || null, reviewed_at: new Date().toISOString() }).eq("id", file.id);
  if (note) await sb.from("file_comments").insert({ file_id: file.id, author_type: "client", author_name: client.contact_name || client.name, body: (decision === "aprobat" ? "✅ Aprobat: " : "✏️ Modificări cerute: ") + note });
  if (decision === "modificari") {
    await sb.from("tasks").insert({
      project_id: file.project_id,
      client_id: client.id,
      title: `Modificări cerute de client: ${file.name}`,
      description: note,
      priority: "ridicata",
      deadline: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10),
    });
  }
  await alertTeam({
    clientId: client.id,
    clientName: client.name,
    projectId: file.project_id,
    title: decision === "aprobat" ? `✅ Aprobat de client: ${file.name}` : `✏️ Modificări cerute: ${file.name}`,
    body: note || "Materialul a fost aprobat.",
    link: `/crm/fisiere/${file.id}`,
  });
  revalidatePath(`/portal/${token}`);
  revalidatePath(`/portal/${token}/fisier/${file.id}`);
  return { ok: true };
}

/** Mesaj liber de la client către echipă. */
export async function portalMessage(_: PortalState, fd: FormData): Promise<PortalState> {
  const token = clean(fd.get("token"), 40);
  const client = await clientByToken(token);
  if (!client) return { error: "Link invalid." };
  const body = clean(fd.get("body"), 3000);
  if (body.length < 3) return { error: "Scrie mesajul." };
  await alertTeam({ clientId: client.id, clientName: client.name, title: `Mesaj nou din portal de la ${client.name}`, body, link: `/crm/clienti/${client.id}?tab=activitate` });
  return { ok: true };
}

/* ───────── Social media ───────── */

const REVIEWABLE_POSTS = ["de_aprobat", "modificari", "aprobat"];

/** Clientul aprobă o postare sau cere modificări. */
export async function portalPostReview(_: PortalState, fd: FormData): Promise<PortalState> {
  const token = clean(fd.get("token"), 40);
  const client = await clientByToken(token);
  scheduleCalendarSync();
  if (!client) return { error: "Link invalid." };
  const id = clean(fd.get("post_id"), 40);
  const decision = fd.get("decision") === "aprobat" ? "aprobat" : "modificari";
  const note = clean(fd.get("note"), 2000);
  if (decision === "modificari" && note.length < 3) return { error: "Descrie pe scurt ce ai vrea să schimbăm." };
  const sb = createAdminClient();
  const { data: post } = await sb.from("social_posts").select("id, status, scheduled_at, title, format").eq("id", id).eq("client_id", client.id).maybeSingle();
  if (!post || !REVIEWABLE_POSTS.includes(post.status)) return { error: "Postarea nu mai poate fi modificată." };
  await sb.from("social_posts").update({ status: decision, client_note: note || null, reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() }).eq("id", id);
  const when = new Intl.DateTimeFormat("ro-RO", { timeZone: "Europe/Bucharest", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(post.scheduled_at));
  await alertTeam({
    clientId: client.id,
    clientName: client.name,
    title: decision === "aprobat" ? `✅ Postare aprobată (${when})` : `✏️ Modificări cerute la postarea din ${when}`,
    body: note || "Postarea a fost aprobată.",
    link: `/crm/social/${id}`,
  });
  revalidatePath(`/portal/${token}`);
  return { ok: true };
}

/** Clientul aprobă dintr-un clic toate postările lunii care îi așteaptă aprobarea. */
export async function portalApproveMonth(_: PortalState, fd: FormData): Promise<PortalState> {
  const token = clean(fd.get("token"), 40);
  const client = await clientByToken(token);
  scheduleCalendarSync();
  if (!client) return { error: "Link invalid." };
  const ids = clean(fd.get("ids"), 4000).split(",").filter((x) => /^[0-9a-f-]{36}$/i.test(x));
  if (!ids.length) return { error: "Nu există postări de aprobat." };
  const sb = createAdminClient();
  const { data } = await sb
    .from("social_posts")
    .update({ status: "aprobat", reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .in("id", ids)
    .eq("client_id", client.id)
    .eq("status", "de_aprobat")
    .select("id");
  await alertTeam({ clientId: client.id, clientName: client.name, title: `✅ ${data?.length ?? 0} postări aprobate de ${client.name}`, body: "Clientul a aprobat toate postările lunii din portal.", link: `/crm/social?client=${client.id}` });
  revalidatePath(`/portal/${token}`);
  return { ok: true };
}
