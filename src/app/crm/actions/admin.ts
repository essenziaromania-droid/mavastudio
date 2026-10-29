"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/crm/auth";
import { audit } from "@/lib/events";
import { createAdminClient } from "@/lib/supabase/server";
import { ROLES } from "@/lib/crm/constants";
import { ANNEX_KEYS, CONTRACT_ANNEXES, CONTRACT_BODY, CONTRACT_DPA, type ContractTemplate } from "@/lib/contract-template";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v.length ? v : null;
};

function origin() {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return process.env.NEXT_PUBLIC_SITE_URL && !host?.startsWith("localhost") ? process.env.NEXT_PUBLIC_SITE_URL : `${h.get("x-forwarded-proto") ?? "https"}://${host}`;
}

/* ───────────── ANGAJAȚI ───────────── */

export async function inviteEmployee(fd: FormData) {
  const s = await getSession();
  if (!s.can("angajati")) return;
  const email = str(fd, "email");
  const role = str(fd, "role") ?? "developer";
  if (!email || !(role in ROLES)) redirect("/crm/angajati?err=" + encodeURIComponent("Email sau rol invalid."));
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email!, {
    data: { full_name: str(fd, "full_name") ?? "", role },
    redirectTo: `${origin()}/auth/callback?next=/crm/cont?reset=1`,
  });
  if (error) redirect("/crm/angajati?err=" + encodeURIComponent(error.message));
  if (data.user) {
    await admin.from("profiles").update({ full_name: str(fd, "full_name") ?? email!.split("@")[0], role, phone: str(fd, "phone"), hourly_cost: Number(fd.get("hourly_cost") || 0) }).eq("id", data.user.id);
  }
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a invitat ${email} (${ROLES[role]})`, entity: "angajat", entity_id: data.user?.id });
  redirect("/crm/angajati?invited=1");
}

export async function updateEmployee(fd: FormData) {
  const s = await getSession();
  if (!s.can("angajati")) return;
  const id = String(fd.get("id"));
  const role = str(fd, "role") ?? "developer";
  const status = str(fd, "status") ?? "activ";
  if (id === s.userId && (role !== "admin" || status !== "activ")) redirect(`/crm/angajati?err=${encodeURIComponent("Nu îți poți schimba propriul rol de administrator sau dezactiva propriul cont.")}`);
  await s.sb
    .from("profiles")
    .update({ full_name: str(fd, "full_name"), phone: str(fd, "phone"), role, status, hourly_cost: Number(fd.get("hourly_cost") || 0) })
    .eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a actualizat angajatul (${ROLES[role]}, ${status})`, entity: "angajat", entity_id: id });
  revalidatePath("/crm/angajati");
}

/* ───────────── SETĂRI ───────────── */

/**
 * Construiește obiectul de setări din câmpurile formularului:
 *  v.a.b = text · n.a = număr · b.a = bifă (lista tuturor bifelor în „bools”) · l.a = listă „valoare|etichetă” pe linii
 */
function formToObject(fd: FormData) {
  const out: Record<string, unknown> = {};
  const set = (path: string, val: unknown) => {
    const parts = path.split(".");
    let cur = out;
    parts.slice(0, -1).forEach((p) => {
      cur[p] = (cur[p] as Record<string, unknown>) ?? {};
      cur = cur[p] as Record<string, unknown>;
    });
    cur[parts[parts.length - 1]!] = val;
  };
  for (const [k, v] of Array.from(fd.entries())) {
    const val = String(v);
    if (k.startsWith("v.")) set(k.slice(2), val.trim());
    else if (k.startsWith("n.")) set(k.slice(2), Number(val || 0));
    else if (k.startsWith("l."))
      set(
        k.slice(2),
        val.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => {
          const [value, ...rest] = l.split("|");
          return { value: value!.trim(), label: rest.join("|").trim() };
        }),
      );
  }
  String(fd.get("bools") ?? "").split(",").filter(Boolean).forEach((b) => set(b, fd.get(`b.${b}`) === "on"));
  return out;
}

