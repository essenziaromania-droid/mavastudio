import Link from "next/link";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { ArrowRight } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { delta, financeForRange, monthRange, monthlySeries, outstanding, revenueByService, salesFunnel } from "@/lib/crm/metrics";
import { Kpi, Panel, StatusBadge, Avatar } from "@/components/crm/ui";
import { DonutChart, TrendChart } from "@/components/crm/charts";
import { PRIORITY, TASK_STATUS } from "@/lib/crm/constants";
import { formatDate, formatLei, cn } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

const RANGES: Record<string, number> = { "6": 6, "12": 12 };
const FUNNEL: Record<string, number> = { "7": 7, "30": 30, "90": 90, "365": 365 };

export default async function Dashboard({ searchParams }: { searchParams: { luni?: string; funnel?: string; forbidden?: string } }) {
  const s = await getSession();
  const { sb } = s;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Bună dimineața" : hour < 18 ? "Bună ziua" : "Bună seara";
  const firstName = s.profile.full_name.split(" ")[0] || "";
  const canFin = s.can("financiar");
  const canSales = s.can("leads") || s.can("oferte");
  const months = RANGES[searchParams.luni ?? "12"] ?? 12;
  const funnelDays = FUNNEL[searchParams.funnel ?? "30"] ?? 30;
  const today = format(new Date(), "yyyy-MM-dd");

  const [cur, prev, out, series, byService, funnel] = canFin
    ? await Promise.all([
        financeForRange(sb, monthRange(0).from, monthRange(0).to),
        financeForRange(sb, monthRange(1).from, monthRange(1).to),
        outstanding(sb),
        monthlySeries(sb, months),
        revenueByService(sb, new Date(new Date().getFullYear(), 0, 1)),
        canSales ? salesFunnel(sb, funnelDays) : Promise.resolve(null),
      ])
    : [null, null, null, null, null, canSales ? await salesFunnel(sb, funnelDays) : null];

  const [myTasks, activeProjects, lateProjects, newLeads, offersSent, events] = await Promise.all([
    sb.from("tasks").select("id, title, status, priority, deadline, projects(name)").eq("assignee_id", s.userId).neq("status", "finalizat").order("deadline", { ascending: true, nullsFirst: false }).limit(7),
    sb.from("projects").select("id", { count: "exact", head: true }).in("status", ["de_inceput", "in_lucru", "review"]),
    sb.from("projects").select("id", { count: "exact", head: true }).in("status", ["de_inceput", "in_lucru", "review"]).lt("deadline", today),
    canSales ? sb.from("leads").select("id", { count: "exact", head: true }).gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()) : Promise.resolve({ count: null }),
    s.can("oferte") ? sb.from("offers").select("total").neq("status", "draft").gte("created_at", new Date(Date.now() - 30 * 864e5).toISOString()) : Promise.resolve({ data: null }),
    s.can("calendar") ? sb.from("events").select("id, title, start_at, type").gte("start_at", new Date().toISOString()).order("start_at").limit(5) : Promise.resolve({ data: null }),
  ]);

  const maxFunnel = Math.max(1, ...(funnel?.steps.map((x) => x.value) ?? [1]));

  return (
    <>
      {searchParams.forbidden && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Nu ai acces la secțiunea solicitată. Contactează administratorul dacă ai nevoie de permisiuni.</p>}
      <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-extrabold md:text-[28px]">{greet}, {firstName}!</h1>
          <p className="mt-1 text-sm text-body">Iată rezumatul activității MAVA Studio.</p>
        </div>
        <span className="rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold capitalize text-ink">{format(new Date(), "LLLL yyyy", { locale: ro })}</span>
      </div>

      {canFin && cur && prev && out && (
        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Kpi label="Încasări luna curentă" value={formatLei(cur.incasari)} delta={delta(cur.incasari, prev.incasari)} hint="vs. luna trecută" />
          <Kpi label="Facturat" value={formatLei(cur.facturat)} delta={delta(cur.facturat, prev.facturat)} />
          <Kpi label="De încasat" value={formatLei(out.total)} hint={out.overdueCount ? `${out.overdueCount} restante` : "nimic restant"} />
          <Kpi label="Cheltuieli" value={formatLei(cur.cheltuieli)} delta={delta(cur.cheltuieli, prev.cheltuieli)} invert />
          <Kpi label="Profit estimat" value={formatLei(cur.profit)} delta={delta(cur.profit, prev.profit)} />
        </div>
      )}

      {canFin && series && byService && (
        <div className="mb-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          <Panel
            title="Evoluția încasărilor"
            actions={
              <div className="flex gap-1 rounded-lg bg-soft p-0.5 text-xs font-semibold">
                {Object.keys(RANGES).map((k) => (
                  <Link key={k} href={`/crm?luni=${k}&funnel=${funnelDays}`} className={cn("rounded-md px-2.5 py-1", String(months) === k ? "bg-white text-brand-blue shadow-sm" : "text-muted")}>
                    {k} luni
                  </Link>
                ))}
              </div>
            }
          >
            <TrendChart data={series} series={[{ key: "incasari", name: "Încasări", color: "#2B4CF5" }, { key: "cheltuieli", name: "Cheltuieli", color: "#E040C8" }]} />
          </Panel>
          <Panel title={`Venituri pe servicii · ${new Date().getFullYear()}`}>
            <DonutChart data={byService} centerLabel="Total" />
          </Panel>
        </div>
      )}

      {funnel && (
        <Panel
          className="mb-6"
          title="Funnel comercial"
          actions={
            <div className="flex gap-1 rounded-lg bg-soft p-0.5 text-xs font-semibold">
              {Object.keys(FUNNEL).map((k) => (
                <Link key={k} href={`/crm?luni=${months}&funnel=${k}`} className={cn("rounded-md px-2.5 py-1", String(funnelDays) === k ? "bg-white text-brand-blue shadow-sm" : "text-muted")}>
                  {k === "365" ? "1 an" : `${k} zile`}
                </Link>
              ))}
            </div>
          }
        >
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-2.5">
              {funnel.steps.map((st, i) => (
                <div key={st.label} className="flex items-center gap-3">
                  <span className="w-36 shrink-0 text-sm text-body">{st.label}</span>
                  <div className="h-7 flex-1 rounded-lg bg-soft">
                    <div className="flex h-full items-center justify-end rounded-lg pr-2 text-xs font-bold text-white" style={{ width: `${Math.max(6, (st.value / maxFunnel) * 100)}%`, background: `linear-gradient(90deg,#2B4CF5,${["#2B4CF5", "#3D5AFE", "#5B5CF6", "#7C3AED", "#9D3BEF", "#B23CF0"][i]})` }}>
                      {st.value}
                    </div>
                  </div>
                  <span className="w-12 text-right text-xs text-muted">{i > 0 && funnel.steps[i - 1]!.value ? `${Math.round((st.value / funnel.steps[i - 1]!.value) * 100)}%` : ""}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 self-start">
              <MiniStat label="Conversie lead → client" value={`${funnel.leadToClient}%`} />
              <MiniStat label="Rată acceptare oferte" value={`${funnel.acceptance}%`} />
              <MiniStat label="Valoare oferte trimise" value={formatLei(funnel.sentValue)} />
              <MiniStat label="Valoare medie proiect" value={formatLei(funnel.avgDeal)} />
            </div>
          </div>
        </Panel>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        {canSales && <Kpi label="Lead-uri noi (30 zile)" value={String(newLeads.count ?? 0)} />}
        {s.can("oferte") && <Kpi label="Oferte trimise (30 zile)" value={String(offersSent.data?.length ?? 0)} hint={formatLei((offersSent.data ?? []).reduce((a, o) => a + Number(o.total), 0))} />}
        <Kpi label="Proiecte active" value={String(activeProjects.count ?? 0)} />
        <Kpi label="Proiecte întârziate" value={String(lateProjects.count ?? 0)} tone={lateProjects.count ? "red" : undefined} />
        {canFin && out && <Kpi label="Facturi restante" value={String(out.overdueCount)} hint={formatLei(out.overdue)} tone={out.overdueCount ? "red" : undefined} />}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title="Task-urile mele" actions={<Link href="/crm/taskuri?tab=mele" className="text-xs font-semibold text-brand-blue">Vezi toate →</Link>} pad={false}>
          <ul className="divide-y divide-line">
            {(myTasks.data ?? []).map((t) => {
              const late = t.deadline && t.deadline < today;
              return (
                <li key={t.id}>
                  <Link href={`/crm/taskuri/${t.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-soft/60">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink">{t.title}</p>
                      <p className="truncate text-xs text-muted">{(t.projects as unknown as { name: string } | null)?.name ?? "Fără proiect"}</p>
                    </div>
                    <StatusBadge map={PRIORITY} value={t.priority} />
                    <StatusBadge map={TASK_STATUS} value={t.status} />
                    <span className={cn("w-20 text-right text-xs", late ? "font-bold text-rose-500" : "text-muted")}>{formatDate(t.deadline)}</span>
                  </Link>
                </li>
              );
            })}
            {!myTasks.data?.length && <li className="px-5 py-10 text-center text-sm text-muted">Nu ai task-uri deschise. 🎉</li>}
          </ul>
        </Panel>
        {events.data && (
          <Panel title="Urmează în calendar" actions={<Link href="/crm/calendar" className="text-xs font-semibold text-brand-blue">Calendar →</Link>}>
            <ul className="space-y-3">
              {events.data.map((e) => (
                <li key={e.id} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
                    <span className="text-[10px] font-semibold uppercase">{format(new Date(e.start_at), "LLL", { locale: ro })}</span>
                    <span className="text-sm font-extrabold leading-none">{format(new Date(e.start_at), "d")}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{e.title}</p>
                    <p className="text-xs text-muted">{format(new Date(e.start_at), "EEEE, HH:mm", { locale: ro })}</p>
                  </div>
                </li>
              ))}
              {!events.data.length && <li className="py-6 text-center text-sm text-muted">Niciun eveniment programat.</li>}
            </ul>
          </Panel>
        )}
      </div>
      {!canFin && !canSales && (
        <p className="mt-6 text-xs text-muted">
          <Avatar name={s.profile.full_name} size={18} /> Vezi task-urile și proiectele atribuite ție. <Link href="/crm/proiecte" className="text-brand-blue">Proiectele mele <ArrowRight className="inline h-3 w-3" /></Link>
        </p>
      )}
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-soft p-3">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-0.5 font-display text-lg font-extrabold text-ink">{value}</p>
    </div>
  );
}
