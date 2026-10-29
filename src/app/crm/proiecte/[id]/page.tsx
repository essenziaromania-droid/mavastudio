import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Plus } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { Avatar, Field, Input, KeyVal, PageHeader, Panel, ProgressBar, Select, StatusBadge, Table, Td, Tabs, Textarea, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { Kanban } from "@/components/crm/kanban";
import { NoteForm, Timeline, type ActivityRow } from "@/components/crm/timeline";
import { FilesBrowser } from "@/components/crm/files-browser";
import { EXPENSE_CATEGORY, INVOICE_STATUS, PRIORITY, PROJECT_STATUS, SERVICE_CATEGORY, TASK_STATUS } from "@/lib/crm/constants";
import { addMilestone, createTask, deleteMilestone, deleteProject, setMembers, setProjectStatus, setTaskStatus, updateProject } from "../../actions/projects";
import { getClientsOptions, getStaff } from "@/lib/crm/queries";
import { cn, formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Proiect" };

const PRIO_CLS: Record<string, string> = { scazuta: "bg-slate-100 text-slate-600", medie: "bg-blue-50 text-blue-700", ridicata: "bg-amber-50 text-amber-700", urgenta: "bg-rose-50 text-rose-600" };

export default async function ProjectPage({ params, searchParams }: { params: { id: string }; searchParams: { tab?: string } }) {
  const s = await getSession();
  const { sb } = s;
  const { data: p } = await sb.from("projects").select("*, clients(id, name), manager:manager_id(id, full_name), contracts(id, number), project_members(profile_id, profiles(full_name, role))").eq("id", params.id).maybeSingle();
  if (!p) notFound();
  const tab = searchParams.tab ?? "prezentare";
  const canManage = s.can("proiecte_toate");
  const canFin = s.can("financiar");
  const base = `/crm/proiecte/${p.id}`;
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: tasks }, staff] = await Promise.all([
    sb.from("tasks").select("id, title, status, priority, deadline, assignee:assignee_id(full_name)").eq("project_id", p.id).order("sort").order("created_at"),
    getStaff(sb),
  ]);
  const members = ((p.project_members as unknown as { profile_id: string; profiles: { full_name: string; role: string } | null }[]) ?? []);
  const manager = p.manager as unknown as { id: string; full_name: string } | null;
  const client = p.clients as unknown as { id: string; name: string } | null;

  return (
    <>
      <PageHeader
        back={{ href: "/crm/proiecte", label: "Proiecte" }}
        title={<span className="flex items-center gap-3">{p.name} <StatusBadge map={PROJECT_STATUS} value={p.status} /></span>}
        sub={<>{client ? <Link href={`/crm/clienti/${client.id}`} className="text-brand-blue">{client.name}</Link> : "Proiect intern"} · {SERVICE_CATEGORY[p.category ?? ""]?.label ?? "—"} · deadline {formatDate(p.deadline)}</>}
        actions={
          <>
            {canManage && <AutoSubmitSelect name="status" defaultValue={p.status} options={optionsFrom(PROJECT_STATUS)} action={setProjectStatus} hidden={{ id: p.id }} className="!py-2.5 !text-sm" />}
            {p.drive_folder_url && <a href={p.drive_folder_url} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> Google Drive</a>}
          </>
        }
      />
      <Tabs
        active={tab}
        items={[
          { key: "prezentare", label: "Prezentare", href: base },
          { key: "taskuri", label: "Task-uri (Kanban)", href: `${base}?tab=taskuri`, count: tasks?.length },
          ...(canFin ? [{ key: "financiar", label: "Plăți & profitabilitate", href: `${base}?tab=financiar` }] : []),
          { key: "fisiere", label: "Fișiere", href: `${base}?tab=fisiere` },
          { key: "activitate", label: "Activitate", href: `${base}?tab=activitate` },
          ...(canManage ? [{ key: "setari", label: "Setări", href: `${base}?tab=setari` }] : []),
        ]}
      />

      {tab === "prezentare" && (
        <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
          <Panel title="Task-uri" pad={false}>
            <ul className="divide-y divide-line">
              {(tasks ?? []).map((t) => {
                const late = t.deadline && t.deadline < today && t.status !== "finalizat";
                return (
                  <li key={t.id} className="flex items-center gap-3 px-5 py-3">
                    <Link href={`/crm/taskuri/${t.id}`} className={cn("min-w-0 flex-1 truncate text-sm font-semibold hover:text-brand-blue", t.status === "finalizat" ? "text-muted line-through" : "text-ink")}>{t.title}</Link>
                    <span className="hidden text-xs text-muted sm:block">{(t.assignee as unknown as { full_name: string } | null)?.full_name ?? "Neatribuit"}</span>
                    <StatusBadge map={PRIORITY} value={t.priority} />
                    <AutoSubmitSelect name="status" defaultValue={t.status} options={optionsFrom(TASK_STATUS)} action={setTaskStatus} hidden={{ id: t.id }} />
                    <span className={cn("w-20 text-right text-xs", late ? "font-bold text-rose-500" : "text-muted")}>{formatDate(t.deadline)}</span>
                  </li>
                );
              })}
              {!tasks?.length && <li className="px-5 py-8 text-center text-sm text-muted">Niciun task încă.</li>}
            </ul>
            {s.can("taskuri") && (
              <form action={createTask} className="grid gap-2 border-t border-line p-4 sm:grid-cols-[1fr_160px_140px_auto]">
                <input type="hidden" name="project_id" value={p.id} />
                <input type="hidden" name="back" value={base} />
                <Input name="title" placeholder="Task nou..." required />
                <Select name="assignee_id" options={staff.map((x) => ({ value: x.id, label: x.full_name }))} placeholder="Responsabil" />
                <Input name="deadline" type="date" />
                <SubmitButton className="btn-sm"><Plus className="h-4 w-4" /> Adaugă</SubmitButton>
              </form>
            )}
          </Panel>
          <div className="space-y-6">
            <Panel title="Progres">
              <div className="flex items-end justify-between"><span className="font-display text-3xl font-extrabold text-ink">{p.progress}%</span><span className="text-xs text-muted">{(tasks ?? []).filter((t) => t.status === "finalizat").length} / {tasks?.length ?? 0} task-uri</span></div>
              <ProgressBar value={p.progress} className="mt-3 h-2.5" />
              <dl className="mt-4 grid grid-cols-2 gap-x-4">
                <KeyVal k="Start" v={formatDate(p.start_date)} />
                <KeyVal k="Deadline" v={<span className={p.deadline && p.deadline < today && p.status !== "finalizat" ? "font-bold text-rose-500" : ""}>{formatDate(p.deadline)}</span>} />
                {canFin && <KeyVal k="Valoare" v={formatLei(p.value)} />}
                <KeyVal k="Contract" v={p.contracts ? <Link href={`/crm/contracte/${(p.contracts as { id: string }).id}`} className="text-brand-blue">{(p.contracts as { number: string }).number}</Link> : null} />
              </dl>
            </Panel>
            <Panel title="Echipă">
              <ul className="space-y-3">
                {manager && <li className="flex items-center gap-3"><Avatar name={manager.full_name} /><div><p className="text-sm font-semibold text-ink">{manager.full_name}</p><p className="text-xs text-muted">Project Manager</p></div></li>}
                {members.filter((m) => m.profile_id !== manager?.id).map((m) => (
                  <li key={m.profile_id} className="flex items-center gap-3"><Avatar name={m.profiles?.full_name} /><div><p className="text-sm font-semibold text-ink">{m.profiles?.full_name}</p><p className="text-xs capitalize text-muted">{m.profiles?.role.replace("_", " ")}</p></div></li>
                ))}
              </ul>
            </Panel>
            {p.description && <Panel title="Descriere"><p className="whitespace-pre-line text-sm text-body">{p.description}</p></Panel>}
          </div>
        </div>
      )}

      {tab === "taskuri" && (
        <Kanban
          move={setTaskStatus}
          columns={[{ key: "de_facut", label: "De făcut" }, { key: "in_lucru", label: "În lucru" }, { key: "review", label: "Review" }, { key: "finalizat", label: "Finalizat" }]}
          cards={(tasks ?? []).map((t) => ({
            id: t.id,
            status: t.status,
            title: t.title,
            href: `/crm/taskuri/${t.id}`,
            date: t.deadline,
            late: Boolean(t.deadline && t.deadline < today && t.status !== "finalizat"),
            badge: { label: PRIORITY[t.priority as keyof typeof PRIORITY]?.label ?? t.priority, cls: PRIO_CLS[t.priority] ?? "" },
            people: [(t.assignee as unknown as { full_name: string } | null)?.full_name].filter(Boolean) as string[],
          }))}
        />
      )}

      {tab === "financiar" && canFin && <ProjectFinance projectId={p.id} value={Number(p.value)} />}
      {tab === "fisiere" && <FilesBrowser clientId={client?.id} projectId={p.id} clientName={`${client?.name ?? "Intern"} › ${p.name}`} />}
      {tab === "activitate" && (
        <Panel title="Activitate proiect" className="max-w-3xl">
          <NoteForm projectId={p.id} clientId={client?.id} path={`${base}?tab=activitate`} />
          <ActivityList projectId={p.id} />
        </Panel>
      )}

      {tab === "setari" && canManage && <ProjectSettings p={p} staff={staff} members={members.map((m) => m.profile_id)} />}
    </>
  );
}

