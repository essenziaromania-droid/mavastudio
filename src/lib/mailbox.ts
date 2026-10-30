import "server-only";
import { ImapFlow } from "imapflow";
import { simpleParser, type AddressObject } from "mailparser";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Mesaje centralizate: CRM-ul citește căsuța firmei (IMAP, ex. contact@mavastudio.ro la Hostico)
 * și păstrează DOAR emailurile schimbate cu clienții și lead-urile din CRM (după adresa de email).
 * Parola stă în tabelul „integrations”, care nu poate fi citit din CRM (doar de server).
 */

export type ImapConfig = { host: string; port: number; user: string; password: string };
type MailConn = { config: ImapConfig; folders: Record<string, { validity: string; last_uid: number }>; last_sync?: string; last_error?: string | null };

export async function getMailConnection(): Promise<MailConn | null> {
  const { data } = await createAdminClient().from("integrations").select("data").eq("provider", "imap").maybeSingle();
  return data?.data?.config ? (data.data as MailConn) : null;
}

async function saveConn(conn: MailConn) {
  await createAdminClient().from("integrations").upsert({ provider: "imap", account_email: conn.config.user, data: conn, connected_at: new Date().toISOString() });
}

function client(cfg: ImapConfig) {
  return new ImapFlow({ host: cfg.host, port: cfg.port, secure: cfg.port === 993, auth: { user: cfg.user, pass: cfg.password }, logger: false, socketTimeout: 30_000, greetingTimeout: 15_000 });
}

/** Verifică datele de conectare (folosit la salvare). */
export async function testImap(cfg: ImapConfig) {
  const c = client(cfg);
  try {
    await c.connect();
    const boxes = await c.list();
    await c.logout();
    return { ok: true as const, folders: boxes.length };
  } catch (e) {
    try {
      c.close();
    } catch {}
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false as const, error: /auth|login|credentials/i.test(msg) ? "Utilizatorul sau parola nu sunt corecte." : `Nu m-am putut conecta la server: ${msg}` };
  }
}

const lower = (s?: string | null) => (s ?? "").trim().toLowerCase();
const addrs = (a?: AddressObject | AddressObject[]) => (Array.isArray(a) ? a : a ? [a] : []).flatMap((x) => x.value.map((v) => lower(v.address))).filter(Boolean);

/** Adresele de email ale clienților și lead-urilor → id-urile lor. */
async function knownAddresses() {
  const sb = createAdminClient();
  const [{ data: clients }, { data: leads }] = await Promise.all([
    sb.from("clients").select("id, email, contact_email"),
    sb.from("leads").select("id, email, client_id"),
  ]);
  const map = new Map<string, { client_id: string | null; lead_id: string | null }>();
  for (const l of leads ?? []) if (l.email) map.set(lower(l.email), { client_id: l.client_id ?? null, lead_id: l.id });
  // Clienții au prioritate față de lead-uri.
  for (const c of clients ?? []) for (const e of [c.email, c.contact_email]) if (e) map.set(lower(e), { client_id: c.id, lead_id: map.get(lower(e))?.lead_id ?? null });
  return map;
}

/**
 * Citește emailurile noi din Inbox și din Trimise și le salvează pe cele cu clienții și lead-urile.
 * La prima rulare se uită în urmă `sinceDays` zile. Procesează cel mult `max` emailuri pe rulare.
 */
