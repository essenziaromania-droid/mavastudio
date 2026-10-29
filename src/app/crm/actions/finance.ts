"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit, getSetting } from "@/lib/events";
import { DEFAULT_INVOICING, downloadInvoicePdf, emitWithProvider, snapVatRate, type InvoicingSettings } from "@/lib/invoicing";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";
import { onInvoicePaid } from "@/lib/automations";
import { createAdminClient } from "@/lib/supabase/server";
import { formatDate, formatLei } from "@/lib/utils";
import { archiveBuffer } from "@/lib/archive";

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
  const vatRate = Number(inv.subtotal) ? snapVatRate((Number(inv.vat_amount) / Number(inv.subtotal)) * 100) : 0;
  const r = await emitWithProvider(settings, inv.clients, { description: inv.description ?? "Servicii digitale", subtotal: Number(inv.subtotal), vatRate, issueDate: inv.issue_date, dueDate: inv.due_date });
  if (!r.ok) redirect(`/crm/financiar/facturi/${id}?err=${encodeURIComponent(r.error)}`);
  await s.sb.from("invoices").update({ provider: settings.provider, series: r.series, number: r.number, external_url: r.url ?? null, external_id: r.externalId ?? null, status: "emisa" }).eq("id", id);
  await s.sb.from("payment_milestones").update({ status: "facturata" }).eq("invoice_id", id);
  // Arhivează PDF-ul facturii în Fișiere → 10 Facturi, la clientul și proiectul ei.
  const pdf = await downloadInvoicePdf(settings, { provider: settings.provider, series: r.series, number: r.number, external_url: r.url ?? null });
  if (pdf.ok) await archiveBuffer(createAdminClient(), { client_id: inv.client_id, project_id: inv.project_id, folder: "10 Facturi", name: `Factura-${r.series}-${r.number}.pdf`, buf: pdf.pdf, mime: "application/pdf" });
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

/** Trimite factura emisă pe email clientului, cu PDF-ul atașat din programul de facturare. */
export async function sendInvoiceEmail(fd: FormData) {
  const s = await getSession();
  if (!s.can("financiar")) return;
  const id = String(fd.get("id"));
  const back = (q: string) => redirect(`/crm/financiar/facturi/${id}?${q}`);
  const to = (str(fd, "to") ?? "").toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) back(`err=${encodeURIComponent("Adresa de email nu este validă.")}`);

  const { data: inv } = await s.sb.from("invoices").select("*, clients(name, contact_name)").eq("id", id).single();
  if (!inv?.number) back(`err=${encodeURIComponent("Factura trebuie emisă înainte de a fi trimisă.")}`);

  const settings = await getSetting<InvoicingSettings>(createAdminClient(), "invoicing", DEFAULT_INVOICING);
  const pdf = await downloadInvoicePdf(settings, inv);
  if (!pdf.ok) back(`err=${encodeURIComponent(pdf.error)}`);
  if (!pdf.ok) return;

  const label = `${inv.series ?? ""} ${inv.number}`.trim();
  const note = str(fd, "message");
  const greet = inv.clients?.contact_name || inv.clients?.name || "";
  const body = `
    <p>Bună ziua${greet ? `, ${escapeHtml(greet)}` : ""},</p>
    <p>Vă transmitem atașat factura <b>${escapeHtml(label)}</b> din ${formatDate(inv.issue_date)}, în valoare de <b>${formatLei(inv.total, { decimals: true })}</b>${inv.due_date ? `, cu scadența la ${formatDate(inv.due_date)}` : ""}.</p>
    ${note ? `<p style="white-space:pre-line">${escapeHtml(note)}</p>` : ""}
    <p>Pentru orice întrebare, ne puteți răspunde direct la acest email.</p>
    <p>Cu drag,<br/>Echipa MAVA Studio</p>`;
  const r = await sendEmail({
    to,
    replyTo: ADMIN_EMAIL,
    subject: `Factura ${label} – MAVA Studio`,
    html: brandedEmail({ title: `Factura ${label}`, bodyHtml: body }),
    attachments: [{ filename: `Factura-${label.replace(/\s+/g, "-")}.pdf`, content: pdf.pdf }],
  });
  if (!r.ok) back(`err=${encodeURIComponent("Emailul nu a putut fi trimis: " + r.error)}`);

  if (inv.status === "emisa") await s.sb.from("invoices").update({ status: "trimisa" }).eq("id", id);
  await addActivity(s.sb, { client_id: inv.client_id, project_id: inv.project_id, type: "factura", title: `Factură trimisă ${label}`, description: `Către ${to}`, actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a trimis factura ${label} pe email către ${to}`, entity: "factura", entity_id: id });
  revalidatePath(`/crm/financiar/facturi/${id}`);
  back(`sent=${encodeURIComponent(to)}`);
}
