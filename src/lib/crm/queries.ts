import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getStaff(sb: SupabaseClient) {
  const { data } = await sb.from("profiles").select("id, full_name, role, avatar_url, hourly_cost").eq("status", "activ").order("full_name");
  return data ?? [];
}

export async function getClientsOptions(sb: SupabaseClient) {
  const { data } = await sb.from("clients").select("id, name").order("name");
  return (data ?? []).map((c) => ({ value: c.id as string, label: c.name as string }));
}

export async function getProjectsOptions(sb: SupabaseClient) {
  const { data } = await sb.from("projects").select("id, name").neq("status", "anulat").order("created_at", { ascending: false });
  return (data ?? []).map((p) => ({ value: p.id as string, label: p.name as string }));
}

/** Escapare simplă pentru căutări `ilike` în filtrele .or() din PostgREST. */
export function likeTerm(q: string) {
  return `%${q.replace(/[%_,()]/g, " ").trim()}%`;
}
