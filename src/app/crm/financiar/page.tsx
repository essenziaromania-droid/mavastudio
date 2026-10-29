import Link from "next/link";
import { Plus, RefreshCw } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { Field, Input, Kpi, PageHeader, Panel, Select, StatusBadge, Table, Td, Tabs } from "@/components/crm/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { TrendChart } from "@/components/crm/charts";
import { EXPENSE_CATEGORY, INVOICE_STATUS } from "@/lib/crm/constants";
import { delta, financeForRange, monthRange, monthlySeries, outstanding } from "@/lib/crm/metrics";
import { createExpense, deleteExpense, refreshOverdue } from "../actions/finance";
import { getProjectsOptions } from "@/lib/crm/queries";
import { getSetting } from "@/lib/events";
import { DEFAULT_INVOICING, type InvoicingSettings } from "@/lib/invoicing";
import { cn, formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Financiar" };

export default async function FinancePage({ searchParams }: { searchParams: { tab?: string; status?: string } }) {
  const s = await requireModule("financiar");
  const { sb } = s;
  const tab = searchParams.tab ?? "rezumat";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader
        title="Financiar"
        sub="Încasări, facturi, plăți, cheltuieli și integrarea cu programul de facturare."
        actions={
          <>
            <form action={refreshOverdue}><SubmitButton variant="ghost" pendingText="..."><RefreshCw className="h-4 w-4" /> Actualizează restanțele</SubmitButton></form>
            <Link href="/crm/financiar/facturi/noua" className="btn-primary !py-2.5"><Plus className="h-4 w-4" /> Factură nouă</Link>
          </>
        }
      />
      <Tabs
        active={tab}
        items={[
          { key: "rezumat", label: "Rezumat", href: "/crm/financiar" },
          { key: "facturi", label: "Facturi", href: "/crm/financiar?tab=facturi" },
          { key: "plati", label: "Plăți", href: "/crm/financiar?tab=plati" },
          { key: "cheltuieli", label: "Cheltuieli", href: "/crm/financiar?tab=cheltuieli" },
          { key: "integrare", label: "Integrare", href: "/crm/financiar?tab=integrare" },
        ]}
      />

      {tab === "rezumat" && <Summary />}

      {tab === "facturi" && <Invoices status={searchParams.status} today={today} />}

      {tab === "plati" && <Payments />}

      {tab === "cheltuieli" && <Expenses />}

      {tab === "integrare" && <Integration canEdit={s.can("setari")} />}
    </>
  );

  async function Summary() {
    const [cur, prev, out, series] = await Promise.all([
      financeForRange(sb, monthRange(0).from, monthRange(0).to),
      financeForRange(sb, monthRange(1).from, monthRange(1).to),
      outstanding(sb),
      monthlySeries(sb, 12),
    ]);
    return (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi label="Încasări (luna curentă)" value={formatLei(cur.incasari)} delta={delta(cur.incasari, prev.incasari)} />
          <Kpi label="Facturat" value={formatLei(cur.facturat)} delta={delta(cur.facturat, prev.facturat)} />
          <Kpi label="De încasat" value={formatLei(out.total)} hint={`${formatLei(out.overdue)} restant`} tone={out.overdue ? "red" : undefined} />
          <Kpi label="Cheltuieli" value={formatLei(cur.cheltuieli)} delta={delta(cur.cheltuieli, prev.cheltuieli)} invert />
        </div>
        <Panel title="Evoluția încasărilor vs. cheltuieli (12 luni)">
          <TrendChart data={series} series={[{ key: "incasari", name: "Încasări", color: "#2B4CF5" }, { key: "cheltuieli", name: "Cheltuieli", color: "#E040C8" }]} height={300} />
        </Panel>
      </>
    );
  }

  async function Invoices({ status, today }: { status?: string; today: string }) {
    let q = sb.from("invoices").select("id, series, number, status, total, paid_amount, issue_date, due_date, provider, clients(name), projects(name)").order("issue_date", { ascending: false }).limit(400);
    if (status) q = q.eq("status", status);
    const { data } = await q;
    return (
      <Panel pad={false}>
        <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3 text-xs">
          <Link href="/crm/financiar?tab=facturi" className={cn("rounded-full px-3 py-1 font-semibold", !status ? "bg-brand-blue text-white" : "bg-soft text-body")}>Toate</Link>
          {Object.entries(INVOICE_STATUS).map(([k, v]) => (
            <Link key={k} href={`/crm/financiar?tab=facturi&status=${k}`} className={cn("rounded-full px-3 py-1 font-semibold", status === k ? "bg-brand-blue text-white" : "bg-soft text-body")}>{v.label}</Link>
          ))}
        </div>
        <Table head={["Factură", "Client", "Proiect", "Emisă", "Scadență", "Total", "Încasat", "Status"]} empty="Nicio factură.">
          {(data ?? []).map((i) => {
            const late = i.due_date && i.due_date < today && !["platita", "anulata", "draft"].includes(i.status);
            return (
              <tr key={i.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/financiar/facturi/${i.id}`} className="font-semibold text-brand-blue">{[i.series, i.number].filter(Boolean).join(" ") || "Draft"}</Link><p className="text-[10px] uppercase text-muted">{i.provider}</p></Td>
                <Td className="font-medium text-ink">{(i.clients as unknown as { name: string } | null)?.name ?? "—"}</Td>
                <Td className="text-xs">{(i.projects as unknown as { name: string } | null)?.name ?? "—"}</Td>
                <Td className="text-xs">{formatDate(i.issue_date)}</Td>
                <Td className={cn("text-xs", late && "font-bold text-rose-500")}>{formatDate(i.due_date)}</Td>
                <Td className="font-semibold">{formatLei(i.total)}</Td>
                <Td>{formatLei(i.paid_amount)}</Td>
                <Td><StatusBadge map={INVOICE_STATUS} value={i.status} /></Td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    );
  }

  async function Payments() {
    const { data } = await sb.from("payments").select("id, amount, paid_at, method, notes, invoices(id, series, number), clients(name)").order("paid_at", { ascending: false }).limit(400);
    return (
      <Panel pad={false}>
        <Table head={["Data", "Client", "Factură", "Metodă", "Sumă", "Note"]} empty="Nicio plată înregistrată.">
          {(data ?? []).map((p) => {
            const inv = p.invoices as unknown as { id: string; series: string | null; number: string | null } | null;
            return (
              <tr key={p.id}>
                <Td className="text-xs">{formatDate(p.paid_at)}</Td>
                <Td className="font-medium text-ink">{(p.clients as unknown as { name: string } | null)?.name ?? "—"}</Td>
                <Td>{inv ? <Link href={`/crm/financiar/facturi/${inv.id}`} className="text-brand-blue">{[inv.series, inv.number].filter(Boolean).join(" ") || "Draft"}</Link> : "—"}</Td>
                <Td className="text-xs capitalize">{p.method}</Td>
                <Td className="font-semibold text-emerald-600">{formatLei(p.amount, { decimals: true })}</Td>
                <Td className="text-xs text-muted">{p.notes}</Td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    );
  }

  async function Expenses() {
    const [{ data }, projects] = await Promise.all([
      sb.from("expenses").select("id, category, description, supplier, amount, expense_date, recurring, projects(name)").order("expense_date", { ascending: false }).limit(400),
      getProjectsOptions(sb),
    ]);
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Panel pad={false}>
          <Table head={["Data", "Categorie", "Descriere", "Furnizor", "Proiect", "Sumă", ""]} empty="Nicio cheltuială.">
            {(data ?? []).map((e) => (
              <tr key={e.id}>
                <Td className="text-xs">{formatDate(e.expense_date)}</Td>
                <Td className="text-xs">{EXPENSE_CATEGORY[e.category] ?? e.category}{e.recurring && <span className="ml-1 text-muted">(lunar)</span>}</Td>
                <Td className="font-medium text-ink">{e.description}</Td>
                <Td className="text-xs">{e.supplier}</Td>
                <Td className="text-xs">{(e.projects as unknown as { name: string } | null)?.name ?? "—"}</Td>
                <Td className="font-semibold text-rose-500">{formatLei(e.amount, { decimals: true })}</Td>
                <Td><form action={deleteExpense}><input type="hidden" name="id" value={e.id} /><ConfirmSubmit message="Ștergi cheltuiala?" className="text-xs text-muted hover:text-rose-500">Șterge</ConfirmSubmit></form></Td>
              </tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Cheltuială nouă">
          <form action={createExpense} className="space-y-3">
            <Field label="Descriere *"><Input name="description" required placeholder="Abonament Figma" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Sumă (lei) *"><Input name="amount" type="number" step="0.01" required /></Field>
              <Field label="Data"><Input name="expense_date" type="date" defaultValue={today} /></Field>
            </div>
            <Field label="Categorie"><Select name="category" options={EXPENSE_CATEGORY} /></Field>
            <Field label="Furnizor"><Input name="supplier" /></Field>
            <Field label="Proiect" hint="Pentru calculul profitabilității proiectului."><Select name="project_id" options={projects} placeholder="Cheltuială generală" /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="recurring" className="accent-brand-blue" /> Cheltuială lunară recurentă</label>
            <SubmitButton className="w-full">Adaugă</SubmitButton>
          </form>
        </Panel>
      </div>
    );
  }

  async function Integration({ canEdit }: { canEdit: boolean }) {
    const cfg = await getSetting<InvoicingSettings>(sb, "invoicing", DEFAULT_INVOICING);
    const providers = [
      { key: "smartbill", name: "SmartBill", color: "#1F6FB5", ok: !!(cfg.smartbill.email && cfg.smartbill.token) },
      { key: "oblio", name: "Oblio", color: "#E5542A", ok: !!(cfg.oblio.email && cfg.oblio.secret) },
      { key: "fgo", name: "FGO", color: "#1D4ED8", ok: !!(cfg.fgo.cui && cfg.fgo.key) },
    ];
    return (
      <Panel title="Integrare facturare" className="max-w-2xl">
        <p className="mb-5 text-sm text-body">CRM-ul nu înlocuiește programul de facturare: trimite datele prin API, iar factura emisă (serie, număr, link PDF) apare automat în CRM.</p>
        <ul className="space-y-3">
          {providers.map((p) => (
            <li key={p.key} className="flex items-center gap-4 rounded-xl border border-line p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white" style={{ background: p.color }}>{p.name[0]}</span>
              <span className="flex-1 font-semibold text-ink">{p.name}{cfg.provider === p.key && <span className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] text-brand-blue">implicit</span>}</span>
              <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", p.ok ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>{p.ok ? "Conectat" : "Neconfigurat"}</span>
            </li>
          ))}
        </ul>
        {canEdit && <Link href="/crm/setari?tab=integrari" className="btn-primary mt-5">Configurează în Setări</Link>}
      </Panel>
    );
  }
}
