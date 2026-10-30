import "server-only";
import { createAdminClient } from "@/lib/supabase/server";
import { SITE } from "@/content/site";
import { DRIVE_FOLDERS } from "@/lib/crm/constants";

/**
 * Integrarea cu Google Drive (contul Google al firmei, conectat din Setări → Integrări).
 * Folosește permisiunea „drive.file”: aplicația vede DOAR fișierele și dosarele create de ea.
 *
 * Structura în Drive:
 *   MAVA Studio – CRM / Clienți / {Client} / 01 Brief … 10 Facturi
 *   MAVA Studio – CRM / Intern / …   (fișiere fără client)
 *
 * Toate funcțiile sunt „best effort”: dacă Drive nu e conectat sau dă eroare, CRM-ul merge normal.
 */

export const GOOGLE_SCOPES = ["https://www.googleapis.com/auth/drive.file", "openid", "email"];
export const googleRedirectUri = () => `${SITE.url}/api/google/callback`;
export const googleConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

const FOLDER = "application/vnd.google-apps.folder";
const API = "https://www.googleapis.com/drive/v3";
const UPLOAD = "https://www.googleapis.com/upload/drive/v3";

type DriveConn = { refresh_token: string; account_email: string | null; data: { root_id?: string; root_url?: string; clients_id?: string; intern_id?: string } };

export async function getDriveConnection(): Promise<DriveConn | null> {
  const { data } = await createAdminClient().from("integrations").select("refresh_token, account_email, data").eq("provider", "google").maybeSingle();
  return data?.refresh_token ? (data as DriveConn) : null;
}

/* ───────── OAuth ───────── */

export function googleAuthUrl(state: string) {
  const q = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectUri(),
    response_type: "code",
    scope: GOOGLE_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${q}`;
}

export async function exchangeCode(code: string) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, redirect_uri: googleRedirectUri(), grant_type: "authorization_code" }),
  });
  const j = await res.json();
  if (!res.ok || !j.refresh_token) throw new Error(j.error_description || j.error || "Google nu a trimis cheia de acces. Încearcă din nou.");
  let email: string | null = null;
  try {
    email = JSON.parse(Buffer.from(String(j.id_token).split(".")[1]!, "base64url").toString()).email ?? null;
  } catch {}
  return { refresh_token: j.refresh_token as string, access_token: j.access_token as string, email };
}

let cached: { token: string; exp: number } | null = null;

async function accessToken(conn: DriveConn) {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ refresh_token: conn.refresh_token, client_id: process.env.GOOGLE_CLIENT_ID!, client_secret: process.env.GOOGLE_CLIENT_SECRET!, grant_type: "refresh_token" }),
  });
  const j = await res.json();
  if (!res.ok) throw new Error(`Google: ${j.error_description || j.error}`);
  cached = { token: j.access_token, exp: Date.now() + Number(j.expires_in ?? 3600) * 1000 };
  return cached.token;
}

async function drive<T>(token: string, url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers ?? {}) } });
  if (!res.ok) throw new Error(`Google Drive ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (res.status === 204 ? null : await res.json()) as T;
}

async function createFolder(token: string, name: string, parent?: string) {
  return drive<{ id: string; webViewLink: string }>(token, `${API}/files?fields=id,webViewLink`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, mimeType: FOLDER, ...(parent ? { parents: [parent] } : {}) }),
  });
}

/** La conectare: creează dosarele principale în Drive-ul firmei. */
export async function createRootFolders(accessTok: string) {
  const root = await createFolder(accessTok, "MAVA Studio – CRM");
  const clients = await createFolder(accessTok, "Clienți", root.id);
  const intern = await createFolder(accessTok, "Intern", root.id);
  return { root_id: root.id, root_url: root.webViewLink, clients_id: clients.id, intern_id: intern.id };
}

/* ───────── Dosare clienți ───────── */

