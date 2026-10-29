import Link from "next/link";
import { Plus } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { Avatar, Field, Input, PageHeader, Panel, Select, StatusBadge, Table, Td, Tabs, Textarea, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, SubmitButton } from "@/components/crm/client-ui";
import { PRIORITY, TASK_STATUS } from "@/lib/crm/constants";
import { createTask, setTaskStatus } from "../actions/projects";
import { getProjectsOptions, getStaff } from "@/lib/crm/queries";
import { cn, formatDate } from "@/lib/utils";

export const metadata = { title: "Task-uri" };

export default async function TasksPage({ searchParams }: { searchParams: { tab?: string; status?: string } }) {
  const s = await getSession();
  const tab = searchParams.tab ?? (s.can("proiecte_toate") ? "toate" : "mele");
  let q = s.sb.from("tasks").select("id, title, status, priority, deadline, projects(id, name, clients(name)), assignee:assignee_id(full_name, avatar_url)").order("deadline", { ascending: true, nullsFirst: false }).limit(400);
  if (tab === "mele") q = q.eq("assignee_id", s.userId);
  if (tab === "review") q = q.eq("status", "review");
  if (tab === "neatribuite") q = q.is("assignee_id", null);
  if (searchParams.status) q = q.eq("status", searchParams.status);
  else if (tab !== "review") q = q.neq("status", "finalizat");
  const [{ data }, staff, projects] = await Promise.all([q, getStaff(s.sb), getProjectsOptions(s.sb)]);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title="Task-uri" sub="Atribuiri, deadline-uri și status. Task-urile finalizate de echipă trec prin review." />
      <Tabs
        active={tab}
        items={[
          ...(s.can("proiecte_toate") ? [{ key: "toate", label: "Toate", href: "/crm/taskuri?tab=toate" }] : []),
          { key: "mele", label: "Atribuite mie", href: "/crm/taskuri?tab=mele" },
          { key: "review", label: "În review", href: "/crm/taskuri?tab=review" },
          ...(s.can("proiecte_toate") ? [{ key: "neatribuite", label: "Neatribuite", href: "/crm/taskuri?tab=neatribuite" }] : []),
        ]}
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <Panel pad={false}>
          <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3 text-xs">
            <Link href={`/crm/taskuri?tab=${tab}`} className={cn("rounded-full px-3 py-1 font-semibold", !searchParams.status ? "bg-brand-blue text-white" : "bg-soft text-body")}>Deschise</Link>
            {Object.entries(TASK_STATUS).map(([k, v]) => (
              <Link key={k} href={`/crm/taskuri?tab=${tab}&status=${k}`} className={cn("rounded-full px-3 py-1 font-semibold", searchParams.status === k ? "bg-brand-blue text-white" : "bg-soft text-body")}>{v.label}</Link>
            ))}
          </div>
          <Table head={["Task", "Proiect", "Responsabil", "Prioritate", "Deadline", "Status"]} empty="Niciun task aici.">
            {(data ?? []).map((t) => {
              const pr = t.projects as unknown as { id: string; name: string; clients: { name: string } | null } | null;
              const as = t.assignee as unknown as { full_name: string; avatar_url: string | null } | null;
              const late = t.deadline && t.deadline < today && t.status !== "finalizat";
              return (
                <tr key={t.id} className="hover:bg-soft/50">
                  <Td><Link href={`/crm/taskuri/${t.id}`} className="font-semibold text-ink hover:text-brand-blue">{t.title}</Link></Td>
                  <Td className="text-xs">{pr ? <Link href={`/crm/proiecte/${pr.id}`} className="hover:text-brand-blue">{pr.name}</Link> : "—"}{pr?.clients && <p className="text-muted">{pr.clients.name}</p>}</Td>
                  <Td>{as ? <span className="flex items-center gap-2"><Avatar name={as.full_name} src={as.avatar_url} size={26} /><span className="text-xs">{as.full_name}</span></span> : <span className="text-xs text-muted">—</span>}</Td>
                  <Td><StatusBadge map={PRIORITY} value={t.priority} /></Td>
                  <Td className={cn("text-xs", late && "font-bold text-rose-500")}>{formatDate(t.deadline)}</Td>
                  <Td><AutoSubmitSelect name="status" defaultValue={t.status} options={optionsFrom(TASK_STATUS)} action={setTaskStatus} hidden={{ id: t.id }} /></Td>
                </tr>
              );
            })}
          </Table>
        </Panel>
        {s.can("taskuri") && (
          <Panel title={<span className="flex items-center gap-2"><Plus className="h-4 w-4" /> Task nou</span>}>
            <form action={createTask} className="space-y-3">
              <Field label="Titlu *"><Input name="title" required /></Field>
              <Field label="Proiect"><Select name="project_id" options={projects} placeholder="Fără proiect" /></Field>
              <Field label="Responsabil"><Select name="assignee_id" options={staff.map((p) => ({ value: p.id, label: p.full_name }))} placeholder="Neatribuit" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Prioritate"><Select name="priority" options={optionsFrom(PRIORITY)} defaultValue="medie" /></Field>
                <Field label="Deadline"><Input name="deadline" type="date" /></Field>
              </div>
              <Field label="Ore estimate"><Input name="estimated_hours" type="number" step="0.5" min={0} /></Field>
              <Field label="Descriere"><Textarea name="description" rows={3} /></Field>
              <SubmitButton className="w-full">Creează task</SubmitButton>
            </form>
          </Panel>
        )}
      </div>
    </>
  );
}
