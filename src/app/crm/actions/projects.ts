"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit, notify } from "@/lib/events";
import { createProjectFromTemplate } from "@/lib/automations";
import { TASK_STATUS } from "@/lib/crm/constants";
import { recalcProgress } from "@/lib/crm/progress";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v.length ? v : null;
};

/* ───────────── PROIECTE ───────────── */

export async function createProject(fd: FormData) {
  const s = await getSession();
  const name = str(fd, "name") ?? "Proiect nou";
  const category = str(fd, "category") ?? "website";
  const useTemplate = fd.get("template") === "on";
  const start = str(fd, "start_date") ? new Date(String(fd.get("start_date"))) : new Date();
  let id: string | null = null;
  if (useTemplate) {
    id = await createProjectFromTemplate(s.sb, {
      name,
      client_id: str(fd, "client_id"),
      category,
      value: Number(fd.get("value") || 0),
      manager_id: str(fd, "manager_id") ?? s.userId,
      start,
    });
  } else {
    const { data, error } = await s.sb
      .from("projects")
      .insert({ name, client_id: str(fd, "client_id"), category, value: Number(fd.get("value") || 0), manager_id: str(fd, "manager_id") ?? s.userId, start_date: start.toISOString().slice(0, 10), deadline: str(fd, "deadline"), description: str(fd, "description") })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    id = data.id;
  }
  if (!id) throw new Error("Proiectul nu a putut fi creat.");
  if (str(fd, "deadline")) await s.sb.from("projects").update({ deadline: str(fd, "deadline"), description: str(fd, "description") }).eq("id", id);
  const members = fd.getAll("members").map(String).filter(Boolean);
  if (members.length) await s.sb.from("project_members").insert(members.map((m) => ({ project_id: id, profile_id: m })));
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a creat proiectul ${name}`, entity: "proiect", entity_id: id });
  redirect(`/crm/proiecte/${id}`);
}

export async function updateProject(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb
    .from("projects")
    .update({
      name: str(fd, "name"),
      client_id: str(fd, "client_id"),
      category: str(fd, "category"),
      status: str(fd, "status") ?? "de_inceput",
      value: Number(fd.get("value") || 0),
      start_date: str(fd, "start_date"),
      deadline: str(fd, "deadline"),
      manager_id: str(fd, "manager_id"),
      description: str(fd, "description"),
      drive_folder_url: str(fd, "drive_folder_url"),
    })
    .eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a actualizat proiectul", entity: "proiect", entity_id: id });
  revalidatePath(`/crm/proiecte/${id}`);
}

export async function setProjectStatus(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  await s.sb.from("projects").update({ status, ...(status === "finalizat" ? { progress: 100 } : {}) }).eq("id", id);
  const { data: p } = await s.sb.from("projects").select("client_id, name").eq("id", id).single();
  await addActivity(s.sb, { project_id: id, client_id: p?.client_id, type: "proiect", title: `Proiect „${p?.name}”: ${status.replace("_", " ")}`, actor_id: s.userId });
  revalidatePath(`/crm/proiecte/${id}`);
  revalidatePath("/crm/proiecte");
}

export async function setMembers(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const members = fd.getAll("members").map(String).filter(Boolean);
  await s.sb.from("project_members").delete().eq("project_id", id);
  if (members.length) await s.sb.from("project_members").insert(members.map((m) => ({ project_id: id, profile_id: m })));
  revalidatePath(`/crm/proiecte/${id}`);
}

export async function deleteProject(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("projects").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters un proiect", entity: "proiect", entity_id: id });
  redirect("/crm/proiecte");
}

export async function addMilestone(fd: FormData) {
  const s = await getSession();
  const project = String(fd.get("project_id"));
  await s.sb.from("payment_milestones").insert({ project_id: project, label: str(fd, "label") ?? "Tranșă", percent: Number(fd.get("percent") || 0), amount: Number(fd.get("amount") || 0), due_date: str(fd, "due_date") });
  revalidatePath(`/crm/proiecte/${project}`);
}

export async function deleteMilestone(fd: FormData) {
  const s = await getSession();
  await s.sb.from("payment_milestones").delete().eq("id", String(fd.get("id")));
  revalidatePath(`/crm/proiecte/${String(fd.get("project_id"))}`);
}

/* ───────────── TASK-URI ───────────── */

export async function createTask(fd: FormData) {
  const s = await getSession();
  const projectId = str(fd, "project_id");
  let clientId: string | null = null;
  if (projectId) clientId = (await s.sb.from("projects").select("client_id").eq("id", projectId).single()).data?.client_id ?? null;
  const assignee = str(fd, "assignee_id");
  const { data, error } = await s.sb
    .from("tasks")
    .insert({
      title: str(fd, "title") ?? "Task nou",
      description: str(fd, "description"),
      project_id: projectId,
      client_id: clientId,
      assignee_id: assignee,
      priority: str(fd, "priority") ?? "medie",
      deadline: str(fd, "deadline"),
      estimated_hours: Number(fd.get("estimated_hours") || 0) || null,
      created_by: s.userId,
    })
    .select("id, title")
    .single();
  if (error) throw new Error(error.message);
  if (assignee && assignee !== s.userId) await notify(s.sb, { user_id: assignee, type: "task", title: `Task nou atribuit: ${data.title}`, body: `de la ${s.profile.full_name}`, link: `/crm/taskuri/${data.id}` });
  await recalcProgress(s.sb, projectId);
  const back = str(fd, "back");
  if (back) {
    revalidatePath(back);
    redirect(back);
  }
  redirect(`/crm/taskuri/${data.id}`);
}

export async function updateTask(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: before } = await s.sb.from("tasks").select("assignee_id, title").eq("id", id).single();
  const assignee = str(fd, "assignee_id");
  await s.sb
    .from("tasks")
    .update({
      title: str(fd, "title"),
      description: str(fd, "description"),
      project_id: str(fd, "project_id"),
      assignee_id: assignee,
      priority: str(fd, "priority") ?? "medie",
      deadline: str(fd, "deadline"),
      estimated_hours: Number(fd.get("estimated_hours") || 0) || null,
    })
    .eq("id", id);
  if (assignee && assignee !== before?.assignee_id && assignee !== s.userId) {
    await notify(s.sb, { user_id: assignee, type: "task", title: `Task atribuit: ${before?.title}`, body: `de la ${s.profile.full_name}`, link: `/crm/taskuri/${id}` });
  }
  revalidatePath(`/crm/taskuri/${id}`);
}

/**
 * Schimbare status cu flux de review:
 * - cine nu are drept de management (proiecte_toate) nu poate marca direct „finalizat” → task-ul merge în „review”.
 */
export async function setTaskStatus(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  let status = String(fd.get("status"));
  const isManager = s.can("proiecte_toate");
  if (status === "finalizat" && !isManager) status = "review";
  const { data: t } = await s.sb.from("tasks").select("title, project_id, assignee_id, projects(manager_id, name)").eq("id", id).single();
  await s.sb.from("tasks").update({ status, completed_at: status === "finalizat" ? new Date().toISOString() : null, ...(status === "review" ? { review_note: null } : {}) }).eq("id", id);

  if (status === "review") {
    const pm = (t?.projects as unknown as { manager_id: string | null } | null)?.manager_id;
    await notify(s.sb, { user_id: pm ?? null, type: "review", title: `Task trimis la review: ${t?.title}`, body: `de ${s.profile.full_name}`, link: `/crm/taskuri/${id}` });
  }
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a mutat task-ul „${t?.title}” în ${TASK_STATUS[status as keyof typeof TASK_STATUS]?.label ?? status}`, entity: "task", entity_id: id });
  await recalcProgress(s.sb, t?.project_id ?? null);
  revalidatePath("/crm/taskuri");
  revalidatePath(`/crm/taskuri/${id}`);
  if (t?.project_id) revalidatePath(`/crm/proiecte/${t.project_id}`);
}

