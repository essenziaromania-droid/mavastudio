"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
