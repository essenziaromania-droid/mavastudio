import Link from "next/link";
import { waitUntil } from "@vercel/functions";
import { RefreshCw } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { PageHeader, Panel } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { MessageThread, type MessageRow } from "@/components/crm/messages";
import { markMessagesRead, runMailSync } from "../actions/messages";
import { getMailConnection, syncMailboxIfStale } from "@/lib/mailbox";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Mesaje" };

export default async function MessagesPage({ searchParams }: { searchParams: { f?: string; synced?: string; err?: string; replied?: string } }) {
  const s = await requireModule("mesaje");
  const conn = await getMailConnection().catch(() => null);
  // Verifică emailurile noi în fundal (cel mult o dată la 3 minute).
  if (conn) waitUntil(syncMailboxIfStale(3).catch(() => null));
  const unreadOnly = searchParams.f === "necitite";
  let q = s.sb.from("messages").select("id, direction, source, from_email, from_name, to_emails, subject, body_text, attachment_names, sent_at, read, message_id, client_id, clients(id, name), leads(id, name)").order("sent_at", { ascending: false }).limit(100);
  if (unreadOnly) q = q.eq("read", false).eq("direction", "in");
  const [{ data, error }, { count: unread }] = await Promise.all([q, s.sb.from("messages").select("id", { count: "exact", head: true }).eq("read", false).eq("direction", "in")]);

  return (
    <>
      <PageHeader
        title="Mesaje"
        sub="Emailurile schimbate cu clienții și lead-urile, din căsuța firmei și cele trimise din CRM."
        actions={
          <div className="flex gap-2">
            {!!unread && (
              <form action={markMessagesRead}><SubmitButton className="btn-ghost !py-2.5">Marchează toate citite</SubmitButton></form>
            )}
            {conn && (
              <form action={runMailSync}>
                <input type="hidden" name="back" value="/crm/mesaje" />
                <SubmitButton className="!py-2.5" pendingText="Se verifică..."><RefreshCw className="h-4 w-4" /> Verifică emailuri noi</SubmitButton>
              </form>
            )}
          </div>
        }
      />
      {error && <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Rulează migrarea supabase/migrations/0009_messages.sql în Supabase pentru a activa mesajele.</p>}
      {!conn && !error && <p className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-brand-blue">Conectează căsuța de email a firmei din <Link href="/crm/setari?tab=integrari" className="font-semibold underline">Setări → Integrări</Link> ca să apară aici și emailurile primite de la clienți. Emailurile trimise din CRM apar deja.</p>}
      {searchParams.synced && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{Number(searchParams.synced) ? `${searchParams.synced} emailuri noi adăugate.` : "Nu există emailuri noi de la clienți."}</p>}
      {searchParams.replied && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Emailul a fost trimis.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}

      <div className="mb-4 flex gap-2 text-sm">
        <Link href="/crm/mesaje" className={!unreadOnly ? "btn-primary btn-sm" : "btn-ghost btn-sm"}>Toate</Link>
        <Link href="/crm/mesaje?f=necitite" className={unreadOnly ? "btn-primary btn-sm" : "btn-ghost btn-sm"}>Necitite{unread ? ` (${unread})` : ""}</Link>
        {conn?.last_sync && <span className="ml-auto self-center text-xs text-muted">Ultima verificare: {formatDate(conn.last_sync, true)}</span>}
      </div>
      <Panel>
        <MessageThread messages={(data ?? []) as unknown as MessageRow[]} back="/crm/mesaje" showClient />
      </Panel>
    </>
  );
}