async function ActivityList({ projectId }: { projectId: string }) {
  const { sb } = await getSession();
  const { data } = await sb.from("activities").select("id, type, title, description, created_at, profiles:actor_id(full_name)").eq("project_id", projectId).order("created_at", { ascending: false }).limit(100);
  return <Timeline items={(data ?? []) as unknown as ActivityRow[]} />;
}

async function ProjectFinance({ projectId, value }: { projectId: string; value: number }) {
  const { sb } = await getSession();
  const [{ data: ms }, { data: invoices }, { data: time }, { data: expenses }] = await Promise.all([
    sb.from("payment_milestones").select("*, invoices(id, status, number, series)").eq("project_id", projectId).order("sort"),
    sb.from("invoices").select("total, paid_amount, status").eq("project_id", projectId),
    sb.from("time_entries").select("hours, profiles(full_name, hourly_cost)").eq("project_id", projectId),
    sb.from("expenses").select("amount, category, description").eq("project_id", projectId),
  ]);
  const revenue = value || (invoices ?? []).filter((i) => i.status !== "anulata").reduce((a, i) => a + Number(i.total), 0);
  const collected = (invoices ?? []).reduce((a, i) => a + Number(i.paid_amount), 0);
  const staffCost = (time ?? []).reduce((a, t) => a + Number(t.hours) * Number((t.profiles as unknown as { hourly_cost: number } | null)?.hourly_cost ?? 0), 0);
  const hours = (time ?? []).reduce((a, t) => a + Number(t.hours), 0);
  const byCat = new Map<string, number>();
  (expenses ?? []).forEach((e) => byCat.set(e.category, (byCat.get(e.category) ?? 0) + Number(e.amount)));
  const totalCost = staffCost + Array.from(byCat.values()).reduce((a, b) => a + b, 0);
  const profit = revenue - totalCost;
  const margin = revenue ? Math.round((profit / revenue) * 100) : 0;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Panel title="Profitabilitate proiect">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between"><dt className="text-body">Venit (valoare proiect)</dt><dd className="font-bold text-ink">{formatLei(revenue)}</dd></div>
          <div className="flex justify-between"><dt className="text-body">Încasat până acum</dt><dd className="text-ink">{formatLei(collected)}</dd></div>
          <div className="my-2 border-t border-line" />
          <div className="flex justify-between"><dt className="text-body">Cost angajați ({hours} ore)</dt><dd>{formatLei(staffCost)}</dd></div>
          {Array.from(byCat.entries()).map(([k, v]) => (
            <div key={k} className="flex justify-between"><dt className="text-body">{EXPENSE_CATEGORY[k] ?? k}</dt><dd>{formatLei(v)}</dd></div>
          ))}
          <div className="flex justify-between border-t border-line pt-2"><dt className="font-semibold text-ink">Cost total</dt><dd className="font-semibold text-ink">{formatLei(totalCost)}</dd></div>
          <div className="flex justify-between pt-2 text-base"><dt className="font-bold text-ink">Profit</dt><dd className={cn("font-extrabold", profit >= 0 ? "text-emerald-600" : "text-rose-500")}>{formatLei(profit)}</dd></div>
          <div className="flex justify-between"><dt className="font-bold text-ink">Marjă</dt><dd className={cn("font-extrabold", margin >= 0 ? "text-emerald-600" : "text-rose-500")}>{margin}%</dd></div>
        </dl>
        <p className="mt-4 text-[11px] text-muted">Costul angajaților = ore pontate × cost orar (setat în Angajați). Cheltuielile se asociază proiectului din Financiar → Cheltuieli.</p>
      </Panel>
      <Panel title="Structură plăți (tranșe)">
        <Table head={["Tranșă", "%", "Sumă", "Scadență", "Factură", ""]} empty="Nicio tranșă.">
          {(ms ?? []).map((m) => (
            <tr key={m.id}>
              <Td className="font-semibold text-ink">{m.label}</Td>
              <Td>{Number(m.percent)}%</Td>
              <Td>{formatLei(m.amount)}</Td>
              <Td className="text-xs">{formatDate(m.due_date)}</Td>
              <Td>{m.invoices ? <Link href={`/crm/financiar/facturi/${m.invoices.id}`}><StatusBadge map={INVOICE_STATUS} value={m.invoices.status} /></Link> : <Link className="text-xs font-semibold text-brand-blue" href={`/crm/financiar/facturi/noua?project=${projectId}&milestone=${m.id}`}>Facturează</Link>}</Td>
              <Td>
                {!m.invoice_id && (
                  <form action={deleteMilestone}><input type="hidden" name="id" value={m.id} /><input type="hidden" name="project_id" value={projectId} /><button className="text-xs text-rose-500">Șterge</button></form>
                )}
              </Td>
            </tr>
          ))}
        </Table>
        <form action={addMilestone} className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-[1fr_70px_110px_140px_auto]">
          <input type="hidden" name="project_id" value={projectId} />
          <Input name="label" placeholder="ex. Avans 50%" required />
          <Input name="percent" type="number" placeholder="%" />
          <Input name="amount" type="number" placeholder="Sumă" required />
          <Input name="due_date" type="date" />
          <SubmitButton className="btn-sm">Adaugă</SubmitButton>
        </form>
      </Panel>
    </div>
  );
}

