import "server-only";
import { logOutgoing } from "@/lib/mailbox";
import { Resend } from "resend";

const FROM = process.env.EMAIL_FROM ?? "MAVA Studio <contact@mavastudio.ro>";
export const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL ?? "contact@mavastudio.ro";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Șablon HTML simplu, în culorile MAVA. `bodyHtml` trebuie să fie deja escapat. */
export function brandedEmail({ title, bodyHtml, cta, lang = "ro" }: { title: string; bodyHtml: string; cta?: { label: string; url: string }; lang?: "ro" | "en" }) {
  return `<!doctype html><html lang="${lang}"><body style="margin:0;background:#F6F7FE;font-family:Arial,Helvetica,sans-serif;color:#4B5375">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fff;border-radius:18px;border:1px solid #E8EBF7;overflow:hidden">
    <tr><td style="height:6px;background:linear-gradient(90deg,#00B4FF,#2B6BF7,#B23CF0)"></td></tr>
    <tr><td style="padding:28px 32px 0"><span style="font-size:24px;font-weight:800;color:#0A0F3D;letter-spacing:-.5px">MAVA</span> <span style="font-size:10px;letter-spacing:4px;color:#0A0F3D">STUDIO</span></td></tr>
    <tr><td style="padding:20px 32px 8px"><h1 style="margin:0;font-size:22px;color:#0A0F3D">${esc(title)}</h1></td></tr>
    <tr><td style="padding:8px 32px 24px;font-size:15px;line-height:1.6">${bodyHtml}</td></tr>
    ${cta ? `<tr><td style="padding:0 32px 32px"><a href="${cta.url}" style="display:inline-block;padding:14px 26px;border-radius:12px;background:#2B4CF5;background:linear-gradient(90deg,#00B4FF,#2B6BF7,#B23CF0);color:#fff;text-decoration:none;font-weight:700">${esc(cta.label)} →</a></td></tr>` : ""}
    <tr><td style="padding:18px 32px;border-top:1px solid #E8EBF7;font-size:12px;color:#7A819E">MAVA Studio · www.mavastudio.ro · contact@mavastudio.ro</td></tr>
  </table></td></tr></table></body></html>`;
}

export { esc as escapeHtml };

export async function sendEmail(opts: { to: string | string[]; subject: string; html: string; replyTo?: string; attachments?: { filename: string; content: Buffer }[]; headers?: Record<string, string> }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[email] RESEND_API_KEY lipsește – email netrimis:", opts.subject);
    return { ok: false as const, error: "Emailul nu este configurat (RESEND_API_KEY)." };
  }
  try {
    const resend = new Resend(key);
    const { data, error } = await resend.emails.send({ from: FROM, to: opts.to, subject: opts.subject, html: opts.html, replyTo: opts.replyTo, attachments: opts.attachments, headers: opts.headers });
    if (error) return { ok: false as const, error: error.message };
    // Emailurile către clienți/lead-uri apar și în tab-ul „Mesaje” al clientului.
    const to = (Array.isArray(opts.to) ? opts.to : [opts.to]).filter((x) => x.toLowerCase() !== ADMIN_EMAIL.toLowerCase());
    if (to.length) await logOutgoing({ to, subject: opts.subject, html: opts.html, messageId: data?.id ? `resend:${data.id}` : null });
    return { ok: true as const };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Eroare email" };
  }
}
