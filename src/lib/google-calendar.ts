import "server-only";
import { createHash } from "crypto";
import { waitUntil } from "@vercel/functions";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE } from "@/content/site";
import { accessToken, getDriveConnection, type DriveConn } from "@/lib/google-drive";

/**
 * Sincronizare CRM → Google Calendar, într-un calendar separat „MAVA Studio – CRM”.
 * Permisiunea „calendar.app.created” dă acces DOAR la calendarele create de aplicație.
 *
 * Fiecare element din CRM are un ID fix de eveniment în Google (prefix + id-ul din CRM),
 * deci sincronizarea creează, actualizează sau șterge fără dubluri. Se trimite doar ce s-a schimbat.
 */

export const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar.app.created";
const API = "https://www.googleapis.com/calendar/v3";
const TZ = "Europe/Bucharest";
const crm = (path: string) => `${SITE.url}/crm${path}`;

export type CalendarTypes = { events: boolean; tasks: boolean; projects: boolean; social: boolean };
export const DEFAULT_CAL_TYPES: CalendarTypes = { events: true, tasks: true, projects: true, social: true };
export const CAL_TYPE_LABELS: Record<keyof CalendarTypes, string> = {
  events: "Întâlniri și evenimente (Calendar CRM)",
  tasks: "Termenele task-urilor nefinalizate",
  projects: "Termenele proiectelor",
  social: "Postările de social media programate",
};

export const hasCalendarScope = (conn: DriveConn | null) => !!(conn?.data.scopes ?? "").includes(CALENDAR_SCOPE);

type GEvent = {
  summary: string;
  description?: string;
  location?: string;
  colorId?: string;
  start: { date?: string; dateTime?: string; timeZone?: string };
  end: { date?: string; dateTime?: string; timeZone?: string };
  source?: { title: string; url: string };
};