async function ProjectSettings({ p, staff, members }: { p: Record<string, unknown> & { id: string }; staff: { id: string; full_name: string }[]; members: string[] }) {
  const { sb } = await getSession();
  const clients = await getClientsOptions(sb);
  const v = (k: string) => (p[k] as string | null) ?? "";
  return (
    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <Panel title="Detalii proiect">
        <form action={updateProject} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={p.id} />
          <Field label="Nume" className="sm:col-span-2"><Input name="name" defaultValue={v("name")} required /></Field>
          <Field label="Client"><Select name="client_id" options={clients} defaultValue={v("client_id")} placeholder="—" /></Field>
          <Field label="Tip serviciu"><Select name="category" options={Object.fromEntries(Object.entries(SERVICE_CATEGORY).map(([k, x]) => [k, x.label]))} defaultValue={v("category")} /></Field>
          <Field label="Status"><Select name="status" options={optionsFrom(PROJECT_STATUS)} defaultValue={v("status")} /></Field>
          <Field label="Valoare (lei)"><Input name="value" type="number" defaultValue={String(p.value ?? 0)} /></Field>
          <Field label="Start"><Input name="start_date" type="date" defaultValue={v("start_date")} /></Field>
          <Field label="Deadline"><Input name="deadline" type="date" defaultValue={v("deadline")} /></Field>
          <Field label="Project Manager"><Select name="manager_id" options={staff.map((x) => ({ value: x.id, label: x.full_name }))} defaultValue={v("manager_id")} placeholder="—" /></Field>
          <Field label="Link folder Google Drive"><Input name="drive_folder_url" defaultValue={v("drive_folder_url")} placeholder="https://drive.google.com/..." /></Field>
          <Field label="Descriere" className="sm:col-span-2"><Textarea name="description" rows={3} defaultValue={v("description")} /></Field>
          <div className="sm:col-span-2"><SubmitButton>Salvează</SubmitButton></div>
        </form>
      </Panel>
      <div className="space-y-6">
        <Panel title="Membri echipă">
          <form action={setMembers} className="space-y-3">
            <input type="hidden" name="id" value={p.id} />
            <div className="flex flex-wrap gap-2">
              {staff.map((x) => (
                <label key={x.id} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50">
                  <input type="checkbox" name="members" value={x.id} defaultChecked={members.includes(x.id)} className="accent-brand-blue" /> {x.full_name}
                </label>
              ))}
            </div>
            <SubmitButton className="btn-sm">Salvează echipa</SubmitButton>
          </form>
        </Panel>
        <Panel title="Zonă periculoasă">
          <form action={deleteProject}>
            <input type="hidden" name="id" value={p.id} />
            <ConfirmSubmit message="Ștergi proiectul împreună cu task-urile lui?">Șterge proiectul</ConfirmSubmit>
          </form>
        </Panel>
      </div>
    </div>
  );
}
