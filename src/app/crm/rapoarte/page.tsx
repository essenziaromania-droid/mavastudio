import { startOfYear, subMonths } from "date-fns";
import { getSession } from "@/lib/crm/auth";
import { redirect } from "next/navigation";
import { Kpi, PageHeader, Panel, Table, Td, Tabs } from "@/components/crm/ui";
import { BarsChart, DonutChart, TrendChart } from "@/components/crm/charts";
import { monthlySeries, outstanding, revenueByService, salesFunnel } from "@/lib/crm/metrics";
import { LEAD_SOURCE } from "@/lib/crm/constants";
import { formatLei, pct } from "@/lib/utils";

export const metadata = { title: "Rapoarte" };

export default async function ReportsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const s = await getSession();
  if (!s.can("rapoarte")) redirect("/crm?forbidden=1");
  const { sb } = s;
  const canFin = s.can("financiar");
  const tab = searchParams.tab ?? (canFin ? "venituri" : "vanzari");
  const yearStart = startOfYear(new Date());
  const today = new Date().toISOString().slice(0, 10);

  const tabs = [
    ...(canFin ? [{ key: "venituri", label: "Venituri", href: "/crm/rapoarte?tab=venituri" }] : []),
    { key: "vanzari", label: "Vânzări", href: "/crm/rapoarte?tab=vanzari" },
    { key: "proiecte", label: "Proiecte", href: "/crm/rapoarte?tab=proiecte" },
    { key: "echipa", label: "Echipă", href: "/crm/rapoarte?tab=echipa" },
    ...(canFin ? [{ key: "kpi", label: "KPI agenție", href: "/crm/rapoarte?tab=kpi" }] : []),
  ];

  return (
    <>
      <PageHeader title="Rapoarte" sub="Analize și statistici pentru decizii mai bune." />
      <Tabs active={tab} items={tabs} />
      {tab === "venituri" && canFin && <Revenue />}
      {tab === "vanzari" && <Sales />}
      {tab === "proiecte" && <Projects />}
      {tab === "echipa" && <Team />}
      {tab === "kpi" && canFin && <Kpis />}
    </>
  );

  async function Revenue() {
    const [series, byService, { data: pays }] = await Promise.all([
      monthlySeries(sb, 12),
      revenueByService(sb, yearStart),
      sb.from("payments").select("amount, clients(name)").gte("paid_at", yearStart.toISOString().slice(0, 10)),
    ]);
    const byClient = new Map<string, number>();
    (pays ?? []).forEach((p) => {
      const n = (p.clients as unknown as { name: string } | null)?.name ?? "Fără client";
      byClient.set(n, (byClient.get(n) ?? 0) + Number(p.amount));
    });
    const top = Array.from(byClient.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const yearTotal = (pays ?? []).reduce((a, p) => a + Number(p.amount), 0);
    return (
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Încasări pe lună (12 luni)"><BarsChart data={series.map((x) => ({ label: x.label, value: Math.round(x.incasari) }))} name="Încasări" money height={280} /></Panel>
        <Panel title={`Venituri pe servicii · ${new Date().getFullYear()}`}><DonutChart data={byService} centerLabel="Total an" /></Panel>
        <Panel title={`Top clienți după încasări · ${new Date().getFullYear()}`} pad={false} className="xl:col-span-2">
          <Table head={["Client", "Încasat", "% din total"]} empty="Nicio încasare anul acesta.">
            {top.map(([n, v]) => (
              <tr key={n}><Td className="font-semibold text-ink">{n}</Td><Td>{formatLei(v)}</Td><Td>{pct(v, yearTotal)}%</Td></tr>
            ))}
          </Table>
        </Panel>
      </div>
    );
  }

  async function Sales() {
    const [f30, f365, { data: leads }] = await Promise.all([salesFunnel(sb, 30), salesFunnel(sb, 365), sb.from("leads").select("source, status, created_at").gte("created_at", subMonths(new Date(), 12).toISOString())]);
    const bySource = new Map<string, { total: number; won: number }>();
    (leads ?? []).forEach((l) => {
      const x = bySource.get(l.source) ?? { total: 0, won: 0 };
      x.total++;
      if (l.status === "castigat") x.won++;
      bySource.set(l.source, x);
    });
    return (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi label="Lead-uri (30 zile)" value={String(f30.steps[0]!.value)} />
          <Kpi label="Conversie lead → client (12 luni)" value={`${f365.leadToClient}%`} />
          <Kpi label="Rată acceptare oferte (12 luni)" value={`${f365.acceptance}%`} />
          <Kpi label="Valoare medie proiect" value={formatLei(f365.avgDeal)} />
        </div>
        <div className="grid gap-6 xl:grid-cols-2">
          <Panel title="Funnel comercial (12 luni)"><BarsChart data={f365.steps.map((x) => ({ label: x.label.split(" ")[0]!, value: x.value }))} name="Număr" /></Panel>
          <Panel title="Lead-uri pe surse (12 luni)" pad={false}>
            <Table head={["Sursă", "Lead-uri", "Câștigate", "Conversie"]} empty="Niciun lead.">
              {Array.from(bySource.entries()).sort((a, b) => b[1].total - a[1].total).map(([k, v]) => (
                <tr key={k}><Td className="font-semibold text-ink">{LEAD_SOURCE[k] ?? k}</Td><Td>{v.total}</Td><Td>{v.won}</Td><Td>{pct(v.won, v.total)}%</Td></tr>
              ))}
            </Table>
          </Panel>
        </div>
      </>
    );
  }

  async function Projects() {
    const { data } = await sb.from("projects").select("status, deadline, start_date, created_at, category");
    const P = data ?? [];
    const active = P.filter((p) => ["de_inceput", "in_lucru", "review"].includes(p.status));
    const late = active.filter((p) => p.deadline && p.deadline < today);
    const done = P.filter((p) => p.status === "finalizat");
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Proiecte în lucru" value={String(active.length)} />
        <Kpi label="Proiecte finalizate" value={String(done.length)} />
        <Kpi label="Proiecte întârziate" value={String(late.length)} tone={late.length ? "red" : undefined} />
        <Kpi label="Rată livrare la timp" value={`${active.length ? 100 - pct(late.length, active.length) : 100}%`} />
      </div>
    );
  }

  async function Team() {
    const since = subMonths(new Date(), 1).toISOString().slice(0, 10);
    const [{ data: people }, { data: tasks }, { data: time }] = await Promise.all([
      sb.from("profiles").select("id, full_name").eq("status", "activ"),
      sb.from("tasks").select("assignee_id, status, deadline, completed_at"),
      sb.from("time_entries").select("profile_id, hours").gte("work_date", since),
    ]);
    return (
      <Panel title="Performanță echipă" pad={false}>
        <Table head={["Angajat", "Task-uri deschise", "Finalizate (30 zile)", "Întârziate", "Ore pontate (30 zile)"]}>
          {(people ?? []).map((p) => {
            const t = (tasks ?? []).filter((x) => x.assignee_id === p.id);
            return (
              <tr key={p.id}>
                <Td className="font-semibold text-ink">{p.full_name}</Td>
                <Td>{t.filter((x) => x.status !== "finalizat").length}</Td>
                <Td>{t.filter((x) => x.status === "finalizat" && x.completed_at && x.completed_at.slice(0, 10) >= since).length}</Td>
                <Td className="font-semibold text-rose-500">{t.filter((x) => x.status !== "finalizat" && x.deadline && x.deadline < today).length || ""}</Td>
                <Td>{(time ?? []).filter((x) => x.profile_id === p.id).reduce((a, x) => a + Number(x.hours), 0)}h</Td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    );
  }

  async function Kpis() {
    const [series, f, out, { data: recurring }, { data: inv }, { data: clientsPaid }, { data: done }] = await Promise.all([
      monthlySeries(sb, 12),
      salesFunnel(sb, 365),
      outstanding(sb),
      sb.from("offer_items").select("quantity, unit_price, offers!inner(status)").eq("recurring", true).eq("offers.status", "acceptata"),
      sb.from("invoices").select("id, status, due_date").not("status", "in", "(draft,anulata)"),
      sb.from("payments").select("client_id, amount"),
      sb.from("projects").select("start_date, updated:deadline, status").eq("status", "finalizat"),
    ]);
    const last = series[series.length - 1]!;
    const year = series.reduce((a, x) => a + x.incasari, 0);
    const costs = series.reduce((a, x) => a + x.cheltuieli, 0);
    const mrr = (recurring ?? []).reduce((a, r) => a + Number(r.quantity) * Number(r.unit_price), 0);
    const clientTotals = new Map<string, number>();
    (clientsPaid ?? []).forEach((p) => p.client_id && clientTotals.set(p.client_id, (clientTotals.get(p.client_id) ?? 0) + Number(p.amount)));
    const clv = clientTotals.size ? Array.from(clientTotals.values()).reduce((a, b) => a + b, 0) / clientTotals.size : 0;
    const overdueRate = pct(out.overdueCount, (inv ?? []).length);
    const durations = (done ?? []).filter((p) => p.start_date && p.updated).map((p) => (new Date(p.updated!).getTime() - new Date(p.start_date!).getTime()) / 864e5);
    const avgDays = durations.length ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;
    return (
      <>
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          <Kpi label="Monthly Revenue (luna curentă)" value={formatLei(last.incasari)} />
          <Kpi label="Recurring Revenue (MRR, fără TVA)" value={formatLei(mrr)} />
          <Kpi label="Average Project Value" value={formatLei(f.avgDeal)} />
          <Kpi label="Lead Conversion Rate" value={`${f.leadToClient}%`} />
          <Kpi label="Proposal Acceptance Rate" value={`${f.acceptance}%`} />
          <Kpi label="Profit Margin (12 luni)" value={`${year ? pct(year - costs, year) : 0}%`} />
          <Kpi label="Client Lifetime Value" value={formatLei(clv)} />
          <Kpi label="Project Delivery Time" value={`${avgDays} zile`} hint="medie, proiecte finalizate" />
          <Kpi label="Overdue Invoice Rate" value={`${overdueRate}%`} tone={overdueRate > 10 ? "red" : undefined} />
          <Kpi label="De încasat" value={formatLei(out.total)} />
        </div>
        <Panel title="Încasări vs. cheltuieli (12 luni)">
          <TrendChart data={series} series={[{ key: "incasari", name: "Încasări", color: "#2B4CF5" }, { key: "cheltuieli", name: "Cheltuieli", color: "#E040C8" }]} />
        </Panel>
      </>
    );
  }
}
