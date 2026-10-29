import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { addMonths, format, startOfMonth, subDays, subMonths } from "date-fns";
import { ro } from "date-fns/locale";
import { SERVICE_CATEGORY } from "./constants";

const ymd = (d: Date) => format(d, "yyyy-MM-dd");
const sum = (rows: { [k: string]: unknown }[] | null | undefined, key: string) => (rows ?? []).reduce((s, r) => s + Number(r[key] ?? 0), 0);

export function delta(cur: number, prev: number) {
  if (!prev) return cur ? 100 : 0;
  return Math.round(((cur - prev) / Math.abs(prev)) * 100);
}

/** Încasări / facturat / cheltuieli într-un interval [from, to). */
export async function financeForRange(sb: SupabaseClient, from: Date, to: Date) {
  const [pay, inv, exp] = await Promise.all([
    sb.from("payments").select("amount").gte("paid_at", ymd(from)).lt("paid_at", ymd(to)),
    sb.from("invoices").select("total").neq("status", "anulata").neq("status", "draft").gte("issue_date", ymd(from)).lt("issue_date", ymd(to)),
    sb.from("expenses").select("amount").gte("expense_date", ymd(from)).lt("expense_date", ymd(to)),
  ]);
  const incasari = sum(pay.data, "amount");
  const facturat = sum(inv.data, "total");
  const cheltuieli = sum(exp.data, "amount");
  return { incasari, facturat, cheltuieli, profit: incasari - cheltuieli };
}

export async function outstanding(sb: SupabaseClient) {
  const { data } = await sb.from("invoices").select("total, paid_amount, due_date, status").in("status", ["emisa", "trimisa", "partial", "restanta"]);
  const today = ymd(new Date());
  let total = 0;
  let overdue = 0;
  let overdueCount = 0;
  for (const r of data ?? []) {
    const rest = Number(r.total) - Number(r.paid_amount);
    total += rest;
    if (r.status === "restanta" || (r.due_date && r.due_date < today)) {
      overdue += rest;
      overdueCount++;
    }
  }
  return { total, overdue, overdueCount };
}

/** Serie lunară: încasări și cheltuieli pe ultimele N luni. */
export async function monthlySeries(sb: SupabaseClient, months: number) {
  const start = startOfMonth(subMonths(new Date(), months - 1));
  const [pay, exp] = await Promise.all([
    sb.from("payments").select("amount, paid_at").gte("paid_at", ymd(start)),
    sb.from("expenses").select("amount, expense_date").gte("expense_date", ymd(start)),
  ]);
  const buckets = Array.from({ length: months }, (_, i) => {
    const d = addMonths(start, i);
    return { key: format(d, "yyyy-MM"), label: format(d, "LLL", { locale: ro }).replace(".", ""), incasari: 0, cheltuieli: 0 };
  });
  const idx = new Map(buckets.map((b, i) => [b.key, i]));
  for (const p of pay.data ?? []) {
    const i = idx.get(String(p.paid_at).slice(0, 7));
    if (i !== undefined) buckets[i]!.incasari += Number(p.amount);
  }
  for (const e of exp.data ?? []) {
    const i = idx.get(String(e.expense_date).slice(0, 7));
    if (i !== undefined) buckets[i]!.cheltuieli += Number(e.amount);
  }
  return buckets;
}

/** Venituri încasate pe categorii de servicii (din facturile asociate plăților). */
export async function revenueByService(sb: SupabaseClient, from: Date) {
  const { data } = await sb.from("payments").select("amount, invoices(service_category)").gte("paid_at", ymd(from));
  const totals = new Map<string, number>();
  for (const p of (data ?? []) as unknown as { amount: number; invoices: { service_category: string | null } | null }[]) {
    const cat = p.invoices?.service_category ?? "altele";
    totals.set(cat, (totals.get(cat) ?? 0) + Number(p.amount));
  }
  return Object.entries(SERVICE_CATEGORY)
    .map(([key, v]) => ({ name: v.label, value: Math.round(totals.get(key) ?? 0), color: v.color }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
}

/** Funnel comercial pentru ultimele N zile. */
export async function salesFunnel(sb: SupabaseClient, days: number) {
  const from = subDays(new Date(), days).toISOString();
  const [leads, offers, contracts, clients] = await Promise.all([
    sb.from("leads").select("status").gte("created_at", from),
    sb.from("offers").select("status, total").gte("created_at", from),
    sb.from("contracts").select("status").gte("created_at", from),
    sb.from("clients").select("id", { count: "exact", head: true }).eq("status", "activ").gte("created_at", from),
  ]);
  const L = leads.data ?? [];
  const O = offers.data ?? [];
  const sent = O.filter((o) => o.status !== "draft");
  const accepted = O.filter((o) => o.status === "acceptata");
  const steps = [
    { label: "Lead-uri", value: L.length },
    { label: "Contactate", value: L.filter((l) => l.status !== "nou").length },
    { label: "Oferte trimise", value: sent.length },
    { label: "Oferte acceptate", value: accepted.length },
    { label: "Contracte semnate", value: (contracts.data ?? []).filter((c) => c.status === "semnat").length },
    { label: "Clienți noi", value: clients.count ?? 0 },
  ];
  return {
    steps,
    leadToClient: L.length ? Math.round(((clients.count ?? 0) / L.length) * 100) : 0,
    acceptance: sent.length ? Math.round((accepted.length / sent.length) * 100) : 0,
    sentValue: sum(sent, "total"),
    avgDeal: accepted.length ? Math.round(sum(accepted, "total") / accepted.length) : 0,
  };
}

export const monthRange = (offset = 0) => {
  const start = startOfMonth(subMonths(new Date(), offset));
  return { from: start, to: addMonths(start, 1) };
};
