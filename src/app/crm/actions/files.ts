"use server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit } from "@/lib/events";

export async function registerFile(f: { client_id?: string | null; project_id?: string | null; social_post_id?: string | null; folder: string; name: string; path: string; mime?: string; size?: number }) {
  const s = await getSession();
  const { error } = await s.sb.from("files").insert({ ...f, uploaded_by: s.userId });
  if (error) return { error: error.message };
  if (f.client_id || f.project_id) await addActivity(s.sb, { client_id: f.client_id, project_id: f.project_id, type: "nota", title: `Fișier încărcat: ${f.name}`, description: f.folder, actor_id: s.userId });
  revalidatePath("/crm", "layout");
  return { ok: true };
}

export async function deleteFile(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: f } = await s.sb.from("files").select("path, name").eq("id", id).single();
  if (f) {
    await s.sb.storage.from("crm-files").remove([f.path]);
    await s.sb.from("files").delete().eq("id", id);
    await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a șters fișierul ${f.name}`, entity: "fisier", entity_id: id });
  }
  revalidatePath("/crm", "layout");
}
