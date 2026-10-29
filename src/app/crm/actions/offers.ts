"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit, getSetting } from "@/lib/events";
import { computeTotals, type OfferItem, buildContractBody, type Company } from "@/lib/documents";
import { asSaved } from "@/lib/includes";
import type { ContractTemplate } from "@/lib/contract-template";
import { brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { onOfferAccepted } from "@/lib/automations";
import { createAdminClient } from "@/lib/supabase/server";
import { formatDate, formatLei } from "@/lib/utils";
import { SITE } from "@/content/site";
import { renderOfferPdf } from "@/lib/pdf";

export type OfferInput = {
  id?: string;
  client_id: string | null;
  lead_id?: string | null;
  title: string;
  discount_percent: number;
  vat_rate: number;
  delivery_term: string;
  payment_terms: string;
  conditions: string;
  notes: string;
  valid_until: string | null;
  items: (OfferItem & { category?: string | null })[];
};

export async function saveOffer(input: OfferInput): Promise<{ id?: string; error?: string }> {
  const s = await getSession();
  if (!s.can("oferte")) return { error: "Nu ai acces la oferte." };
  if (!input.client_id) return { error: "Alege clientul." };
  const items = input.items.filter((i) => i.name.trim());
  if (!items.length) return { error: "Adaugă cel puțin un serviciu." };
  const totals = computeTotals(items, input.discount_percent, input.vat_rate);
  const row = {
    client_id: input.client_id,
    lead_id: input.lead_id || null,
    title: input.title || "Ofertă servicii digitale",
    discount_percent: input.discount_percent || 0,
    vat_rate: input.vat_rate,
    delivery_term: input.delivery_term || null,
    payment_terms: input.payment_terms || null,
    conditions: input.conditions || null,
    notes: input.notes || null,
    valid_until: input.valid_until || null,
    ...totals,
  };

  let id = input.id;
  if (id) {
    const { error } = await s.sb.from("offers").update(row).eq("id", id);
    if (error) return { error: error.message };
    await s.sb.from("offer_items").delete().eq("offer_id", id);
  } else {
    const { data, error } = await s.sb.from("offers").insert({ ...row, created_by: s.userId }).select("id, number").single();
    if (error) return { error: error.message };
    id = data.id;
    await addActivity(s.sb, { client_id: input.client_id, lead_id: input.lead_id || null, type: "oferta", title: `Ofertă creată – ${data.number}`, description: formatLei(totals.total), actor_id: s.userId });
    if (input.lead_id) await s.sb.from("leads").update({ status: "oferta" }).eq("id", input.lead_id).in("status", ["nou", "contactat", "calificat"]);
  }
  const { error: itErr } = await s.sb.from("offer_items").insert(
    items.map((i, idx) => ({
      offer_id: id,
      category: i.category ?? null,
      includes: asSaved(i.includes),
      name: i.name,
      description: i.description || null,
      quantity: Number(i.quantity) || 1,
      unit: i.unit || "proiect",
      unit_price: Number(i.unit_price) || 0,
      recurring: !!i.recurring,
      sort: idx,
    })),
  );
  if (itErr) return { error: itErr.message };
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: input.id ? "a modificat oferta" : "a creat oferta", entity: "oferta", entity_id: id, details: { total: totals.total } });
  revalidatePath("/crm/oferte");
  return { id };
}