export async function reviewTask(fd: FormData) {
  const s = await getSession();
  if (!s.can("proiecte_toate")) return;
  const id = String(fd.get("id"));
  const decision = String(fd.get("decision"));
  const note = str(fd, "note");
  const { data: t } = await s.sb.from("tasks").select("title, assignee_id, project_id").eq("id", id).single();
  if (decision === "approve") {
    await s.sb.from("tasks").update({ status: "finalizat", completed_at: new Date().toISOString(), review_note: note }).eq("id", id);
    if (t?.assignee_id) await notify(s.sb, { user_id: t.assignee_id, type: "review", title: `✅ Aprobat: ${t.title}`, body: note ?? undefined, link: `/crm/taskuri/${id}` });
    await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a aprobat task-ul „${t?.title}”`, entity: "task", entity_id: id });
  } else {
    await s.sb.from("tasks").update({ status: "in_lucru", review_note: note ?? "Sunt necesare modificări." }).eq("id", id);
    if (t?.assignee_id) await notify(s.sb, { user_id: t.assignee_id, type: "review", title: `✏️ Modificări cerute: ${t.title}`, body: note ?? undefined, link: `/crm/taskuri/${id}` });
    await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a cerut modificări la task-ul „${t?.title}”`, entity: "task", entity_id: id });
  }
  if (note) await s.sb.from("task_comments").insert({ task_id: id, author_id: s.userId, body: `${decision === "approve" ? "Aprobat" : "Modificări cerute"}: ${note}` });
  await recalcProgress(s.sb, t?.project_id ?? null);
  revalidatePath(`/crm/taskuri/${id}`);
}

export async function addTaskComment(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("task_id"));
  const body = str(fd, "body");
  if (!body) return;
  await s.sb.from("task_comments").insert({ task_id: id, author_id: s.userId, body });
  const { data: t } = await s.sb.from("tasks").select("title, assignee_id").eq("id", id).single();
  if (t?.assignee_id && t.assignee_id !== s.userId) await notify(s.sb, { user_id: t.assignee_id, type: "comentariu", title: `Comentariu nou: ${t.title}`, body: body.slice(0, 120), link: `/crm/taskuri/${id}` });
  revalidatePath(`/crm/taskuri/${id}`);
}

export async function logTime(fd: FormData) {
  const s = await getSession();
  const taskId = str(fd, "task_id");
  const hours = Number(fd.get("hours") || 0);
  if (!hours || hours <= 0) return;
  await s.sb.from("time_entries").insert({ profile_id: s.userId, task_id: taskId, project_id: str(fd, "project_id"), hours, work_date: str(fd, "work_date") ?? new Date().toISOString().slice(0, 10), note: str(fd, "note") });
  revalidatePath(`/crm/taskuri/${taskId}`);
}

export async function deleteTask(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: t } = await s.sb.from("tasks").select("project_id").eq("id", id).single();
  await s.sb.from("tasks").delete().eq("id", id);
  await recalcProgress(s.sb, t?.project_id ?? null);
  redirect(t?.project_id ? `/crm/proiecte/${t.project_id}` : "/crm/taskuri");
}
