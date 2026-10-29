"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit, getSetting } from "@/lib/events";
import { DEFAULT_INVOICING, emitWithProvider, type InvoicingSettings } from "@/lib/invoicing";
import { onInvoicePaid } from "@/lib/automations";
import { createAdminClient } from "@/lib/supabase/server";
import { formatLei } from "@/lib/utils";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v.length ? v : null;
};
const round = (n: number) => Math.round(n * 100) / 100;

export async function createInvoice(fd: FormData) {
  const s = await getSession();
  const total = Number(fd.get("total") || 0);
  const vat = Number(fd.get("vat_rate") ?? 21);
  const subtotal = round(total / (1 + vat / 100));
  const projectId = str(fd, "project_id");
  let clientId = str(fd, "client_id");
  if (!clientId && projectId) clientId = (await s.sb.from("projects").select("client_id").eq("id", projectId).single()).data?.client_id ?? null;
  const manual = fd.get("mode") === "manual";
  const { data, error } = await s.sb
    .from("invoices")
    .insert({
      client_id: clientId,
      project_id: projectId,
      description: str(fd, "description") ?? "Servicii digitale",
      service_category: str(fd, "service_category"),
      subtotal,
      vat_amount: round(total - subtotal),
      total,
      issue_date: str(fd, "issue_date") ?? new Date().toISOString().slice(0, 10),
      due_date: str(fd, "due_date"),
      series: manual ? str(fd, "series") : null,
      number: manual ? str(fd, "number") : null,
      external_url: manual ? str(fd, "external_url") : null,
      status: manual ? "emisa" : "draft",
      provider: "manual",
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const milestone = str(fd, "milestone_id");
  if (milestone) await s.sb.from("payment_milestones").update({ invoice_id: data.id, status: "facturata" }).eq("id", milestone);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a creat o factură de ${formatLei(total)}`, entity: "factura", entity_id: data.id });
  redirect(`/crm/financiar/facturi/${data.id}`);
}

/** Emite factura în SmartBill / Oblio / FGO și salvează seria, numărul și linkul. */
export async function emitInvoice(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: inv } = await s.sb.from("invoices").select("*, clients(*)").eq("id", id).single();
  if (!inv) return;
  if (!inv.clients) redirect(`/crm/financiar/facturi/${id}?err=${encodeURIComponent("Factura nu are client asociat.")}`);
  const settings = await getSetting<InvoicingSettings>(createAdminClient(), "invoicing", DEFAULT_INVOICING);
  const vatRate = Number(inv.subtotal) ? Math.round((Number(inv.vat_amount) / Number(inv.subtotal)) * 100) : 0;
  const r = await emitWithProvider(settings, inv.clients, { description: inv.description ?? "Servicii digitale", subtotal: Number(inv.subtotal), vatRate, issueDate: inv.issue_date, dueDate: inv.due_date });
  if (!r.ok) redirect(`/crm/financiar/facturi/${id}?err=${encodeURIComponent(r.error)}`);
  await s.sb.from("invoices").update({ provider: settings.provider, series: r.series, number: r.number, external_url: r.url ?? null, external_id: r.externalId ?? null, status: "emisa" }).eq("id", id);
  await s.sb.from("payment_milestones").update({ status: "facturata" }).eq("invoice_id", id);
  await addActivity(s.sb, { client_id: inv.client_id, project_id: inv.project_id, type: "factura", title: `Factură emisă ${r.series} ${r.number}`, description: formatLei(inv.total), actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a emis factura ${r.series} ${r.number} în ${settings.provider}`, entity: "factura", entity_id: id });
  redirect(`/crm/financiar/facturi/${id}?ok=1`);
}

export async function addPayment(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("invoice_id"));
  const amount = Number(fd.get("amount") || 0);
  if (amount <= 0) return;
  const { data: inv } = await s.sb.from("invoices").select("total, paid_amount, client_id, series, number").eq("id", id).single();
  if (!inv) return;
  await s.sb.from("payments").insert({ invoice_id: id, client_id: inv.client_id, amount, paid_at: str(fd, "paid_at") ?? new Date().toISOString().slice(0, 10), method: str(fd, "method") ?? "transfer", notes: str(fd, "notes") });
  const paid = round(Number(inv.paid_amount) + amount);
  const full = paid >= Number(inv.total) - 0.01;
  await s.sb.from("invoices").update({ paid_amount: paid, status: full ? "platita" : "partial" }).eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a înregistrat o plată de ${formatLei(amount)} la factura ${[inv.series, inv.number].filter(Boolean).join(" ")}`, entity: "factura", entity_id: id });
  if (full) await onInvoicePaid(createAdminClient(), id);
  revalidatePath(`/crm/financiar/facturi/${id}`);
  revalidatePath("/crm/financiar");
}

export async function setInvoiceStatus(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  await s.sb.from("invoices").update({ status }).eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a marcat factura ca „${status}”`, entity: "factura", entity_id: id });
  if (status === "platita") {
    const { data: inv } = await s.sb.from("invoices").select("total, paid_amount, client_id").eq("id", id).single();
    if (inv && Number(inv.paid_amount) < Number(inv.total)) {
      const rest = round(Number(inv.total) - Number(inv.paid_amount));
      await s.sb.from("payments").insert({ invoice_id: id, client_id: inv.client_id, amount: rest, method: "transfer", notes: "Marcată plătită manual" });
      await s.sb.from("invoices").update({ paid_amount: inv.total }).eq("id", id);
    }
    await onInvoicePaid(createAdminClient(), id);
  }
  revalidatePath(`/crm/financiar/facturi/${id}`);
}

export async function deleteInvoice(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("payment_milestones").update({ invoice_id: null, status: "planificata" }).eq("invoice_id", id);
  await s.sb.from("invoices").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters o factură", entity: "factura", entity_id: id });
  redirect("/crm/financiar?tab=facturi");
}

export async function createExpense(fd: FormData) {
  const s = await getSession();
  await s.sb.from("expenses").insert({
    category: str(fd, "category") ?? "altele",
    description: str(fd, "description") ?? "Cheltuială",
    supplier: str(fd, "supplier"),
    amount: Number(fd.get("amount") || 0),
    expense_date: str(fd, "expense_date") ?? new Date().toISOString().slice(0, 10),
    project_id: str(fd, "project_id"),
    recurring: fd.get("recurring") === "on",
  });
  revalidatePath("/crm/financiar");
}

export async function deleteExpense(fd: FormData) {
  const s = await getSession();
  await s.sb.from("expenses").delete().eq("id", String(fd.get("id")));
  revalidatePath("/crm/financiar");
}

/** Marchează automat ca restante facturile cu scadența depășită. */
export async function refreshOverdue() {
  const s = await getSession();
  await s.sb.from("invoices").update({ status: "restanta" }).in("status", ["emisa", "trimisa", "partial"]).lt("due_date", new Date().toISOString().slice(0, 10));
  revalidatePath("/crm/financiar");
}
