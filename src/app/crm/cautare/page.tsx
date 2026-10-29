import Link from "next/link";
import { getSession } from "@/lib/crm/auth";
import { PageHeader, Panel, StatusBadge } from "@/components/crm/ui";
import { CLIENT_STATUS, LEAD_STATUS, OFFER_STATUS, PROJECT_STATUS } from "@/lib/crm/constants";
import { likeTerm } from "@/lib/crm/queries";
import { formatLei } from "@/lib/utils";

export const metadata = { title: "Căutare" };

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const s = await getSession();
  const q = (searchParams.q ?? "").trim();
  if (q.length < 2) return <PageHeader title="Căutare" sub="Scrie cel puțin 2 caractere în bara de căutare." />;
  const t = likeTerm(q);
  const [clients, leads, offers, projects, tasks] = await Promise.all([
    s.can("clienti") ? s.sb.from("clients").select("id, name, status, email").or(`name.ilike.${t},email.ilike.${t},cui.ilike.${t},phone.ilike.${t},contact_name.ilike.${t}`).limit(10) : Promise.resolve({ data: [] }),
    s.can("leads") ? s.sb.from("leads").select("id, name, company, status").or(`name.ilike.${t},company.ilike.${t},email.ilike.${t},phone.ilike.${t}`).limit(10) : Promise.resolve({ data: [] }),
    s.can("oferte") ? s.sb.from("offers").select("id, number, title, status, total").or(`number.ilike.${t},title.ilike.${t}`).limit(10) : Promise.resolve({ data: [] }),
    s.sb.from("projects").select("id, name, status").ilike("name", t).limit(10),
    s.sb.from("tasks").select("id, title, status").ilike("title", t).limit(10),
  ]);
  const groups = [
    { title: "Clienți", rows: (clients.data ?? []).map((c) => ({ href: `/crm/clienti/${c.id}`, label: c.name, sub: c.email, badge: <StatusBadge map={CLIENT_STATUS} value={c.status} /> })) },
    { title: "Lead-uri", rows: (leads.data ?? []).map((l) => ({ href: `/crm/leaduri/${l.id}`, label: l.name, sub: l.company, badge: <StatusBadge map={LEAD_STATUS} value={l.status} /> })) },
    { title: "Oferte", rows: (offers.data ?? []).map((o) => ({ href: `/crm/oferte/${o.id}`, label: `${o.number} · ${o.title}`, sub: formatLei(o.total), badge: <StatusBadge map={OFFER_STATUS} value={o.status} /> })) },
    { title: "Proiecte", rows: (projects.data ?? []).map((p) => ({ href: `/crm/proiecte/${p.id}`, label: p.name, sub: null, badge: <StatusBadge map={PROJECT_STATUS} value={p.status} /> })) },
    { title: "Task-uri", rows: (tasks.data ?? []).map((x) => ({ href: `/crm/taskuri/${x.id}`, label: x.title, sub: null, badge: null })) },
  ].filter((g) => g.rows.length);

  return (
    <>
      <PageHeader title={`Rezultate pentru „${q}”`} />
      {!groups.length && <p className="text-sm text-muted">Niciun rezultat.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        {groups.map((g) => (
          <Panel key={g.title} title={g.title} pad={false}>
            <ul className="divide-y divide-line">
              {g.rows.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-soft/60">
                    <span><span className="block text-sm font-semibold text-ink">{r.label}</span>{r.sub && <span className="block text-xs text-muted">{r.sub}</span>}</span>
                    {r.badge}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </>
  );
}
