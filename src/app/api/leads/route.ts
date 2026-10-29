import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { hasSupabase, SUPABASE_SERVICE_ROLE_KEY } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/server";
import { onLeadCreated } from "@/lib/automations";
import { PROJECT_TYPES } from "@/content/site";
import { ADMIN_EMAIL, brandedEmail, escapeHtml, sendEmail } from "@/lib/email";

export const runtime = "nodejs";

const SERVICE_VALUES = PROJECT_TYPES.map((t) => t.value) as [string, ...string[]];
const MAX_FILE = 10 * 1024 * 1024;

/** Mesajele de eroare, în limba vizitatorului. */
const M = {
  ro: {
    name: "Completează numele.",
    email: "Adresa de email nu este validă.",
    phone: "Completează numărul de telefon.",
    services: "Alege cel puțin un serviciu.",
    message: "Scrie-ne câteva detalii despre proiect.",
    consent: "Este necesar acordul pentru prelucrarea datelor.",
    invalidRequest: "Cerere invalidă.",
    invalid: "Date invalide.",
    tooMany: "Ai trimis deja mai multe cereri. Te rugăm să încerci mai târziu sau să ne scrii la contact@mavastudio.ro.",
    saveFailed: "Nu am putut salva cererea. Te rugăm să ne scrii la contact@mavastudio.ro.",
  },
  en: {
    name: "Please enter your name.",
    email: "The email address is not valid.",
    phone: "Please enter your phone number.",
    services: "Choose at least one service.",
    message: "Please tell us a few details about your project.",
    consent: "Your consent to data processing is required.",
    invalidRequest: "Invalid request.",
    invalid: "Invalid data.",
    tooMany: "You've already sent several requests. Please try again later or write to us at contact@mavastudio.ro.",
    saveFailed: "We couldn't save your request. Please write to us at contact@mavastudio.ro.",
  },
};

function schemaFor(m: (typeof M)["ro"]) {
  return z.object({
    name: z.string().trim().min(2, m.name).max(120),
    company: z.string().trim().max(160).optional().default(""),
    email: z.string().trim().email(m.email).max(160),
    phone: z.string().trim().min(6, m.phone).max(30),
    services: z.array(z.enum(SERVICE_VALUES)).min(1, m.services),
    budget: z.string().trim().max(60).optional().default(""),
    deadline: z.string().trim().max(60).optional().default(""),
    message: z.string().trim().min(5, m.message).max(5000),
    consent: z.literal("on", { message: m.consent }),
  });
}

function detectSource(utm: Record<string, string>) {
  const s = `${utm.utm_source ?? ""} ${utm.referrer ?? ""}`.toLowerCase();
  if (utm.gclid || (s.includes("google") && utm.utm_medium?.includes("cpc"))) return "google_ads";
  if (s.includes("facebook") || s.includes("fb.") || utm.fbclid) return "facebook";
  if (s.includes("instagram")) return "instagram";
  if (s.includes("tiktok")) return "tiktok";
  if (s.includes("linkedin")) return "linkedin";
  return "site";
}

export async function POST(req: NextRequest) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: M.ro.invalidRequest }, { status: 400 });
  }

  const language: "ro" | "en" = fd.get("language") === "en" ? "en" : "ro";
  const m = M[language];

  // Honeypot: boții completează câmpul ascuns „website”. Răspundem „ok” fără să salvăm nimic.
  if (String(fd.get("website") ?? "").length > 0) return NextResponse.json({ ok: true });

  const parsed = schemaFor(m).safeParse({
    name: fd.get("name"),
    company: fd.get("company") ?? "",
    email: fd.get("email"),
    phone: fd.get("phone"),
    services: fd.getAll("services").map(String).filter(Boolean),
    budget: fd.get("budget") ?? "",
    deadline: fd.get("deadline") ?? "",
    message: fd.get("message"),
    consent: fd.get("consent"),
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? m.invalid }, { status: 422 });
  }
  const d = parsed.data;

  let utm: Record<string, string> = {};
  try {
    const raw = JSON.parse(String(fd.get("utm") ?? "{}"));
    if (raw && typeof raw === "object") {
      utm = Object.fromEntries(Object.entries(raw).filter(([, v]) => typeof v === "string").map(([k, v]) => [k.slice(0, 40), String(v).slice(0, 300)]));
    }
  } catch {
    /* ignore */
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || "necunoscut";
  const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);

  // Fără Supabase (ex. local, înainte de configurare): trimitem doar emailul către admin.
  if (!hasSupabase || !SUPABASE_SERVICE_ROLE_KEY) {
    const r = await sendEmail({
      to: ADMIN_EMAIL,
      subject: `Lead nou: ${d.name}`,
      replyTo: d.email,
      html: brandedEmail({
        title: `Lead nou: ${d.name}`,
        bodyHtml: `<p>${escapeHtml(JSON.stringify({ ...d, language, consent: true }, null, 2)).replace(/\n/g, "<br/>")}</p>`,
      }),
    });
    if (!r.ok) console.warn("[leads] Supabase și email neconfigurate – lead pierdut:", d.email);
    return NextResponse.json({ ok: true });
  }

  const sb = createAdminClient();

  // Limitare: maximum 5 trimiteri pe oră de la același IP.
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await sb.from("leads").select("id", { count: "exact", head: true }).eq("ip", ip).gte("created_at", since);
  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: m.tooMany }, { status: 429 });
  }

  const row = {
    name: d.name,
    company: d.company || null,
    email: d.email,
    phone: d.phone,
    services: d.services,
    budget: d.budget || null,
    deadline: d.deadline || null,
    message: d.message,
    language,
    source: detectSource(utm),
    // Limba e păstrată și aici, ca să nu se piardă dacă migrarea 0002 nu a fost încă rulată.
    utm: { ...utm, lang: language },
    ip,
    user_agent: userAgent,
    consent: true,
    consent_at: new Date().toISOString(),
  };
  let { data: lead, error } = await sb.from("leads").insert(row).select("*").single();
  if (error && /language/.test(error.message ?? "")) {
    // Coloana `language` lipsește (migrarea 0002 nu e rulată): salvăm lead-ul fără ea.
    const { language: _omit, ...rest } = row;
    ({ data: lead, error } = await sb.from("leads").insert(rest).select("*").single());
    if (lead) lead.language = language;
  }

  if (error || !lead) {
    console.error("[leads] insert", error);
    return NextResponse.json({ error: m.saveFailed }, { status: 500 });
  }

  // Atașament opțional → bucket privat crm-files/leads/{id}/
  const file = fd.get("attachment");
  if (file instanceof File && file.size > 0) {
    if (file.size <= MAX_FILE) {
      const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-100);
      const path = `leads/${lead.id}/${Date.now()}_${safe}`;
      const { error: upErr } = await sb.storage.from("crm-files").upload(path, file, { contentType: file.type || "application/octet-stream" });
      if (!upErr) await sb.from("leads").update({ attachment_path: path }).eq("id", lead.id);
    }
  }

  try {
    await onLeadCreated(sb, lead);
  } catch (e) {
    console.error("[leads] automations", e);
  }

  return NextResponse.json({ ok: true });
}
