"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { createAdminClient } from "@/lib/supabase/server";
import { audit } from "@/lib/events";
import { brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { getMailConnection, syncMailbox, testImap } from "@/lib/mailbox";

const BACK = "/crm/setari?tab=integrari";

/** Salvează conexiunea la căsuța de email (verifică întâi datele). */
export async function saveImapSettings(fd: FormData) {
  const s = await getSession();
  if (!s.isAdmin) return;
  const prev = await getMailConnection();
  const config = {
    host: String(fd.get("host") ?? "").trim() || "glc44.hostico.ro",
    port: Number(fd.get("port") || 993),
    user: String(fd.get("user") ?? "").trim().toLowerCase(),
    // Parola nu se afișează niciodată; câmp gol = păstrează parola salvată.
    password: String(fd.get("password") ?? "") || prev?.config.password || "",
  };
  if (!config.user || !config.password) redirect(`${BACK}&mail_err=${encodeURIComponent("Completează adresa de email și parola.")}`);
  const t = await testImap(config);
  if (!t.ok) redirect(`${BACK}&mail_err=${encodeURIComponent(t.error)}`);
  const { error } = await createAdminClient()
    .from("integrations")
    .upsert({ provider: "imap", account_email: config.user, data: { config, folders: prev?.config.user === config.user ? prev.folders : {}, last_sync: null }, connected_at: new Date().toISOString() });
  if (error) redirect(`${BACK}&mail_err=${encodeURIComponent(error.message)}`);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a conectat căsuța de email ${config.user}`, entity: "setari", entity_id: "imap" });
  const r = await syncMailbox({ max: 120, sinceDays: 30 });
  redirect(`${BACK}&mail_ok=${r?.saved ?? 0}`);
}

export async function disconnectImap() {
  const s = await getSession();
  if (!s.isAdmin) return;
  await createAdminClient().from("integrations").delete().eq("provider", "imap");
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a deconectat căsuța de email", entity: "setari", entity_id: "imap" });
  redirect(`${BACK}&mail_off=1`);
}

/** Verifică acum emailurile noi. */
export async function runMailSync(fd: FormData) {
  const s = await getSession();
  if (!s.can("mesaje")) return;
  const r = await syncMailbox({ max: 150 });
  const back = String(fd.get("back") ?? "/crm/mesaje");
  redirect(`${back}${back.includes("?") ? "&" : "?"}synced=${r?.saved ?? 0}${r?.error ? `&err=${encodeURIComponent("Căsuța de email nu a răspuns: " + r.error)}` : ""}`);
}

/** Răspuns către client, trimis din CRM (de pe adresa firmei, cu răspunsurile înapoi în aceeași căsuță). */
export async function replyToClient(fd: FormData) {
  const s = await getSession();
  if (!s.can("mesaje")) return;
  const back = String(fd.get("back") ?? "/crm/mesaje");
  const to = String(fd.get("to") ?? "").trim().toLowerCase();
  const subject = String(fd.get("subject") ?? "").trim().slice(0, 200) || "Mesaj de la MAVA Studio";
  const body = String(fd.get("body") ?? "").trim().slice(0, 10000);
  const inReplyTo = String(fd.get("in_reply_to") ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || body.length < 2) redirect(`${back}${back.includes("?") ? "&" : "?"}err=${encodeURIComponent("Completează destinatarul și mesajul.")}`);
  const conn = await getMailConnection();
  const replyTo = conn?.config.user || undefined;
  const html = brandedEmail({ title: subject, bodyHtml: `<p style="white-space:pre-line">${escapeHtml(body)}</p><p>${escapeHtml(s.profile.full_name ?? "")}<br/>MAVA Studio</p>` });
  const r = await sendEmail({
    to,
    subject,
    html,
    replyTo,
    headers: inReplyTo && !inReplyTo.startsWith("resend:") ? { "In-Reply-To": inReplyTo, References: inReplyTo } : undefined,
  });
  if (!r.ok) redirect(`${back}${back.includes("?") ? "&" : "?"}err=${encodeURIComponent("Emailul nu a putut fi trimis: " + r.error)}`);
  revalidatePath("/crm/mesaje");
  redirect(`${back}${back.includes("?") ? "&" : "?"}replied=1`);
}

/** Marchează ca citite mesajele unui client (sau toate). */
export async function markMessagesRead(fd: FormData) {
  const s = await getSession();
  if (!s.can("mesaje")) return;
  const clientId = String(fd.get("client_id") ?? "");
  let q = s.sb.from("messages").update({ read: true }).eq("read", false);
  if (clientId) q = q.eq("client_id", clientId);
  await q;
  revalidatePath("/crm/mesaje");
  if (clientId) revalidatePath(`/crm/clienti/${clientId}`);
}
