import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { getSetting } from "@/lib/events";
import { renderContractPdf } from "@/lib/pdf";
import type { Company } from "@/lib/documents";
import { formatDate } from "@/lib/utils";

const PREFIX = "data:image/png;base64,";

/** Semnătura desenată trebuie să fie o imagine PNG validă, de cel mult ~400 KB. */
export function validSignature(value: unknown): string | null {
  const s = typeof value === "string" ? value.trim() : "";
  if (!s.startsWith(PREFIX) || s.length > 400_000 || s.length < PREFIX.length + 200) return null;
  return /^[A-Za-z0-9+/=]+$/.test(s.slice(PREFIX.length)) ? s : null;
}

/** IP-ul semnatarului, din antetele cererii (Vercel îl pune în x-forwarded-for). */
export function requestIp(h: Headers) {
  return (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "necunoscut";
}

/**
 * Când contractul are ambele semnături, trimite o singură dată PDF-ul final, semnat,
 * clientului și echipei MAVA Studio.
 */
export async function sendSignedCopy(sb: SupabaseClient, contractId: string) {
  const { data: c } = await sb.from("contracts").select("*, clients(name, email, contact_email, contact_name)").eq("id", contractId).single();
  if (!c || !c.signed_at || !c.provider_signed_at || c.signed_copy_sent_at) return;
  const company = await getSetting<Company>(sb, "company", {});
  const pdf = await renderContractPdf(c, company);
  const to = [c.clients?.contact_email || c.clients?.email, ADMIN_EMAIL].filter(Boolean) as string[];
  const greet = c.clients?.contact_name || c.signed_by_name || "";
  const r = await sendEmail({
    to,
    replyTo: ADMIN_EMAIL,
    subject: `Contract ${c.number} – semnat de ambele părți`,
    html: brandedEmail({
      title: `Contractul ${c.number} este semnat`,
      bodyHtml: `<p>Bună ziua${greet ? `, ${escapeHtml(greet)}` : ""},</p>
        <p>Contractul <b>${escapeHtml(c.title)}</b> a fost semnat electronic de ambele părți:</p>
        <p>Prestator: <b>${escapeHtml(c.provider_signed_by ?? "")}</b>, la ${formatDate(c.provider_signed_at, true)}<br/>
        Beneficiar: <b>${escapeHtml(c.signed_by_name ?? "")}</b>, la ${formatDate(c.signed_at, true)}</p>
        <p>Găsiți atașat exemplarul final, în format PDF. Vă recomandăm să îl păstrați.</p>
        <p>Cu drag,<br/>Echipa MAVA Studio</p>`,
    }),
    attachments: [{ filename: `Contract-${c.number}-semnat.pdf`, content: pdf }],
  });
  if (r.ok) await sb.from("contracts").update({ signed_copy_sent_at: new Date().toISOString() }).eq("id", c.id);
}
