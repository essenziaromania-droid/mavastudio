import Link from "next/link";
import { LayoutList, Columns3, Plus } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { redirect } from "next/navigation";
import { PageHeader, Panel, ProgressBar, StatusBadge, Table, Td } from "@/components/crm/ui";
import { Kanban } from "@/components/crm/kanban";
import { PROJECT_STATUS, SERVICE_CATEGORY } from "@/lib/crm/constants";
import { setProjectStatus } from "../actions/projects";
import { cn, formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Proiecte" };

export default async function ProjectsPage({ searchParams }: { searchParams: { view?: string; arhiva?: string } }) {
  const s = await getSession();
  if (!s.can("proiecte") && !s.can("proiecte_toate")) redirect("/crm?forbidden=1");
  const view = searchParams.view === "lista" ? "lista" : "kanban";
  let q = s.sb.from("projects").select("id, name, status, progress, category, value, deadline, clients(name), manager:manager_id(full_name), project_members(profiles(full_name))").order("deadline", { ascending: true, nullsFirst: false });
  if (!searchParams.arhiva) q = q.neq("status", "anulat");
  const { data } = await q;
  const today = new Date().toISOString().slice(0, 10);
  const rows = (data ?? []).map((p) => ({
    ...p,
    clientName: (p.clients as unknown as { name: string } | null)?.name,
    people: [((p.manager as unknown as { full_name: string } | null)?.full_name), ...((p.project_members as unknown as { profiles: { full_name: string } | null }[]) ?? []).map((m) => m.profiles?.full_name)].filter(Boolean) as string[],
    late: Boolean(p.deadline && p.deadline < today && p.status !== "finalizat"),
  }));

  return (
    <>
      <PageHeader
        title="Proiecte"
        actions={
          <>
            <div className="flex rounded-xl border border-line bg-white p-1">
              <Link href="/crm/proiecte?view=lista" className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold", view === "lista" ? "bg-blue-50 text-brand-blue" : "text-muted")}><LayoutList className="h-4 w-4" /> Listă</Link>
              <Link href="/crm/proiecte" className={cn("flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold", view === "kanban" ? "bg-blue-50 text-brand-blue" : "text-muted")}><Columns3 className="h-4 w-4" /> Kanban</Link>
            </div>
            {s.can("proiecte_toate") && <Link href="/crm/proiecte/nou" className="btn-primary !py-2.5"><Plus className="h-4 w-4" /> Proiect nou</Link>}
          </>
        }
      />
      {view === "kanban" ? (
        <Kanban
          move={setProjectStatus}
          columns={[{ key: "de_inceput", label: "De început" }, { key: "in_lucru", label: "În lucru" }, { key: "review", label: "Review" }, { key: "finalizat", label: "Finalizat" }]}
          cards={rows.map((p) => ({ id: p.id, status: p.status, title: p.name, subtitle: p.clientName, href: `/crm/proiecte/${p.id}`, progress: p.progress, date: p.deadline, late: p.late, people: p.people }))}
        />
      ) : (
        <Panel pad={false}>
          <Table head={["Proiect", "Client", "Serviciu", "Status", "Progres", "Valoare", "Deadline"]} empty="Niciun proiect.">
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/proiecte/${p.id}`} className="font-semibold text-ink hover:text-brand-blue">{p.name}</Link></Td>
                <Td>{p.clientName ?? "—"}</Td>
                <Td className="text-xs">{SERVICE_CATEGORY[p.category ?? ""]?.label ?? "—"}</Td>
                <Td><StatusBadge map={PROJECT_STATUS} value={p.status} /></Td>
                <Td className="w-40"><ProgressBar value={p.progress} /><span className="text-[11px] text-muted">{p.progress}%</span></Td>
                <Td>{formatLei(p.value)}</Td>
                <Td className={cn("text-xs", p.late && "font-bold text-rose-500")}>{formatDate(p.deadline)}</Td>
              </tr>
            ))}
          </Table>
        </Panel>
      )}
      <p className="mt-4 text-xs text-muted">Trage cardurile între coloane pentru a schimba statusul. {!searchParams.arhiva && <Link href={`/crm/proiecte?view=${view}&arhiva=1`} className="text-brand-blue">Arată și proiectele anulate</Link>}</p>
    </>
  );
}