/** Creează (o singură dată) dosarul clientului cu cele 10 subfoldere. Întoarce maparea folder → id. */
export async function ensureClientFolder(clientId: string): Promise<Record<string, string> | null> {
  const conn = await getDriveConnection();
  if (!conn?.data.clients_id) return null;
  const sb = createAdminClient();
  const { data: c } = await sb.from("clients").select("id, name, drive_folder_id, drive_subfolders").eq("id", clientId).single();
  if (!c) return null;
  const subs = (c.drive_subfolders ?? {}) as Record<string, string>;
  if (c.drive_folder_id && DRIVE_FOLDERS.every((f) => subs[f])) return subs;

  const token = await accessToken(conn);
  let folderId = c.drive_folder_id as string | null;
  let folderUrl: string | null = null;
  if (!folderId) {
    const f = await createFolder(token, c.name, conn.data.clients_id);
    folderId = f.id;
    folderUrl = f.webViewLink;
  }
  for (const name of DRIVE_FOLDERS) {
    if (!subs[name]) subs[name] = (await createFolder(token, name, folderId)).id;
  }
  await sb.from("clients").update({ drive_folder_id: folderId, ...(folderUrl ? { drive_folder_url: folderUrl } : {}), drive_subfolders: subs }).eq("id", clientId);
  await sb.from("projects").update({ drive_folder_url: folderUrl ?? `https://drive.google.com/drive/folders/${folderId}` }).eq("client_id", clientId).is("drive_folder_url", null);
  return subs;
}

/* ───────── Fișiere ───────── */

/** Copiază un fișier din CRM în dosarul potrivit din Drive (o singură dată). */
export async function syncFileToDrive(fileId: string) {
  try {
    const conn = await getDriveConnection();
    if (!conn) return;
    const sb = createAdminClient();
    const { data: f } = await sb.from("files").select("id, name, path, mime, folder, client_id, drive_file_id").eq("id", fileId).single();
    if (!f || f.drive_file_id) return;

    const parent = f.client_id ? (await ensureClientFolder(f.client_id))?.[f.folder] : conn.data.intern_id;
    if (!parent) return;
    const { data: blob, error } = await sb.storage.from("crm-files").download(f.path);
    if (error || !blob) throw error ?? new Error("Fișierul nu a putut fi citit din stocare.");
    const bytes = Buffer.from(await blob.arrayBuffer());

    const token = await accessToken(conn);
    // Încărcare „resumable”: merge și pentru fișiere mari (video).
    const init = await fetch(`${UPLOAD}/files?uploadType=resumable&fields=id,webViewLink`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": f.mime || "application/octet-stream", "X-Upload-Content-Length": String(bytes.length) },
      body: JSON.stringify({ name: f.name, parents: [parent] }),
    });
    const location = init.headers.get("location");
    if (!init.ok || !location) throw new Error(`Google Drive ${init.status}: ${(await init.text()).slice(0, 200)}`);
    const up = await fetch(location, { method: "PUT", headers: { "Content-Type": f.mime || "application/octet-stream", "Content-Length": String(bytes.length) }, body: new Uint8Array(bytes) });
    const j = await up.json();
    if (!up.ok) throw new Error(`Google Drive ${up.status}: ${JSON.stringify(j).slice(0, 200)}`);
    await sb.from("files").update({ drive_file_id: j.id, drive_url: j.webViewLink ?? `https://drive.google.com/file/d/${j.id}/view` }).eq("id", f.id);
  } catch (e) {
    console.error("[drive] sincronizare fișier", fileId, e);
  }
}

/** La ștergerea din CRM, fișierul din Drive e mutat în coș (se poate recupera 30 de zile). */
export async function trashDriveFile(driveFileId: string | null | undefined) {
  if (!driveFileId) return;
  try {
    const conn = await getDriveConnection();
    if (!conn) return;
    const token = await accessToken(conn);
    await drive(token, `${API}/files/${driveFileId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ trashed: true }) });
  } catch (e) {
    console.error("[drive] coș", e);
  }
}

/** Sincronizare completă: dosare pentru toți clienții și copie pentru fișierele încă nesincronizate. */
export async function syncAllToDrive(limit = 40) {
  const sb = createAdminClient();
  const { data: clients } = await sb.from("clients").select("id").is("drive_folder_id", null).limit(200);
  for (const c of clients ?? []) await ensureClientFolder(c.id);
  const { data: files } = await sb.from("files").select("id").is("drive_file_id", null).order("created_at").limit(limit);
  for (const f of files ?? []) await syncFileToDrive(f.id);
  const { count } = await sb.from("files").select("id", { count: "exact", head: true }).is("drive_file_id", null);
  return { clients: clients?.length ?? 0, files: files?.length ?? 0, remaining: count ?? 0 };
}
