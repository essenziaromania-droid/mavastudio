"use server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit } from "@/lib/events";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE } from "@/content/site";
import { formatTimecode } from "@/lib/timecode";

const portalUrl = (token: string, path = "") => `${SITE.url}/portal/${token}${path}`;
const validEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

/** Trimite clientului linkul personal către portal. */
export async function sendPortalLink(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const to = String(fd.get("to") ?? "").trim().toLowerCase();
  const back = (q: string) => redirect(`/crm/clienti/${id}?${q}`);
  if (!validEmail(to)) back(`portal_err=${encodeURIComponent("Adresa de email nu este validă.")}`);
  const { data: c } = await s.sb.from("clients").select("id, name, contact_name, portal_token").eq("id", id).single();
  if (!c) back("");
  const r = await sendEmail({
    to,
    replyTo: ADMIN_EMAIL,
    subject: `Portalul tău de client – MAVA Studio`,
    html: brandedEmail({
      title: `Bun venit în portalul MAVA Studio${c!.contact_name ? `, ${escapeHtml(c!.contact_name.split(" ")[0]!)}` : ""}!`,
      bodyHtml: `<p>Am pregătit pentru <b>${escapeHtml(c!.name)}</b> un portal în care găsești, într-un singur loc:</p>
        <ul><li>stadiul proiectelor și etapele lor;</li><li>materialele de aprobat (design-uri, video-uri, livrabile), cu posibilitatea de a lăsa comentarii;</li><li>contractele, ofertele și facturile.</li></ul>
        <p>Linkul este personal: te rugăm să nu îl distribui altor persoane. Îl poți salva în favorite.</p>
        <p>Cu drag,<br/>${escapeHtml(s.profile.full_name ?? "Echipa MAVA Studio")}<br/>MAVA Studio</p>`,
      cta: { label: "Deschide portalul", url: portalUrl(c!.portal_token) },
    }),
  });
  if (!r.ok) back(`portal_err=${encodeURIComponent("Emailul nu a putut fi trimis: " + r.error)}`);
  await addActivity(s.sb, { client_id: id, type: "nota", title: "Link portal client trimis", description: `către ${to}`, actor_id: s.userId });
  back(`portal_sent=${encodeURIComponent(to)}`);
}

/** Generează un link nou de portal; cel vechi nu mai funcționează. */
export async function regeneratePortalLink(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("clients").update({ portal_token: randomUUID() }).eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a regenerat linkul de portal al clientului", entity: "client", entity_id: id });
  redirect(`/crm/clienti/${id}?portal_new=1`);
}

/** Arată sau ascunde un fișier în portalul clientului. */
export async function toggleFileVisibility(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const visible = fd.get("visible") === "1";
  await s.sb.from("files").update({ visible_to_client: visible }).eq("id", id);
  revalidatePath("/crm", "layout");
}

/** Trimite un material clientului spre aprobare: îl face vizibil, resetează decizia și îl anunță pe email. */
export async function requestApproval(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const back = (q: string) => redirect(`/crm/fisiere/${id}?${q}`);
  const { data: f } = await s.sb.from("files").select("id, name, client_id, project_id, clients(name, contact_name, email, contact_email, portal_token)").eq("id", id).single();
  const c = f?.clients as unknown as { name: string; contact_name: string | null; email: string | null; contact_email: string | null; portal_token: string } | null;
  if (!f || !c) back(`err=${encodeURIComponent("Fișierul nu este asociat unui client.")}`);
  await s.sb.from("files").update({ visible_to_client: true, review_status: "in_asteptare", review_note: null, reviewed_at: null }).eq("id", id);
  const to = c!.contact_email || c!.email;
  if (to) {
    await sendEmail({
      to,
      replyTo: ADMIN_EMAIL,
      subject: `Material nou de aprobat: ${f!.name}`,
      html: brandedEmail({
        title: "Ai un material nou de aprobat",
        bodyHtml: `<p>Bună ziua${c!.contact_name ? `, ${escapeHtml(c!.contact_name.split(" ")[0]!)}` : ""},</p><p>Am pregătit <b>${escapeHtml(f!.name)}</b>. Îl poți vedea în portal, unde îl poți aproba sau ne poți spune ce ai vrea să schimbăm.</p><p>Cu drag,<br/>Echipa MAVA Studio</p>`,
        cta: { label: "Vezi materialul", url: portalUrl(c!.portal_token, `/fisier/${id}`) },
      }),
    });
  }
  await addActivity(s.sb, { client_id: f!.client_id, project_id: f!.project_id, type: "nota", title: `Trimis spre aprobare: ${f!.name}`, actor_id: s.userId });
  back(to ? "sent=1" : `err=${encodeURIComponent("Materialul e vizibil în portal, dar clientul nu are email salvat, așa că nu a fost anunțat.")}`);
}

/** Comentariul echipei pe un fișier; clientul primește un email dacă fișierul îi este vizibil. */
export async function teamFileComment(_: { ok?: boolean; error?: string }, fd: FormData): Promise<{ ok?: boolean; error?: string }> {
  const s = await getSession();
  const id = String(fd.get("file_id"));
  const body = String(fd.get("body") ?? "").trim().slice(0, 2000);
  if (body.length < 2) return { error: "Scrie comentariul." };
  const t = Number(fd.get("timecode"));
  const timecode = String(fd.get("timecode") ?? "") !== "" && Number.isFinite(t) ? Math.round(t * 100) / 100 : null;
  const { error } = await s.sb.from("file_comments").insert({ file_id: id, author_type: "echipa", author_id: s.userId, author_name: s.profile.full_name, body, timecode });
  if (error) return { error: error.message.includes("file_comments") ? "Rulează migrarea 0005_client_portal.sql în Supabase." : error.message };

  const { data: f } = await createAdminClient().from("files").select("name, folder, visible_to_client, clients(contact_name, email, contact_email, portal_token)").eq("id", id).single();
  const c = f?.clients as unknown as { contact_name: string | null; email: string | null; contact_email: string | null; portal_token: string } | null;
  const visible = f && (f.visible_to_client || ["02 Contract", "09 Livrabile", "10 Facturi"].includes(f.folder));
  const to = c?.contact_email || c?.email;
  if (visible && to) {
    await sendEmail({
      to,
      replyTo: ADMIN_EMAIL,
      subject: `Răspuns nou la ${f!.name}`,
      html: brandedEmail({
        title: "Ai un răspuns nou de la MAVA Studio",
        bodyHtml: `<p><b>${escapeHtml(f!.name)}</b>${timecode != null ? ` · la ${formatTimecode(timecode)}` : ""}</p><p style="white-space:pre-line;background:#F6F7FE;border-radius:12px;padding:14px">${escapeHtml(body)}</p>`,
        cta: { label: "Vezi în portal", url: portalUrl(c!.portal_token, `/fisier/${id}`) },
      }),
    });
  }
  revalidatePath(`/crm/fisiere/${id}`);
  return { ok: true };
}

/** Marchează toate comentariile clientului pe un fișier ca rezolvate. */
export async function resolveFileComments(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("file_comments").update({ resolved: true }).eq("file_id", id).eq("author_type", "client");
  revalidatePath(`/crm/fisiere/${id}`);
}
