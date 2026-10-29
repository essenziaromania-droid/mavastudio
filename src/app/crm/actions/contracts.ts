"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { requestIp, sendSignedCopy, validSignature } from "@/lib/signatures";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit, getSetting } from "@/lib/events";
import { brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { onContractSigned } from "@/lib/automations";
import { createAdminClient } from "@/lib/supabase/server";
import { renderContractPdf } from "@/lib/pdf";
import type { Company } from "@/lib/documents";
import { SITE } from "@/content/site";

export async function updateContract(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  // Textul semnat (de prestator sau de client) nu mai poate fi modificat.
  const { data: cur } = await s.sb.from("contracts").select("status, provider_signed_at").eq("id", id).single();
  if (cur?.status === "semnat" || cur?.provider_signed_at) redirect(`/crm/contracte/${id}?err=${encodeURIComponent("Contractul este semnat și nu mai poate fi modificat. Retrage semnătura prestatorului ca să-l editezi.")}`);
  await s.sb
    .from("contracts")
    .update({
      title: String(fd.get("title") ?? ""),
      value: Number(fd.get("value") || 0),
      start_date: String(fd.get("start_date") || "") || null,
      end_date: String(fd.get("end_date") || "") || null,
      body: String(fd.get("body") ?? "").replace(/\r\n?/g, "\n"),
    })
    .eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a modificat contractul", entity: "contract", entity_id: id });
  revalidatePath(`/crm/contracte/${id}`);
}

export async function sendContract(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const to = String(fd.get("to") ?? "").trim();
  const { data: c } = await s.sb.from("contracts").select("*, clients(*)").eq("id", id).single();
  if (!c || !to) return;
  const company = await getSetting<Company>(s.sb, "company", {});
  const pdf = await renderContractPdf(c, company).catch((e) => {
    console.error("[contract pdf]", e);
    return null;
  });
  if (!pdf) redirect(`/crm/contracte/${id}?err=${encodeURIComponent("PDF-ul contractului nu a putut fi generat. Încearcă din nou.")}`);
  const link = `${SITE.url}/contract/${c.public_token}`;
  const r = await sendEmail({
    to,
    replyTo: s.profile.email,
    subject: `Contract ${c.number} – spre semnare`,
    html: brandedEmail({
      title: `Contractul ${c.number} este gata de semnare`,
      bodyHtml: `<p>Bună ziua,</p><p>Vă transmitem contractul pentru <b>${escapeHtml(c.title)}</b>. Îl puteți citi și semna electronic din linkul de mai jos. Găsiți atașată și varianta PDF.</p><p>Cu drag,<br/>${escapeHtml(s.profile.full_name)}<br/>MAVA Studio</p>`,
      cta: { label: "Citește și semnează", url: link },
    }),
    attachments: [{ filename: `Contract-${c.number}.pdf`, content: pdf }],
  });
  if (!r.ok) redirect(`/crm/contracte/${id}?err=${encodeURIComponent(r.error ?? "Email netrimis")}`);
  await s.sb.from("contracts").update({ status: c.status === "draft" ? "trimis" : c.status, sent_at: new Date().toISOString() }).eq("id", id);
  await addActivity(s.sb, { client_id: c.client_id, type: "contract", title: `Contract trimis spre semnare – ${c.number}`, description: `către ${to}`, actor_id: s.userId });
  redirect(`/crm/contracte/${id}?sent=1`);
}

export async function setContractStatus(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  const patch: Record<string, unknown> = { status };
  if (status === "semnat") {
    patch.signed_at = new Date().toISOString();
    patch.signed_by_name = `${s.profile.full_name} (marcat manual)`;
  }
  if (status === "trimis") patch.sent_at = new Date().toISOString();
  await s.sb.from("contracts").update(patch).eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a marcat contractul ca „${status}”`, entity: "contract", entity_id: id });
  if (status === "semnat") await onContractSigned(createAdminClient(), id);
  revalidatePath(`/crm/contracte/${id}`);
  revalidatePath("/crm/contracte");
}

export async function createBlankContract(fd: FormData) {
  const s = await getSession();
  const clientId = String(fd.get("client_id") ?? "");
  if (!clientId) return;
  const { data, error } = await s.sb
    .from("contracts")
    .insert({ client_id: clientId, title: String(fd.get("title") || "Contract de prestări servicii"), body: "# Contract de prestări servicii\n\nCompletează conținutul contractului.", created_by: s.userId })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  redirect(`/crm/contracte/${data.id}`);
}

export async function deleteContract(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("contracts").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters un contract", entity: "contract", entity_id: id });
  redirect("/crm/contracte");
}

/** Semnătura prestatorului (MAVA Studio), aplicată din CRM. Blochează textul contractului. */
export async function signAsProvider(fd: FormData) {
  const s = await getSession();
  if (!s.can("contracte")) return;
  const id = String(fd.get("id"));
  const back = (q: string) => redirect(`/crm/contracte/${id}?${q}`);
  const name = String(fd.get("name") ?? "").trim().slice(0, 120);
  if (name.length < 3) back(`err=${encodeURIComponent("Scrie numele complet al semnatarului.")}`);

  const { data: me } = await s.sb.from("profiles").select("signature").eq("id", s.userId).maybeSingle();
  const drawn = validSignature(fd.get("signature"));
  const signature = drawn ?? (fd.get("use_saved") === "on" ? validSignature(me?.signature) : null);
  if (!signature) back(`err=${encodeURIComponent("Desenează semnătura sau alege semnătura salvată.")}`);

  const { data: c } = await s.sb.from("contracts").select("id, number, client_id, provider_signed_at").eq("id", id).single();
  if (!c || c.provider_signed_at) back("");
  const ip = requestIp(headers());
  const { error } = await s.sb
    .from("contracts")
    .update({ provider_signed_at: new Date().toISOString(), provider_signed_by: name, provider_signed_ip: ip, provider_signature: signature })
    .eq("id", id);
  if (error) back(`err=${encodeURIComponent(error.message.includes("provider_") ? "Rulează migrarea supabase/migrations/0003_signatures.sql în Supabase." : error.message)}`);
  if (drawn && fd.get("remember") === "on") await s.sb.from("profiles").update({ signature: drawn }).eq("id", s.userId);

  await addActivity(s.sb, { client_id: c!.client_id, type: "contract", title: `Contract semnat de prestator – ${c!.number}`, description: `Semnat de ${name}`, actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a semnat contractul ${c!.number} ca prestator (IP ${ip})`, entity: "contract", entity_id: id });
  try {
    await sendSignedCopy(createAdminClient(), id);
  } catch (e) {
    console.error("[contract] copie semnată", e);
  }
  revalidatePath(`/crm/contracte/${id}`);
  back("signed=1");
}

/** Retrage semnătura prestatorului, ca textul să poată fi modificat. Posibil doar înainte de semnarea clientului. */
export async function withdrawProviderSignature(fd: FormData) {
  const s = await getSession();
  if (!s.can("contracte")) return;
  const id = String(fd.get("id"));
  const { data: c } = await s.sb.from("contracts").select("number, signed_at").eq("id", id).single();
  if (!c || c.signed_at) redirect(`/crm/contracte/${id}?err=${encodeURIComponent("Contractul a fost semnat de client; semnătura nu mai poate fi retrasă.")}`);
  await s.sb.from("contracts").update({ provider_signed_at: null, provider_signed_by: null, provider_signed_ip: null, provider_signature: null }).eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a retras semnătura prestatorului de pe contractul ${c!.number}`, entity: "contract", entity_id: id });
  revalidatePath(`/crm/contracte/${id}`);
  redirect(`/crm/contracte/${id}`);
}

/** Șterge semnătura salvată în profilul utilizatorului. */
export async function clearSavedSignature(fd: FormData) {
  const s = await getSession();
  await s.sb.from("profiles").update({ signature: null }).eq("id", s.userId);
  redirect(`/crm/contracte/${String(fd.get("id"))}`);
}
