import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Utilitare pentru timeline client, notificări și audit log. Primesc clientul Supabase al apelantului. */

export async function addActivity(
  sb: SupabaseClient,
  a: { client_id?: string | null; lead_id?: string | null; project_id?: string | null; type: string; title: string; description?: string | null; actor_id?: string | null },
) {
  await sb.from("activities").insert(a);
}

export async function notify(sb: SupabaseClient, n: { user_id?: string | null; type: string; title: string; body?: string; link?: string }) {
  await sb.from("notifications").insert({ user_id: n.user_id ?? null, type: n.type, title: n.title, body: n.body ?? null, link: n.link ?? null });
}

export async function audit(
  sb: SupabaseClient,
  e: { actor_id?: string | null; actor_name?: string | null; action: string; entity: string; entity_id?: string | null; details?: Record<string, unknown> },
) {
  await sb.from("audit_log").insert({ ...e, details: e.details ?? null });
}

export async function getSetting<T = Record<string, unknown>>(sb: SupabaseClient, key: string, fallback: T): Promise<T> {
  const { data } = await sb.from("settings").select("value").eq("key", key).maybeSingle();
  return { ...fallback, ...((data?.value as T) ?? {}) };
}

export type AutomationSettings = {
  lead_new_notify: boolean;
  lead_new_task: boolean;
  lead_new_autoreply: boolean;
  offer_accepted_contract: boolean;
  contract_signed_project: boolean;
  contract_signed_invoice: boolean;
  invoice_paid_notify: boolean;
};

export const DEFAULT_AUTOMATIONS: AutomationSettings = {
  lead_new_notify: true,
  lead_new_task: true,
  lead_new_autoreply: true,
  offer_accepted_contract: true,
  contract_signed_project: true,
  contract_signed_invoice: true,
  invoice_paid_notify: true,
};
