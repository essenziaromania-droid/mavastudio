import Link from "next/link";
import { Plus } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { Avatar, PageHeader, Panel, StatusBadge, Table, Td, Tabs } from "@/components/crm/ui";
import { CLIENT_STATUS } from "@/lib/crm/constants";
import { formatLei } from "@/lib/utils";
import { likeTerm } from "@/lib/crm/queries";
import { PROJECT_TYPES } from "@/content/site";

export const metadata = { title: "Clienți" };

export default async function ClientsPage({ searchParams }: { searchParams: { status?: string; q?: string } }) {
  const s = await requireModule("clienti");
  const status = searchParams.status ?? "toti";
  let q = s.sb.from("clients").select("id, name, type, email, phone, contact_name, status, projects(category, value), contracts(value, status)").order("created_at", { ascending: false }).limit(500);
  if (status !== "toti") q = q.eq("status", status);
  if (searchParams.q) {
    const t = likeTerm(searchParams.q);
    q = q.or(`name.ilike.${t},email.ilike.${t},phone.ilike.${t},cui.ilike.${t},contact_name.ilike.${t}`);
  }
  const { data: clients } = await q;
  const { data: all } = await s.sb.from("clients").select("status");
  const cnt = (k: string) => (all ?? []).filter((c) => c.status === k).length;
  const catLabel: Record<string, string> = { ...Object.fromEntries(PROJECT_TYPES.map((t) => [t.value, t.label])), social: "Social Media", ai: "Foto & Video AI" };

  return (
    <>
      <PageHeader title="Clienți" actions={<Link href="/crm/clienti/nou" className="btn-primary !py-2.5"><Plus className="h-4 w-4" /> Adaugă client</Link>} />
      <Tabs
        active={status}
        items={[
          { key: "toti", label: "Toți", href: "/crm/clienti", count: all?.length ?? 0 },
          { key: "lead", label: "Lead-uri", href: "/crm/clienti?status=lead", count: cnt("lead") },
          { key: "prospect", label: "Prospecți", href: "/crm/clienti?status=prospect", count: cnt("prospect") },
          { key: "activ", label: "Clienți activi", href: "/crm/clienti?status=activ", count: cnt("activ") },
          { key: "inactiv", label: "Clienți inactivi", href: "/crm/clienti?status=inactiv", count: cnt("inactiv") },
        ]}
      />
      <Panel pad={false}>
        <form className="flex gap-3 border-b border-line p-4">
          <input type="hidden" name="status" value={status} />
          <input name="q" defaultValue={searchParams.q} placeholder="Caută clienți, email, telefon, CUI..." className="flex-1 rounded-xl border border-line px-3.5 py-2 text-sm outline-none focus:border-brand-blue" />
          <button className="btn-ghost btn-sm">Caută</button>
        </form>
        <Table head={["Nume / Firmă", "Contact", "Status", "Servicii", "Valoare contracte"]} empty="Niciun client găsit.">
          {(clients ?? []).map((c) => {
            const cats = Array.from(new Set(((c.projects as { category: string | null }[]) ?? []).map((p) => p.category).filter(Boolean))) as string[];
            const value = ((c.contracts as { value: number; status: string }[]) ?? []).filter((x) => x.status === "semnat").reduce((a, x) => a + Number(x.value), 0);
            return (
              <tr key={c.id} className="hover:bg-soft/50">
                <Td>
                  <Link href={`/crm/clienti/${c.id}`} className="flex items-center gap-3">
                    <Avatar name={c.name} size={34} />
                    <span>
                      <span className="block font-semibold text-ink hover:text-brand-blue">{c.name}</span>
                      {c.contact_name && <span className="block text-xs text-muted">{c.contact_name}</span>}
                    </span>
                  </Link>
                </Td>
                <Td><p className="text-xs">{c.email}</p><p className="text-xs text-muted">{c.phone}</p></Td>
                <Td><StatusBadge map={CLIENT_STATUS} value={c.status} /></Td>
                <Td className="text-xs">{cats.map((x) => catLabel[x] ?? x).join(", ") || "—"}</Td>
                <Td className="font-semibold">{value ? formatLei(value) : "—"}</Td>
              </tr>
            );
          })}
        </Table>
      </Panel>
    </>
  );
}