export async function saveSettings(fd: FormData) {
  const s = await getSession();
  if (!s.can("setari") && !(fd.get("key") === "site" && s.can("website"))) return;
  const key = String(fd.get("key"));
  const value = formToObject(fd);
  // Pentru „invoicing” păstrăm secretele existente dacă formularul le trimite goale.
  if (key === "invoicing") {
    const { data } = await createAdminClient().from("settings").select("value").eq("key", "invoicing").maybeSingle();
    const prev = (data?.value ?? {}) as Record<string, Record<string, string>>;
    const next = value as Record<string, Record<string, string> | string>;
    for (const prov of ["smartbill", "oblio", "fgo"]) {
      const sec = prov === "smartbill" ? "token" : prov === "oblio" ? "secret" : "key";
      const block = next[prov] as Record<string, string> | undefined;
      if (block && !block[sec] && prev[prov]?.[sec]) block[sec] = prev[prov][sec];
    }
  }
  await s.sb.from("settings").upsert({ key, value, updated_at: new Date().toISOString() });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a modificat setările „${key}”`, entity: "setari", entity_id: key });
  if (key === "site") revalidatePath("/", "layout");
  revalidatePath("/crm/setari");
  redirect(String(fd.get("back") ?? "/crm/setari") + (String(fd.get("back") ?? "").includes("?") ? "&" : "?") + "saved=1");
}

export async function savePermissions(fd: FormData) {
  const s = await getSession();
  if (!s.isAdmin) return;
  const rows: { role: string; module: string }[] = [];
  for (const [k] of Array.from(fd.entries())) {
    const m = /^perm:(\w+):(\w+)$/.exec(k);
    if (m && m[1] !== "admin") rows.push({ role: m[1]!, module: m[2]! });
  }
  await s.sb.from("role_permissions").delete().neq("role", "admin");
  if (rows.length) await s.sb.from("role_permissions").insert(rows);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a modificat permisiunile rolurilor", entity: "setari", entity_id: "permisiuni" });
  redirect("/crm/setari?tab=permisiuni&saved=1");
}

export async function saveCatalogItem(fd: FormData) {
  const s = await getSession();
  if (!s.can("setari")) return;
  const id = str(fd, "id");
  const row = {
    category: str(fd, "category") ?? "altele",
    name: str(fd, "name") ?? "Serviciu",
    description: str(fd, "description"),
    unit: str(fd, "unit") ?? "proiect",
    price: Number(fd.get("price") || 0),
    recurring: fd.get("recurring") === "on",
    active: fd.get("active") !== "off",
  };
  if (id) await s.sb.from("services_catalog").update(row).eq("id", id);
  else await s.sb.from("services_catalog").insert(row);
  revalidatePath("/crm/setari");
}

export async function deleteCatalogItem(fd: FormData) {
  const s = await getSession();
  if (!s.can("setari")) return;
  await s.sb.from("services_catalog").delete().eq("id", String(fd.get("id")));
  revalidatePath("/crm/setari");
}

export async function saveTemplate(fd: FormData) {
  const s = await getSession();
  if (!s.can("setari")) return;
  const id = str(fd, "id");
  const stages = String(fd.get("stages") ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const m = /^(.*?)(?:\s*[|:]\s*(\d+))?$/.exec(l)!;
      return { title: m[1]!.trim(), days: Number(m[2] ?? 2) };
    });
  const row = { name: str(fd, "name") ?? "Șablon", category: str(fd, "category") ?? "website", stages };
  if (id) await s.sb.from("project_templates").update(row).eq("id", id);
  else await s.sb.from("project_templates").insert(row);
  revalidatePath("/crm/setari");
}

/* ───────────── NOTIFICĂRI ───────────── */

export async function markAllRead() {
  const s = await getSession();
  const now = new Date().toISOString();
  await s.sb.from("notifications").update({ read_at: now }).eq("user_id", s.userId).is("read_at", null);
  if (s.isAdmin) await s.sb.from("notifications").update({ read_at: now }).is("user_id", null).is("read_at", null);
  revalidatePath("/crm", "layout");
}

/**
 * Salvează șablonul de contract. Se păstrează doar textele modificate față de varianta implicită,
 * ca îmbunătățirile viitoare ale textului implicit să se aplice în continuare pentru restul.
 */
export async function saveContractTemplate(fd: FormData) {
  const s = await getSession();
  if (!s.can("setari")) return;
  const norm = (t: string) => t.replace(/\r\n/g, "\n").trim();
  const changed = (field: string, def: string) => {
    const v = norm(String(fd.get(field) ?? ""));
    return v && v !== norm(def) ? v : undefined;
  };
  const value: ContractTemplate = {
    body: changed("body", CONTRACT_BODY),
    dpa: changed("dpa", CONTRACT_DPA),
    annexes: Object.fromEntries(ANNEX_KEYS.map((k) => [k, changed(`annex_${k}`, CONTRACT_ANNEXES[k])]).filter(([, v]) => v)),
  };
  await s.sb.from("settings").upsert({ key: "contract_template", value: JSON.parse(JSON.stringify(value)), updated_at: new Date().toISOString() });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a modificat șablonul de contract", entity: "setari", entity_id: "contract_template" });
  revalidatePath("/crm/setari");
  redirect("/crm/setari?tab=contract&saved=1");
}

/** Revine la textul implicit al contractului (șterge toate modificările). */
export async function resetContractTemplate() {
  const s = await getSession();
  if (!s.can("setari")) return;
  await s.sb.from("settings").delete().eq("key", "contract_template");
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a resetat șablonul de contract la varianta implicită", entity: "setari", entity_id: "contract_template" });
  revalidatePath("/crm/setari");
  redirect("/crm/setari?tab=contract&saved=1");
}