export async function syncMailbox({ max = 150, sinceDays = 30 } = {}) {
  const conn = await getMailConnection();
  if (!conn) return null;
  const sb = createAdminClient();
  const known = await knownAddresses();
  const own = new Set([lower(conn.config.user), lower(process.env.ADMIN_NOTIFY_EMAIL), "contact@mavastudio.ro"].filter(Boolean));
  const c = client(conn.config);
  let saved = 0;
  let scanned = 0;
  try {
    await c.connect();
    const boxes = await c.list();
    const inbox = boxes.find((b) => b.specialUse === "\\Inbox" || b.path.toUpperCase() === "INBOX");
    const sent = boxes.find((b) => b.specialUse === "\\Sent") ?? boxes.find((b) => /sent|trimise/i.test(b.path));
    for (const box of [inbox, sent].filter(Boolean) as typeof boxes) {
      const lock = await c.getMailboxLock(box.path);
      try {
        const status = c.mailbox as { uidValidity: bigint; uidNext: number };
        const validity = String(status.uidValidity);
        const state = conn.folders[box.path];
        const fresh = !state || state.validity !== validity;
        const range = fresh ? { since: new Date(Date.now() - sinceDays * 864e5) } : { uid: `${state.last_uid + 1}:*` };
        const found = ((await c.search(range, { uid: true })) || []) as unknown as number[];
        const uids = found.map(Number).filter((u) => fresh || u > state!.last_uid).sort((a, b) => a - b).slice(0, max - scanned);
        let lastUid = fresh ? 0 : state!.last_uid;
        if (!uids.length) {
          conn.folders[box.path] = { validity, last_uid: fresh ? Math.max(0, status.uidNext - 1) : lastUid };
          continue;
        }
        // Întâi doar antetele (rapid), apoi conținutul complet doar pentru emailurile cu clienți/lead-uri.
        const relevant: number[] = [];
        type Env = { uid: number; envelope?: { from?: { address?: string }[]; to?: { address?: string }[]; cc?: { address?: string }[] } };
        const headers = c.fetch(uids.join(","), { uid: true, envelope: true }, { uid: true }) as unknown as AsyncIterable<Env>;
        for await (const m of headers) {
          scanned++;
          lastUid = Math.max(lastUid, m.uid);
          const env = m.envelope;
          const all = [...(env?.from ?? []), ...(env?.to ?? []), ...(env?.cc ?? [])].map((a) => lower(a.address));
          if (all.some((a) => !own.has(a) && known.has(a))) relevant.push(m.uid);
        }
        for (const uid of relevant) {
          const msg = (await (c.fetchOne as unknown as (seq: string, q: object, o: object) => Promise<{ source?: Buffer } | false>)(String(uid), { source: true }, { uid: true }));
          if (!msg || !msg.source) continue;
          const p = await simpleParser(msg.source);
          const from = addrs(p.from)[0] ?? "";
          const to = addrs(p.to);
          const cc = addrs(p.cc);
          const other = [from, ...to, ...cc].find((a) => !own.has(a) && known.has(a));
          if (!other) continue;
          const who = known.get(other)!;
          const { error } = await sb.from("messages").insert({
            client_id: who.client_id,
            lead_id: who.lead_id,
            direction: own.has(from) ? "out" : "in",
            source: "imap",
            folder: box.path,
            message_id: p.messageId ?? `${box.path}:${validity}:${uid}`,
            in_reply_to: typeof p.inReplyTo === "string" ? p.inReplyTo : null,
            from_email: from,
            from_name: p.from?.value[0]?.name || null,
            to_emails: to,
            cc_emails: cc,
            subject: p.subject ?? null,
            body_text: (p.text ?? "").slice(0, 20000),
            attachment_names: (p.attachments ?? []).map((a) => a.filename ?? "atașament").slice(0, 20),
            sent_at: (p.date ?? new Date()).toISOString(),
            read: own.has(from),
          });
          if (!error) saved++;
        }
        conn.folders[box.path] = { validity, last_uid: lastUid };
      } finally {
        lock.release();
      }
      if (scanned >= max) break;
    }
    await c.logout();
    conn.last_sync = new Date().toISOString();
    conn.last_error = null;
  } catch (e) {
    try {
      c.close();
    } catch {}
    conn.last_error = e instanceof Error ? e.message : String(e);
    console.error("[mailbox]", e);
  }
  await saveConn(conn);
  return { saved, scanned, error: conn.last_error ?? null };
}

/** Pornește o sincronizare doar dacă ultima a fost acum mai mult de `minutes` minute. */
export async function syncMailboxIfStale(minutes = 3) {
  const conn = await getMailConnection();
  if (!conn) return null;
  if (conn.last_sync && Date.now() - new Date(conn.last_sync).getTime() < minutes * 60e3) return null;
  return syncMailbox({ max: 80 });
}

/** Emailurile trimise de CRM (oferte, contracte, facturi, portal) apar și ele în istoricul clientului. */
export async function logOutgoing(m: { to: string[]; subject: string; html: string; messageId?: string | null }) {
  try {
    const known = await knownAddresses();
    const target = m.to.map(lower).find((a) => known.has(a));
    if (!target) return;
    const who = known.get(target)!;
    const text = m.html
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|li|tr|h1|h2|div)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    await createAdminClient().from("messages").insert({
      client_id: who.client_id,
      lead_id: who.lead_id,
      direction: "out",
      source: "crm",
      message_id: m.messageId ?? null,
      from_email: lower(process.env.ADMIN_NOTIFY_EMAIL) || "contact@mavastudio.ro",
      from_name: "MAVA Studio",
      to_emails: m.to.map(lower),
      subject: m.subject,
      body_text: text.slice(0, 20000),
      read: true,
    });
  } catch (e) {
    console.error("[mailbox] jurnal email trimis", e);
  }
}
