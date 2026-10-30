import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight, Paperclip, Reply } from "lucide-react";
import { replyToClient } from "@/app/crm/actions/messages";
import { SubmitButton } from "./client-ui";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export type MessageRow = {
  id: string;
  direction: "in" | "out";
  source: string;
  from_email: string | null;
  from_name: string | null;
  to_emails: string[];
  subject: string | null;
  body_text: string | null;
  attachment_names: string[];
  sent_at: string;
  read: boolean;
  message_id: string | null;
  client_id?: string | null;
  clients?: { id: string; name: string } | null;
  leads?: { id: string; name: string } | null;
};

/** Textul fără citatele din răspunsurile anterioare („On … wrote:”, „>”), ca firul să rămână lizibil. */
function stripQuoted(t: string) {
  const lines = t.split("\n");
  const cut = lines.findIndex((l) => /^(On .+wrote:|În .+a scris:|Pe .+a scris:|-{2,}\s*Original Message|De la:|From:)/i.test(l.trim()) || l.startsWith(">"));
  return (cut > 0 ? lines.slice(0, cut) : lines).join("\n").trim();
}

/** Conversația cu un client: emailurile primite și trimise, cu răspuns direct din CRM. */
export function MessageThread({ messages, back, replyTo, showClient = false }: { messages: MessageRow[]; back: string; replyTo?: string | null; showClient?: boolean }) {
  const last = messages.find((m) => m.direction === "in") ?? messages[0];
  const subject = last?.subject ? (/^re:/i.test(last.subject) ? last.subject : `Re: ${last.subject}`) : "";
  return (
    <div className="space-y-4">
      {replyTo && (
        <details className="rounded-2xl border border-line bg-white p-4 shadow-card" open={!messages.length}>
          <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-brand-blue"><Reply className="h-4 w-4" /> {messages.length ? "Răspunde" : "Scrie un email"}</summary>
          <form action={replyToClient} className="mt-3 space-y-3">
            <input type="hidden" name="back" value={back} />
            <input type="hidden" name="in_reply_to" value={last?.direction === "in" ? last.message_id ?? "" : ""} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input name="to" type="email" required defaultValue={replyTo} className="input text-sm" placeholder="destinatar" />
              <input name="subject" defaultValue={subject} className="input text-sm" placeholder="Subiect" />
            </div>
            <textarea name="body" required rows={6} className="input text-sm" placeholder="Mesajul tău..." />
            <SubmitButton className="btn-sm" pendingText="Se trimite...">Trimite</SubmitButton>
            <p className="text-[11px] text-muted">Se trimite de pe adresa firmei, iar răspunsul clientului ajunge tot în căsuța firmei și apoi aici.</p>
          </form>
        </details>
      )}
      {!messages.length && <p className="py-8 text-center text-sm text-muted">Nu există încă emailuri cu acest client.</p>}
      <ul className="space-y-3">
        {messages.map((m) => {
          const body = stripQuoted(m.body_text ?? "");
          const inbound = m.direction === "in";
          return (
            <li key={m.id} className={cn("rounded-2xl border p-4", inbound ? "border-line bg-white" : "border-blue-100 bg-blue-50/40", !m.read && "ring-2 ring-brand-blue/30")}>
              <details open={!m.read || messages.length <= 3}>
                <summary className="flex cursor-pointer list-none flex-wrap items-start gap-x-3 gap-y-1">
                  <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", inbound ? "bg-emerald-50 text-emerald-600" : "bg-blue-100 text-brand-blue")}>
                    {inbound ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm", m.read ? "font-semibold text-ink" : "font-extrabold text-ink")}>{m.subject || "(fără subiect)"}</span>
                    <span className="block truncate text-xs text-muted">
                      {inbound ? `De la ${m.from_name ? `${m.from_name} <${m.from_email}>` : m.from_email}` : `Către ${m.to_emails.join(", ")}`}
                      {m.source === "crm" && " · trimis din CRM"}
                      {showClient && (m.clients || m.leads) && (
                        <> · <Link href={m.clients ? `/crm/clienti/${m.clients.id}?tab=mesaje` : `/crm/leaduri/${m.leads!.id}`} className="text-brand-blue">{m.clients?.name ?? `Lead: ${m.leads!.name}`}</Link></>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{formatDate(m.sent_at, true)}</span>
                </summary>
                {body && <p className="mt-3 whitespace-pre-line border-t border-line pt-3 text-sm leading-relaxed text-body">{body.length > 4000 ? body.slice(0, 4000) + "…" : body}</p>}
                {!!m.attachment_names.length && (
                  <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted"><Paperclip className="h-3.5 w-3.5" /> {m.attachment_names.join(", ")} <span className="italic">(deschide-le din căsuța de email)</span></p>
                )}
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