const addDays = (ymd: string, n: number) => {
  const d = new Date(`${ymd}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};
const allDay = (ymd: string) => ({ start: { date: ymd }, end: { date: addDays(ymd, 1) } });
const timed = (startIso: string, endIso: string) => ({ start: { dateTime: startIso, timeZone: TZ }, end: { dateTime: endIso, timeZone: TZ } });
const ymdRo = (iso: string) => new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date(iso));
// ID-urile Google acceptă doar litere a–v și cifre: prefixul + UUID-ul fără cratime respectă regula.
const gid = (prefix: string, uuid: string) => `${prefix}${uuid.replace(/-/g, "")}`;

const PLATFORMS: Record<string, string> = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube" };
const EVENT_TYPES: Record<string, string> = { intalnire: "Întâlnire", deadline: "Deadline", lansare: "Lansare", review: "Review", prezentare: "Prezentare", altul: "Eveniment" };
const SOCIAL_STATUS: Record<string, string> = { idee: "Idee", in_lucru: "În lucru", de_aprobat: "La client", modificari: "Modificări cerute", aprobat: "Aprobat", programat: "Programat", publicat: "Publicat" };

/** Toate evenimentele care ar trebui să existe acum în Google Calendar. */
async function desiredEvents(types: CalendarTypes) {
  const sb = createAdminClient();
  const from = new Date(Date.now() - 30 * 864e5).toISOString();
  const to = new Date(Date.now() + 365 * 864e5).toISOString();
  const out = new Map<string, { source: string; body: GEvent }>();

  if (types.events) {
    const { data } = await sb.from("events").select("id, title, type, start_at, end_at, all_day, location, description, clients(name), projects(name)").gte("start_at", from).lte("start_at", to);
    for (const e of data ?? []) {
      const client = (e.clients as unknown as { name: string } | null)?.name;
      const project = (e.projects as unknown as { name: string } | null)?.name;
      const end = e.end_at ?? new Date(new Date(e.start_at).getTime() + 3600e3).toISOString();
      out.set(gid("mvae", e.id), {
        source: "event",
        body: {
          summary: `${e.title}${client ? ` · ${client}` : ""}`,
          description: [EVENT_TYPES[e.type] ?? e.type, project && `Proiect: ${project}`, e.description, `Deschide în CRM: ${crm("/calendar")}`].filter(Boolean).join("\n"),
          location: e.location ?? undefined,
          colorId: "9",
          ...(e.all_day ? { start: { date: ymdRo(e.start_at) }, end: { date: addDays(ymdRo(end), e.end_at ? 1 : 1) } } : timed(e.start_at, end)),
        },
      });
    }
  }

  if (types.tasks) {
    const { data } = await sb.from("tasks").select("id, title, status, deadline, priority, projects(name), clients(name), profiles:assignee_id(full_name)").neq("status", "finalizat").not("deadline", "is", null).gte("deadline", from.slice(0, 10)).lte("deadline", to.slice(0, 10));
    for (const t of data ?? []) {
      const project = (t.projects as unknown as { name: string } | null)?.name;
      const client = (t.clients as unknown as { name: string } | null)?.name;
      const who = (t.profiles as unknown as { full_name: string } | null)?.full_name;
      out.set(gid("mvat", t.id), {
        source: "task",
        body: {
          summary: `✅ ${t.title}${client ? ` · ${client}` : ""}`,
          description: [project && `Proiect: ${project}`, who && `Responsabil: ${who}`, `Prioritate: ${t.priority}`, `Deschide în CRM: ${crm(`/taskuri/${t.id}`)}`].filter(Boolean).join("\n"),
          colorId: t.priority === "urgenta" || t.priority === "ridicata" ? "6" : "5",
          ...allDay(t.deadline!),
        },
      });
    }
  }

  if (types.projects) {
    const { data } = await sb.from("projects").select("id, name, deadline, status, clients(name)").not("deadline", "is", null).not("status", "in", "(finalizat,anulat)").gte("deadline", from.slice(0, 10)).lte("deadline", to.slice(0, 10));
    for (const p of data ?? []) {
      const client = (p.clients as unknown as { name: string } | null)?.name;
      out.set(gid("mvap", p.id), {
        source: "project",
        body: { summary: `🏁 Termen proiect: ${p.name}`, description: [client && `Client: ${client}`, `Deschide în CRM: ${crm(`/proiecte/${p.id}`)}`].filter(Boolean).join("\n"), colorId: "11", ...allDay(p.deadline!) },
      });
    }
  }

  if (types.social) {
    const { data } = await sb.from("social_posts").select("id, title, format, platforms, scheduled_at, status, clients(name)").gte("scheduled_at", from).lte("scheduled_at", to);
    for (const p of data ?? []) {
      const client = (p.clients as unknown as { name: string } | null)?.name;
      const end = new Date(new Date(p.scheduled_at).getTime() + 30 * 60e3).toISOString();
      out.set(gid("mvas", p.id), {
        source: "social",
        body: {
          summary: `📣 ${((p.platforms as string[]) ?? []).map((x) => PLATFORMS[x] ?? x).join(", ")} · ${client ?? ""}${p.title ? ` · ${p.title}` : ""}`,
          description: [`Status: ${SOCIAL_STATUS[p.status] ?? p.status}`, `Deschide în CRM: ${crm(`/social/${p.id}`)}`].join("\n"),
          colorId: p.status === "publicat" ? "2" : "3",
          ...timed(p.scheduled_at, end),
        },
      });
    }
  }
  return out;
}

async function call(token: string, url: string, method: string, body?: unknown) {
  return fetch(url, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
}

/** Creează (o singură dată) calendarul „MAVA Studio – CRM” și îl reține în conexiune. */
async function ensureCalendar(conn: DriveConn, token: string) {
  if (conn.data.calendar_id) return conn.data.calendar_id;
  const res = await call(token, `${API}/calendars`, "POST", { summary: "MAVA Studio – CRM", description: "Întâlniri, termene și postări din CRM-ul MAVA Studio. Se actualizează automat.", timeZone: TZ });
  const j = await res.json();
  if (!res.ok) throw new Error(`Google Calendar ${res.status}: ${JSON.stringify(j).slice(0, 200)}`);
  await createAdminClient().from("integrations").update({ data: { ...conn.data, calendar_id: j.id } }).eq("provider", "google");
  conn.data.calendar_id = j.id;
  return j.id as string;
}

/**
 * Aduce Google Calendar la zi cu CRM-ul. Trimite cel mult `max` modificări pe rulare
 * (restul la rularea următoare), ca să nu depășească timpul unei cereri.
 */
export async function syncCalendar(max = 120): Promise<{ created: number; updated: number; deleted: number; pending: number } | null> {
  const conn = await getDriveConnection();
  if (!conn || !hasCalendarScope(conn)) return null;
  const sb = createAdminClient();
  const types = { ...DEFAULT_CAL_TYPES, ...(conn.data.cal_types ?? {}) };
  const token = await accessToken(conn);
  const cal = encodeURIComponent(await ensureCalendar(conn, token));
  const desired = await desiredEvents(types);
  const { data: rows } = await sb.from("calendar_sync").select("event_id, hash");
  const known = new Map((rows ?? []).map((r) => [r.event_id, r.hash]));
  let created = 0;
  let updated = 0;
  let deleted = 0;
  let ops = 0;
  let pending = 0;

  for (const [id, { source, body }] of desired) {
    const hash = createHash("sha1").update(JSON.stringify(body)).digest("hex");
    if (known.get(id) === hash) continue;
    if (ops >= max) {
      pending++;
      continue;
    }
    ops++;
    let res = await call(token, `${API}/calendars/${cal}/events/${id}`, "PUT", { ...body, status: "confirmed" });
    if (res.status === 404) {
      res = await call(token, `${API}/calendars/${cal}/events`, "POST", { id, ...body });
      if (res.ok) created++;
    } else if (res.ok) updated++;
    if (!res.ok) {
      console.error("[calendar]", id, res.status, (await res.text()).slice(0, 200));
      continue;
    }
    await sb.from("calendar_sync").upsert({ event_id: id, source, hash, updated_at: new Date().toISOString() });
  }

  for (const id of Array.from(known.keys())) {
    if (desired.has(id)) continue;
    if (ops >= max) {
      pending++;
      continue;
    }
    ops++;
    const res = await call(token, `${API}/calendars/${cal}/events/${id}`, "DELETE");
    if (res.ok || res.status === 404 || res.status === 410) {
      await sb.from("calendar_sync").delete().eq("event_id", id);
      deleted++;
    }
  }
  return { created, updated, deleted, pending };
}

/**
 * Pornește sincronizarea în fundal, după ce acțiunea curentă își termină modificările.
 * Se apelează la începutul acțiunilor care schimbă evenimente, task-uri, proiecte sau postări.
 */
export function scheduleCalendarSync() {
  waitUntil(
    new Promise((r) => setTimeout(r, 2500))
      .then(() => syncCalendar(60))
      .catch((e) => console.error("[calendar] sincronizare", e)),
  );
}

/** Linkul de deschidere a calendarului în Google Calendar. */
export function calendarUrl(calendarId: string) {
  return `https://calendar.google.com/calendar/r?cid=${encodeURIComponent(calendarId)}`;
}
