import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Progres proiect = task-uri finalizate / total; actualizează și statusul proiectului. */
export async function recalcProgress(sb: SupabaseClient, projectId: string | null) {
  if (!projectId) return;
  const { data } = await sb.from("tasks").select("status").eq("project_id", projectId);
  const total = data?.length ?? 0;
  const done = (data ?? []).filter((t) => t.status === "finalizat").length;
  const progress = total ? Math.round((done / total) * 100) : 0;
  const patch: Record<string, unknown> = { progress };
  if (total && done === total) patch.status = "review";
  else if (done > 0) patch.status = "in_lucru";
  const { data: p } = await sb.from("projects").select("status").eq("id", projectId).single();
  if (p && ["finalizat", "anulat"].includes(p.status)) delete patch.status;
  if (p?.status === "review" && done !== total) patch.status = "in_lucru";
  await sb.from("projects").update(patch).eq("id", projectId);
}

