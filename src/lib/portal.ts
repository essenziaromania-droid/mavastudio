import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Datele portalului unui client, accesat prin linkul personal /portal/{token}.
 * Totul se citește cu drepturile de sistem, dar strict filtrat pe clientul căruia îi aparține tokenul.
 */

/** Folderele vizibile clientului implicit; restul doar dacă fișierul e marcat „vizibil în portal”. */
export const CLIENT_FOLDERS = ["02 Contract", "09 Livrabile", "10 Facturi"];

/** Fișiere care se pot aproba (nu documentele administrative). */
export const reviewable = (folder: string) => !["02 Contract", "10 Facturi"].includes(folder);

export const isToken = (t: string) => /^[0-9a-f-]{36}$/i.test(t);

export async function clientByToken(token: string) {
  if (!isToken(token)) return null;
  const sb = createAdminClient();
  const { data } = await sb.from("clients").select("id, name, contact_name, email, contact_email, portal_last_seen").eq("portal_token", token).maybeSingle();
  return data;
}

export type PortalFile = {
  id: string;
  name: string;
  folder: string;
  mime: string | null;
  size: number | null;
  created_at: string;
  project_id: string | null;
  review_status: string | null;
  review_note: string | null;
  reviewed_at: string | null;
  url: string | null;
  comments: number;
};

/** Fișierele vizibile clientului, cu linkuri temporare (1 oră) pentru vizualizare și descărcare. */
export async function portalFiles(clientId: string): Promise<PortalFile[]> {
  const sb = createAdminClient();
  const { data: files } = await sb
    .from("files")
    .select("id, name, path, folder, mime, size, created_at, project_id, visible_to_client, review_status, review_note, reviewed_at")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });
  const visible = (files ?? []).filter((f) => f.visible_to_client || CLIENT_FOLDERS.includes(f.folder));
  if (!visible.length) return [];
  const { data: signed } = await sb.storage.from("crm-files").createSignedUrls(visible.map((f) => f.path), 3600);
  const urlOf = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  const { data: comments } = await sb.from("file_comments").select("file_id").in("file_id", visible.map((f) => f.id));
  const count = new Map<string, number>();
  (comments ?? []).forEach((c) => count.set(c.file_id, (count.get(c.file_id) ?? 0) + 1));
  return visible.map(({ path, visible_to_client: _v, ...f }) => ({ ...f, url: urlOf.get(path) ?? null, comments: count.get(f.id) ?? 0 }));
}

/** Un singur fișier al clientului (doar dacă îi este vizibil). */
export async function portalFile(clientId: string, fileId: string) {
  return (await portalFiles(clientId)).find((f) => f.id === fileId) ?? null;
}

export async function portalData(clientId: string) {
  const sb = createAdminClient();
  const [projects, offers, contracts, invoices, files] = await Promise.all([
    sb.from("projects").select("id, name, status, category, start_date, deadline, tasks(id, title, status, deadline, sort)").eq("client_id", clientId).neq("status", "anulat").order("created_at", { ascending: false }),
    sb.from("offers").select("id, number, title, status, total, created_at, valid_until, public_token").eq("client_id", clientId).neq("status", "draft").order("created_at", { ascending: false }),
    sb.from("contracts").select("id, number, title, status, value, created_at, signed_at, provider_signed_at, public_token").eq("client_id", clientId).neq("status", "draft").order("created_at", { ascending: false }),
    sb.from("invoices").select("id, series, number, status, total, paid_amount, issue_date, due_date, provider").eq("client_id", clientId).not("number", "is", null).neq("status", "anulata").order("issue_date", { ascending: false }),
    portalFiles(clientId),
  ]);
  return {
    projects: (projects.data ?? []).map((p) => {
      const tasks = [...((p.tasks as { id: string; title: string; status: string; deadline: string | null; sort: number }[]) ?? [])].sort((a, b) => a.sort - b.sort);
      const done = tasks.filter((t) => t.status === "finalizat").length;
      return { ...p, tasks, progress: tasks.length ? Math.round((done / tasks.length) * 100) : p.status === "finalizat" ? 100 : 0 };
    }),
    offers: offers.data ?? [],
    contracts: contracts.data ?? [],
    invoices: invoices.data ?? [],
    files,
  };
}

/** Marchează vizita clientului (o dată la 10 minute, ca să nu scrie la fiecare click). */
export async function touchPortal(clientId: string, lastSeen: string | null) {
  if (lastSeen && Date.now() - new Date(lastSeen).getTime() < 10 * 60 * 1000) return;
  await createAdminClient().from("clients").update({ portal_last_seen: new Date().toISOString() }).eq("id", clientId);
}

/* ───────── Social media ───────── */

/** Statusurile în care clientul vede postarea (ideile și postările în lucru rămân interne). */
export const CLIENT_SOCIAL_STATUSES = ["de_aprobat", "modificari", "aprobat", "programat", "publicat"];

export type PortalPost = {
  id: string;
  scheduled_at: string;
  platforms: string[];
  format: string;
  caption: string | null;
  hashtags: string | null;
  status: string;
  client_note: string | null;
  published_url: string | null;
  media: { id: string; url: string | null; mime: string | null; name: string }[];
};

/** Lunile (AAAA-LL, ora României) în care clientul are postări vizibile. */
export async function portalSocialMonths(clientId: string): Promise<string[]> {
  const { data } = await createAdminClient().from("social_posts").select("scheduled_at").eq("client_id", clientId).in("status", CLIENT_SOCIAL_STATUSES);
  const fmt = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Bucharest" });
  return Array.from(new Set((data ?? []).map((p) => fmt.format(new Date(p.scheduled_at)).slice(0, 7)))).sort();
}

/** Postările vizibile clientului dintr-o lună, cu imaginile/video-urile lor (linkuri temporare). */
export async function portalSocialPosts(clientId: string, month: string): Promise<PortalPost[]> {
  const sb = createAdminClient();
  const [y, m] = month.split("-").map(Number) as [number, number];
  const from = new Date(Date.UTC(y, m - 1, 1) - 864e5).toISOString();
  const to = new Date(Date.UTC(y, m, 1) + 864e5).toISOString();
  const { data: posts } = await sb
    .from("social_posts")
    .select("id, scheduled_at, platforms, format, caption, hashtags, status, client_note, published_url")
    .eq("client_id", clientId)
    .in("status", CLIENT_SOCIAL_STATUSES)
    .gte("scheduled_at", from)
    .lt("scheduled_at", to)
    .order("scheduled_at");
  const fmt = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Bucharest" });
  const list = (posts ?? []).filter((p) => fmt.format(new Date(p.scheduled_at)).startsWith(month));
  if (!list.length) return [];
  const { data: files } = await sb.from("files").select("id, name, path, mime, social_post_id").in("social_post_id", list.map((p) => p.id)).order("created_at");
  const signed = files?.length ? (await sb.storage.from("crm-files").createSignedUrls(files.map((f) => f.path), 3600)).data ?? [] : [];
  const urlOf = new Map(signed.map((s) => [s.path, s.signedUrl]));
  return list.map((p) => ({
    ...p,
    platforms: (p.platforms as string[]) ?? [],
    media: (files ?? []).filter((f) => f.social_post_id === p.id).map((f) => ({ id: f.id, url: urlOf.get(f.path) ?? null, mime: f.mime, name: f.name })),
  }));
}
