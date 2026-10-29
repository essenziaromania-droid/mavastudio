import Link from "next/link";
import { Plus } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { PageHeader, Panel, StatusBadge, Table, Td, Tabs, Badge, Select } from "@/components/crm/ui";
import { LEAD_SOURCE, LEAD_STATUS } from "@/lib/crm/constants";
import { PROJECT_TYPES } from "@/content/site";
import { formatDate } from "@/lib/utils";
import { likeTerm } from "@/lib/crm/queries";

export const metadata = { title: "Lead-uri" };

export default async function LeadsPage({ searchParams }: { searchParams: { status?: string; sursa?: string; q?: string } }) {
  const { sb } = await requireModule("leads");
  const status = searchParams.status ?? "activi";

  let q = sb.from("leads").select("id, name, company, email, phone, services, budget, source, status, created_at, profiles:assigned_to(full_name)").order("created_at", { ascending: false }).limit(300);
  if (status === "activi") q = q.not("status", "in", "(castigat,pierdut)");
  else if (status !== "toate") q = q.eq("status", status);
  if (searchParams.sursa) q = q.eq("source", searchParams.sursa);
  if (searchParams.q) q = q.or(`name.ilike.${likeTerm(searchParams.q)},company.ilike.${likeTerm(searchParams.q)},email.ilike.${likeTerm(searchParams.q)},phone.ilike.${likeTerm(searchParams.q)}`);
  const { data: leads } = await q;

  const { data: counts } = await sb.from("leads").select("status");
  const count = (s: string) => (counts ?? []).filter((r) => r.status === s).length;
  const tab = (key: string) => `/crm/leaduri?status=${key}${searchParams.sursa ? `&sursa=${searchParams.sursa}` : ""}`;
  const serviceLabel = Object.fromEntries(PROJECT_TYPES.map((t) => [t.value, t.label]));

  return (
    <>
      <PageHeader title="Lead-uri" sub="Toate oportunitățile, din site, social media, recomandări sau adăugate manual." actions={<Link href="/crm/leaduri/nou" className="btn-primary !py-2.5"><Plus className="h-4 w-4" /> Adaugă lead</Link>} />
      <Tabs
        active={status}
        items={[
          { key: "activi", label: "Active", href: tab("activi"), count: (counts ?? []).filter((r) => !["castigat", "pierdut"].includes(r.status)).length },
          ...Object.entries(LEAD_STATUS).map(([k, v]) => ({ key: k, label: v.label, href: tab(k), count: count(k) })),
          { key: "toate", label: "Toate", href: tab("toate"), count: counts?.length ?? 0 },
        ]}
      />
      <Panel pad={false}>
        <form className="flex flex-wrap gap-3 border-b border-line p-4">
          <input type="hidden" name="status" value={status} />
          <input name="q" defaultValue={searchParams.q} placeholder="Caută nume, firmă, email, telefon..." className="min-w-[220px] flex-1 rounded-xl border border-line px-3.5 py-2 text-sm outline-none focus:border-brand-blue" />
          <Select name="sursa" defaultValue={searchParams.sursa ?? ""} options={LEAD_SOURCE} placeholder="Toate sursele" className="!w-48 !py-2" />
          <button className="btn-ghost btn-sm">Filtrează</button>
        </form>
        <Table head={["Nume / Firmă", "Contact", "Servicii", "Buget", "Sursă", "Status", "Responsabil", "Primit"]} empty="Niciun lead în această categorie.">
          {(leads ?? []).map((l) => (
            <tr key={l.id} className="hover:bg-soft/50">
              <Td>
                <Link href={`/crm/leaduri/${l.id}`} className="font-semibold text-ink hover:text-brand-blue">{l.name}</Link>
                {l.company && <p className="text-xs text-muted">{l.company}</p>}
              </Td>
              <Td><p className="text-xs">{l.email}</p><p className="text-xs text-muted">{l.phone}</p></Td>
              <Td className="max-w-[220px] whitespace-normal"><div className="flex flex-wrap gap-1">{(l.services as string[]).map((s) => <Badge key={s} tone="blue">{serviceLabel[s] ?? s}</Badge>)}</div></Td>
              <Td className="text-xs">{l.budget ?? "—"}</Td>
              <Td className="text-xs">{LEAD_SOURCE[l.source] ?? l.source}</Td>
              <Td><StatusBadge map={LEAD_STATUS} value={l.status} /></Td>
              <Td className="text-xs">{(l.profiles as unknown as { full_name: string } | null)?.full_name ?? "—"}</Td>
              <Td className="text-xs text-muted">{formatDate(l.created_at)}</Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
