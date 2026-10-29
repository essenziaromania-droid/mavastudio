import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock, MessageSquare, RotateCcw, Send } from "lucide-react";
import { getSession } from "@/lib/crm/auth";
import { Avatar, Field, Input, KeyVal, PageHeader, Panel, Select, StatusBadge, Textarea, optionsFrom } from "@/components/crm/ui";
import { ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { PRIORITY, TASK_STATUS } from "@/lib/crm/constants";
import { addTaskComment, deleteTask, logTime, reviewTask, setTaskStatus, updateTask } from "../../actions/projects";
import { getProjectsOptions, getStaff } from "@/lib/crm/queries";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Task" };

export default async function TaskPage({ params }: { params: { id: string } }) {
  const s = await getSession();
  const { data: t } = await s.sb.from("tasks").select("*, projects(id, name, manager_id), clients(id, name), assignee:assignee_id(id, full_name)").eq("id", params.id).maybeSingle();
  if (!t) notFound();
  const [{ data: comments }, { data: time }, staff, projects] = await Promise.all([
    s.sb.from("task_comments").select("id, body, created_at, profiles:author_id(full_name, avatar_url)").eq("task_id", t.id).order("created_at"),
    s.sb.from("time_entries").select("id, hours, work_date, note, profiles(full_name)").eq("task_id", t.id).order("work_date", { ascending: false }),
    getStaff(s.sb),
    getProjectsOptions(s.sb),
  ]);
  const isManager = s.can("proiecte_toate");
  const isAssignee = t.assignee_id === s.userId;
  const canEdit = isManager || isAssignee;
  const totalHours = (time ?? []).reduce((a, x) => a + Number(x.hours), 0);
  const project = t.projects as { id: string; name: string } | null;
  const assignee = t.assignee as unknown as { id: string; full_name: string } | null;

  const statusBtn = (status: string, label: React.ReactNode, variant: "primary" | "ghost" = "ghost") => (
    <form action={setTaskStatus}>
      <input type="hidden" name="id" value={t.id} />
      <input type="hidden" name="status" value={status} />
      <SubmitButton variant={variant}>{label}</SubmitButton>
    </form>
  );

  return (
    <>
      <PageHeader
        back={project ? { href: `/crm/proiecte/${project.id}`, label: project.name } : { href: "/crm/taskuri", label: "Task-uri" }}
        title={<span className="flex items-center gap-3">{t.title} <StatusBadge map={TASK_STATUS} value={t.status} /></span>}
        sub={<>Prioritate <StatusBadge map={PRIORITY} value={t.priority} /> · deadline {formatDate(t.deadline)}</>}
        actions={
          canEdit && (
            <>
              {t.status === "de_facut" && statusBtn("in_lucru", <><Clock className="h-4 w-4" /> Începe lucrul</>, "primary")}
              {t.status === "in_lucru" && !isManager && statusBtn("review", <><Send className="h-4 w-4" /> Trimite la review</>, "primary")}
              {t.status === "in_lucru" && isManager && statusBtn("finalizat", <><CheckCircle2 className="h-4 w-4" /> Finalizează</>, "primary")}
              {t.status === "finalizat" && statusBtn("in_lucru", <><RotateCcw className="h-4 w-4" /> Redeschide</>)}
            </>
          )
        }
      />

      {t.review_note && t.status !== "finalizat" && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"><b>Feedback review:</b> {t.review_note}</p>
      )}

      {t.status === "review" && isManager && (
        <Panel title="Review intern" className="mb-6 border-amber-200">
          <form action={reviewTask} className="space-y-3">
            <input type="hidden" name="id" value={t.id} />
            <Textarea name="note" rows={2} placeholder="Comentariu (opțional la aprobare, recomandat la modificări)" />
            <div className="flex flex-wrap gap-2">
              <button name="decision" value="approve" className="btn-primary !py-2.5"><CheckCircle2 className="h-4 w-4" /> Aprobă</button>
              <button name="decision" value="changes" className="btn-ghost !py-2.5"><RotateCcw className="h-4 w-4" /> Solicită modificări</button>
            </div>
          </form>
        </Panel>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Panel title="Descriere">
            <p className="whitespace-pre-line text-sm text-body">{t.description || "Fără descriere."}</p>
          </Panel>
          <Panel title={<span className="flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Comentarii</span>}>
            <ul className="space-y-4">
              {(comments ?? []).map((c) => {
                const a = c.profiles as unknown as { full_name: string; avatar_url: string | null } | null;
                return (
                  <li key={c.id} className="flex gap-3">
                    <Avatar name={a?.full_name} src={a?.avatar_url} size={32} />
                    <div className="flex-1 rounded-xl bg-soft px-4 py-2.5">
                      <p className="text-xs"><b className="text-ink">{a?.full_name}</b> <span className="text-muted">· {formatDate(c.created_at, true)}</span></p>
                      <p className="mt-1 whitespace-pre-line text-sm text-ink-2">{c.body}</p>
                    </div>
                  </li>
                );
              })}
              {!comments?.length && <li className="text-sm text-muted">Niciun comentariu.</li>}
            </ul>
            <form action={addTaskComment} className="mt-4 space-y-2">
              <input type="hidden" name="task_id" value={t.id} />
              <Textarea name="body" rows={2} placeholder="Scrie un comentariu..." required />
              <SubmitButton className="btn-sm">Trimite</SubmitButton>
            </form>
          </Panel>
        </div>
        <div className="space-y-6">
          <Panel title="Detalii">
            <dl>
              <KeyVal k="Responsabil" v={assignee?.full_name} />
              <KeyVal k="Proiect" v={project && <Link href={`/crm/proiecte/${project.id}`} className="text-brand-blue">{project.name}</Link>} />
              <KeyVal k="Client" v={t.clients?.name} />
              <KeyVal k="Ore estimate / pontate" v={`${t.estimated_hours ?? "—"} / ${totalHours}`} />
              <KeyVal k="Creat" v={formatDate(t.created_at, true)} />
              {t.completed_at && <KeyVal k="Finalizat" v={formatDate(t.completed_at, true)} />}
            </dl>
          </Panel>
          <Panel title="Pontaj">
            <form action={logTime} className="grid grid-cols-[80px_1fr] gap-2">
              <input type="hidden" name="task_id" value={t.id} />
              {project && <input type="hidden" name="project_id" value={project.id} />}
              <Input name="hours" type="number" step="0.25" min="0.25" placeholder="Ore" required />
              <Input name="work_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              <Input name="note" placeholder="Ce ai lucrat (opțional)" className="col-span-2" />
              <SubmitButton className="btn-sm col-span-2">Adaugă ore</SubmitButton>
            </form>
            <ul className="mt-4 space-y-1.5 text-xs">
              {(time ?? []).map((e) => (
                <li key={e.id} className="flex justify-between gap-2 text-body"><span>{formatDate(e.work_date)} · {(e.profiles as unknown as { full_name: string } | null)?.full_name}{e.note ? ` – ${e.note}` : ""}</span><b className="text-ink">{Number(e.hours)}h</b></li>
              ))}
            </ul>
          </Panel>
          {canEdit && (
            <Panel title="Editează">
              <form action={updateTask} className="space-y-3">
                <input type="hidden" name="id" value={t.id} />
                <Field label="Titlu"><Input name="title" defaultValue={t.title} required /></Field>
                <Field label="Proiect"><Select name="project_id" options={projects} defaultValue={t.project_id ?? ""} placeholder="Fără proiect" /></Field>
                <Field label="Responsabil"><Select name="assignee_id" options={staff.map((p) => ({ value: p.id, label: p.full_name }))} defaultValue={t.assignee_id ?? ""} placeholder="Neatribuit" disabled={!isManager} /></Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Prioritate"><Select name="priority" options={optionsFrom(PRIORITY)} defaultValue={t.priority} /></Field>
                  <Field label="Deadline"><Input name="deadline" type="date" defaultValue={t.deadline ?? ""} /></Field>
                </div>
                <Field label="Ore estimate"><Input name="estimated_hours" type="number" step="0.5" defaultValue={t.estimated_hours ?? ""} /></Field>
                <Field label="Descriere"><Textarea name="description" rows={4} defaultValue={t.description ?? ""} /></Field>
                {!isManager && <input type="hidden" name="assignee_id" value={t.assignee_id ?? ""} />}
                <SubmitButton className="btn-sm">Salvează</SubmitButton>
              </form>
              {isManager && (
                <form action={deleteTask} className="mt-4 border-t border-line pt-4">
                  <input type="hidden" name="id" value={t.id} />
                  <ConfirmSubmit message="Ștergi task-ul?">Șterge task-ul</ConfirmSubmit>
                </form>
              )}
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}
