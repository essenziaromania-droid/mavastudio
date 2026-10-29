"use server";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";
import { onContractSigned, onOfferAccepted } from "@/lib/automations";
import { addActivity, audit, notify } from "@/lib/events";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { requestIp, sendSignedCopy, validSignature } from "@/lib/signatures";

const isToken = (t: string) => /^[0-9a-f-]{36}$/i.test(t);

export type PublicState = { ok?: boolean; error?: string };

export async function acceptOffer(_: PublicState, fd: FormData): Promise<PublicState> {
  const token = String(fd.get("token") ?? "");
  if (!isToken(token)) return { error: "Link invalid." };
  const sb = createAdminClient();
  const { data: o } = await sb.from("offers").select("id, status, valid_until").eq("public_token", token).maybeSingle();
  if (!o) return { error: "Oferta nu a fost găsită." };
  if (o.status === "acceptata") return { ok: true };
  if (["respinsa", "expirata"].includes(o.status) || (o.valid_until && o.valid_until < new Date().toISOString().slice(0, 10))) {
    return { error: "Oferta nu mai este valabilă. Te rugăm să ne contactezi pentru o ofertă actualizată." };
  }
  await sb.from("offers").update({ status: "acceptata", accepted_at: new Date().toISOString() }).eq("id", o.id);
  await onOfferAccepted(sb, o.id);
  revalidatePath(`/oferta/${token}`);
  return { ok: true };
}

export async function requestOfferChanges(_: PublicState, fd: FormData): Promise<PublicState> {
  const token = String(fd.get("token") ?? "");
  const feedback = String(fd.get("feedback") ?? "").trim().slice(0, 3000);
  if (!isToken(token)) return { error: "Link invalid." };
  if (feedback.length < 3) return { error: "Spune-ne ce ai dori să modificăm." };
  const sb = createAdminClient();
  const { data: o } = await sb.from("offers").select("id, number, client_id, clients(name)").eq("public_token", token).maybeSingle();
  if (!o) return { error: "Oferta nu a fost găsită." };
  await sb.from("offers").update({ status: "modificari", client_feedback: feedback }).eq("id", o.id);
  const clientName = (o.clients as unknown as { name: string } | null)?.name ?? "Clientul";
  await addActivity(sb, { client_id: o.client_id, type: "oferta", title: `Modificări cerute la oferta ${o.number}`, description: feedback });
  await notify(sb, { type: "oferta", title: `${clientName} a cerut modificări la ${o.number}`, body: feedback.slice(0, 140), link: `/crm/oferte/${o.id}` });
  await sendEmail({ to: ADMIN_EMAIL, subject: `✏️ Modificări cerute – ${o.number}`, html: brandedEmail({ title: `Modificări cerute la ${o.number}`, bodyHtml: `<p>${escapeHtml(clientName)}:</p><p style="white-space:pre-line;background:#F6F7FE;border-radius:12px;padding:14px">${escapeHtml(feedback)}</p>` }) });
  return { ok: true };
}

export async function signContract(_: PublicState, fd: FormData): Promise<PublicState> {
  const token = String(fd.get("token") ?? "");
  const name = String(fd.get("name") ?? "").trim().slice(0, 120);
  if (!isToken(token)) return { error: "Link invalid." };
  if (name.length < 3) return { error: "Scrie numele complet al semnatarului." };
  if (fd.get("agree") !== "on") return { error: "Confirmă că ai citit și accepți contractul." };
  const signature = validSignature(fd.get("signature"));
  if (!signature) return { error: "Desenează semnătura în chenarul de semnătură." };
  const sb = createAdminClient();
  const { data: c } = await sb.from("contracts").select("id, status, number").eq("public_token", token).maybeSingle();
  if (!c) return { error: "Contractul nu a fost găsit." };
  if (c.status === "semnat") return { ok: true };
  if (["expirat", "anulat"].includes(c.status)) return { error: "Contractul nu mai este disponibil pentru semnare." };
  const ip = requestIp(headers());
  const { error } = await sb.from("contracts").update({ status: "semnat", signed_at: new Date().toISOString(), signed_by_name: name, signed_ip: ip, client_signature: signature }).eq("id", c.id);
  if (error) return { error: "Semnătura nu a putut fi salvată. Te rugăm să încerci din nou." };
  await audit(sb, { actor_name: name, action: `a semnat electronic contractul (IP ${ip})`, entity: "contract", entity_id: c.number });
  await onContractSigned(sb, c.id);
  try {
    await sendSignedCopy(sb, c.id);
  } catch (e) {
    console.error("[contract] copie semnată", e);
  }
  revalidatePath(`/contract/${token}`);
  return { ok: true };
}