export async function sendOffer(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const to = String(fd.get("to") ?? "").trim();
  const message = String(fd.get("message") ?? "").trim();
  const { data: o } = await s.sb.from("offers").select("*, clients(*), offer_items(*)").eq("id", id).single();
  if (!o || !to) return;
  const link = `${SITE.url}/oferta/${o.public_token}`;
  const company = await getSetting<Company>(s.sb, "company", {});
  const pdf = await renderOfferPdf(o, company);
  const res = await sendEmail({
    to,
    replyTo: s.profile.email,
    subject: `Oferta ${o.number} – ${o.title}`,
    html: brandedEmail({
      title: `Oferta ${o.number}`,
      bodyHtml: `<p>${escapeHtml(message || `Bună ziua,\n\nAșa cum am discutat, vă transmitem oferta noastră. O puteți vizualiza și accepta online.`).replace(/\n/g, "<br/>")}</p>
        <p><b>Total: ${formatLei(o.total)}</b>${o.valid_until ? ` · valabilă până la ${formatDate(o.valid_until)}` : ""}</p>
        <p>Cu drag,<br/>${escapeHtml(s.profile.full_name)}<br/>MAVA Studio</p>`,
      cta: { label: "Vezi și acceptă oferta", url: link },
    }),
    attachments: [{ filename: `Oferta-${o.number}.pdf`, content: pdf }],
  });
  if (!res.ok) redirect(`/crm/oferte/${id}?err=${encodeURIComponent(res.error ?? "Email netrimis")}`);
  await s.sb.from("offers").update({ status: o.status === "draft" ? "trimisa" : o.status, sent_at: new Date().toISOString() }).eq("id", id);
  await addActivity(s.sb, { client_id: o.client_id, type: "oferta", title: `Ofertă trimisă – ${o.number}`, description: `către ${to}`, actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a trimis oferta către ${to}`, entity: "oferta", entity_id: o.number });
  redirect(`/crm/oferte/${id}?sent=1`);
}

export async function setOfferStatus(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  const patch: Record<string, unknown> = { status };
  if (status === "trimisa") patch.sent_at = new Date().toISOString();
  if (status === "acceptata") patch.accepted_at = new Date().toISOString();
  await s.sb.from("offers").update(patch).eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a marcat oferta ca „${status}”`, entity: "oferta", entity_id: id });
  if (status === "acceptata") await onOfferAccepted(createAdminClient(), id);
  revalidatePath(`/crm/oferte/${id}`);
  revalidatePath("/crm/oferte");
}

export async function duplicateOffer(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: o } = await s.sb.from("offers").select("*, offer_items(*)").eq("id", id).single();
  if (!o) return;
  const { data: n } = await s.sb
    .from("offers")
    .insert({
      client_id: o.client_id,
      title: o.title,
      discount_percent: o.discount_percent,
      vat_rate: o.vat_rate,
      subtotal: o.subtotal,
      discount_amount: o.discount_amount,
      vat_amount: o.vat_amount,
      total: o.total,
      delivery_term: o.delivery_term,
      payment_terms: o.payment_terms,
      conditions: o.conditions,
      notes: o.notes,
      created_by: s.userId,
    })
    .select("id")
    .single();
  if (!n) return;
  await s.sb.from("offer_items").insert(
    (o.offer_items as Record<string, unknown>[]).map(({ id: _i, offer_id: _o, ...rest }) => ({ ...rest, offer_id: n.id })),
  );
  redirect(`/crm/oferte/${n.id}`);
}

export async function deleteOffer(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("offers").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters o ofertă", entity: "oferta", entity_id: id });
  redirect("/crm/oferte");
}

/** Generează manual contractul dintr-o ofertă (când automatizarea e oprită sau oferta a fost acceptată offline). */
export async function contractFromOffer(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: existing } = await s.sb.from("contracts").select("id").eq("offer_id", id).maybeSingle();
  if (existing) redirect(`/crm/contracte/${existing.id}`);
  const { data: o } = await s.sb.from("offers").select("*, clients(*), offer_items(*)").eq("id", id).single();
  if (!o) return;
  const company = await getSetting<Company>(s.sb, "company", {});
  const { data: num } = await s.sb.rpc("next_doc_number", { p_prefix: "CT" });
  const body = buildContractBody({
    number: num as string,
    company,
    client: o.clients,
    items: (o.offer_items ?? []).sort((a: { sort: number }, b: { sort: number }) => a.sort - b.sort),
    total: Number(o.total),
    vatRate: Number(o.vat_rate),
    deliveryTerm: o.delivery_term,
    paymentTerms: o.payment_terms,
    offerNumber: o.number,
    template: await getSetting<ContractTemplate>(s.sb, "contract_template", {}),
  });
  const { data: c, error } = await s.sb
    .from("contracts")
    .insert({ number: num, client_id: o.client_id, offer_id: o.id, title: o.title, value: o.total, body, start_date: new Date().toISOString().slice(0, 10), created_by: s.userId })
    .select("id, number")
    .single();
  if (error) throw new Error(error.message);
  await addActivity(s.sb, { client_id: o.client_id, type: "contract", title: `Contract generat – ${c.number}`, actor_id: s.userId });
  redirect(`/crm/contracte/${c.id}`);
}
