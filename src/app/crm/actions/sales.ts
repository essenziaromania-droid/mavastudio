"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { addActivity, audit } from "@/lib/events";
import { LEAD_STATUS } from "@/lib/crm/constants";

const str = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v.length ? v : null;
};

/* ───────────── LEAD-URI ───────────── */

export async function createLead(fd: FormData) {
  const s = await getSession();
  const { data, error } = await s.sb
    .from("leads")
    .insert({
      name: str(fd, "name") ?? "Fără nume",
      company: str(fd, "company"),
      email: str(fd, "email"),
      phone: str(fd, "phone"),
      services: fd.getAll("services").map(String).filter(Boolean),
      budget: str(fd, "budget"),
      message: str(fd, "message"),
      source: str(fd, "source") ?? "manual",
      value_estimate: Number(fd.get("value_estimate") || 0) || null,
      assigned_to: str(fd, "assigned_to"),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  await addActivity(s.sb, { lead_id: data.id, type: "lead", title: "Lead adăugat manual", actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a adăugat lead-ul", entity: "lead", entity_id: data.id });
  redirect(`/crm/leaduri/${data.id}`);
}

export async function updateLeadStatus(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const status = String(fd.get("status"));
  await s.sb.from("leads").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  await addActivity(s.sb, { lead_id: id, type: "status", title: `Status schimbat: ${LEAD_STATUS[status as keyof typeof LEAD_STATUS]?.label ?? status}`, actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: `a schimbat statusul lead-ului în „${status}”`, entity: "lead", entity_id: id });
  revalidatePath("/crm/leaduri");
  revalidatePath(`/crm/leaduri/${id}`);
}

export async function updateLead(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb
    .from("leads")
    .update({
      name: str(fd, "name"),
      company: str(fd, "company"),
      email: str(fd, "email"),
      phone: str(fd, "phone"),
      budget: str(fd, "budget"),
      source: str(fd, "source") ?? "manual",
      value_estimate: Number(fd.get("value_estimate") || 0) || null,
      assigned_to: str(fd, "assigned_to"),
      lost_reason: str(fd, "lost_reason"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath(`/crm/leaduri/${id}`);
}

export async function addNote(fd: FormData) {
  const s = await getSession();
  const body = str(fd, "body");
  if (!body) return;
  const type = str(fd, "type") ?? "nota";
  const titles: Record<string, string> = { nota: "Notă", apel: "Apel efectuat", email: "Email trimis", intalnire: "Întâlnire" };
  await addActivity(s.sb, {
    lead_id: str(fd, "lead_id"),
    client_id: str(fd, "client_id"),
    project_id: str(fd, "project_id"),
    type,
    title: titles[type] ?? "Notă",
    description: body,
    actor_id: s.userId,
  });
  const lead = str(fd, "lead_id");
  if (lead && type !== "nota") await s.sb.from("leads").update({ status: "contactat" }).eq("id", lead).eq("status", "nou");
  revalidatePath(String(fd.get("path") ?? "/crm"));
}

export async function convertLeadToClient(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { data: lead } = await s.sb.from("leads").select("*").eq("id", id).single();
  if (!lead) throw new Error("Lead inexistent");
  let clientId = lead.client_id as string | null;
  if (!clientId) {
    const { data: c, error } = await s.sb
      .from("clients")
      .insert({
        type: lead.company ? "company" : "person",
        name: lead.company || lead.name,
        email: lead.email,
        phone: lead.phone,
        contact_name: lead.company ? lead.name : null,
        contact_email: lead.email,
        contact_phone: lead.phone,
        source: lead.source,
        status: "prospect",
        created_by: s.userId,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    clientId = c.id;
    await s.sb.from("leads").update({ client_id: clientId, status: lead.status === "nou" ? "calificat" : lead.status }).eq("id", id);
    // mută istoricul lead-ului pe client
    await s.sb.from("activities").update({ client_id: clientId }).eq("lead_id", id);
    await addActivity(s.sb, { client_id: clientId, lead_id: id, type: "client", title: "Lead convertit în client", actor_id: s.userId });
    await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a convertit lead-ul în client", entity: "client", entity_id: clientId });
  }
  const then = String(fd.get("then") ?? "client");
  redirect(then === "offer" ? `/crm/oferte/noua?client=${clientId}&lead=${id}` : `/crm/clienti/${clientId}`);
}

export async function deleteLead(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("leads").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters un lead", entity: "lead", entity_id: id });
  redirect("/crm/leaduri");
}

/* ───────────── CLIENȚI ───────────── */

function clientPayload(fd: FormData) {
  return {
    type: str(fd, "type") ?? "company",
    name: str(fd, "name") ?? "Fără nume",
    cui: str(fd, "cui"),
    reg_com: str(fd, "reg_com"),
    address: str(fd, "address"),
    city: str(fd, "city"),
    county: str(fd, "county"),
    country: str(fd, "country") ?? "România",
    email: str(fd, "email"),
    phone: str(fd, "phone"),
    website: str(fd, "website"),
    contact_name: str(fd, "contact_name"),
    contact_email: str(fd, "contact_email"),
    contact_phone: str(fd, "contact_phone"),
    contact_role: str(fd, "contact_role"),
    iban: str(fd, "iban"),
    source: str(fd, "source"),
    status: str(fd, "status") ?? "prospect",
    notes: str(fd, "notes"),
  };
}

export async function createClientAction(fd: FormData) {
  const s = await getSession();
  const { data, error } = await s.sb.from("clients").insert({ ...clientPayload(fd), created_by: s.userId }).select("id").single();
  if (error) throw new Error(error.message);
  await addActivity(s.sb, { client_id: data.id, type: "client", title: "Client adăugat", actor_id: s.userId });
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a adăugat clientul", entity: "client", entity_id: data.id });
  redirect(`/crm/clienti/${data.id}`);
}

export async function updateClientAction(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  const { error } = await s.sb.from("clients").update(clientPayload(fd)).eq("id", id);
  if (error) throw new Error(error.message);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a actualizat datele clientului", entity: "client", entity_id: id });
  redirect(`/crm/clienti/${id}`);
}

export async function deleteClientAction(fd: FormData) {
  const s = await getSession();
  const id = String(fd.get("id"));
  await s.sb.from("clients").delete().eq("id", id);
  await audit(s.sb, { actor_id: s.userId, actor_name: s.profile.full_name, action: "a șters un client", entity: "client", entity_id: id });
  redirect("/crm/clienti");
}

/** Caută firma după CUI în serviciul public ANAF (date de identificare + adresă). */
export async function lookupCui(cui: string): Promise<{ ok: boolean; name?: string; address?: string; reg_com?: string; city?: string; county?: string; error?: string }> {
  await getSession();
  const clean = cui.replace(/\D/g, "");
  if (!clean) return { ok: false, error: "CUI invalid" };
  try {
    const res = await fetch("https://webservicesp.anaf.ro/api/PlatitorTvaRest/v9/tva", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([{ cui: Number(clean), data: new Date().toISOString().slice(0, 10) }]),
      cache: "no-store",
    });
    const json = await res.json();
    const f = json?.found?.[0];
    if (!f) return { ok: false, error: "Firma nu a fost găsită." };
    const g = f.date_generale ?? {};
    const a = f.adresa_sediu_social ?? {};
    return {
      ok: true,
      name: g.denumire,
      reg_com: g.nrRegCom,
      address: g.adresa,
      city: a.sdenumire_Localitate,
      county: a.sdenumire_Judet,
    };
  } catch {
    return { ok: false, error: "Serviciul ANAF nu răspunde acum." };
  }
}
