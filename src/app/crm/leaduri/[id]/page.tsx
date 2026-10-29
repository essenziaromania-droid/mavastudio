import { notFound } from "next/navigation";
import { FileText, Paperclip, UserPlus } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { convertLeadToClient, deleteLead, updateLead, updateLeadStatus } from "../../actions/sales";
import { Badge, Field, Input, KeyVal, PageHeader, Panel, Select, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { NoteForm, Timeline, type ActivityRow } from "@/components/crm/timeline";
import { LEAD_SOURCE, LEAD_STATUS } from "@/lib/crm/constants";
import { PROJECT_TYPES } from "@/content/site";
import { formatDate } from "@/lib/utils";
import { getStaff } from "@/lib/crm/queries";
import Link from "next/link";

export const metadata = { title: "Lead" };

export default async function LeadPage({ params }: { params: { id: string } }) {
  const { sb } = await requireModule("leads");
  const { data: lead } = await sb.from("leads").select("*").eq("id", params.id).maybeSingle();
  if (!lead) notFound();
  const [{ data: acts }, staff] = await Promise.all([
    sb.from("activities").select("id, type, title, description, created_at, profiles:actor_id(full_name)").eq("lead_id", lead.id).order("created_at", { ascending: false }),
    getStaff(sb),
  ]);
  let attachmentUrl: string | null = null;
  if (lead.attachment_path) {
    const { data } = await sb.storage.from("crm-files").createSignedUrl(lead.attachment_path, 3600);
    attachmentUrl = data?.signedUrl ?? null;
  }
  const serviceLabel = Object.fromEntries(PROJECT_TYPES.map((t) => [t.value, t.label]));
  const utm = (lead.utm ?? {}) as Record<string, string>;

  return (
    <>
      <PageHeader
        back={{ href: "/crm/leaduri", label: "Lead-uri" }}
        title={lead.name}
        sub={<>{lead.company ?? "Persoană fizică"} · primit {formatDate(lead.created_at, true)} · {LEAD_SOURCE[lead.source] ?? lead.source}{(lead.language ?? lead.utm?.lang) === "en" && <b className="ml-2 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-brand-blue">🇬🇧 Client internațional · răspunde în engleză</b>}</>}
        actions={
          <>
            <AutoSubmitSelect name="status" defaultValue={lead.status} options={optionsFrom(LEAD_STATUS)} action={updateLeadStatus} hidden={{ id: lead.id }} className="!py-2.5 !text-sm" />
            {lead.client_id ? (
              <>
                <Link href={`/crm/clienti/${lead.client_id}`} className="btn-ghost !py-2.5">Fișa clientului</Link>
                <Link href={`/crm/oferte/noua?client=${lead.client_id}&lead=${lead.id}`} className="btn-primary !py-2.5"><FileText className="h-4 w-4" /> Generează ofertă</Link>
              </>
            ) : (
              <>
                <form action={convertLeadToClient}><input type="hidden" name="id" value={lead.id} /><SubmitButton variant="ghost"><UserPlus className="h-4 w-4" /> Convertește în client</SubmitButton></form>
                <form action={convertLeadToClient}><input type="hidden" name="id" value={lead.id} /><input type="hidden" name="then" value="offer" /><SubmitButton><FileText className="h-4 w-4" /> Generează ofertă</SubmitButton></form>
              </>
            )}
          </>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <Panel title="Cererea clientului">
            <dl className="grid gap-x-6 sm:grid-cols-3">
              <KeyVal k="Email" v={lead.email && <a href={`mailto:${lead.email}`} className="text-brand-blue">{lead.email}</a>} />
              <KeyVal k="Telefon" v={lead.phone && <a href={`tel:${lead.phone}`} className="text-brand-blue">{lead.phone}</a>} />
              <KeyVal k="Buget" v={lead.budget} />
              <KeyVal k="Deadline" v={lead.deadline} />
              <KeyVal k="Servicii" v={<div className="flex flex-wrap gap-1">{(lead.services as string[]).map((s) => <Badge key={s} tone="blue">{serviceLabel[s] ?? s}</Badge>)}</div>} />
              <KeyVal k="Consimțământ GDPR" v={lead.consent ? `Da · ${formatDate(lead.consent_at, true)}` : "—"} />
            </dl>
            {lead.message && <p className="mt-4 whitespace-pre-line rounded-xl bg-soft p-4 text-sm text-ink-2">{lead.message}</p>}
            {attachmentUrl && <a href={attachmentUrl} target="_blank" className="btn-ghost btn-sm mt-4"><Paperclip className="h-4 w-4" /> Descarcă brief-ul atașat</a>}
            {Object.keys(utm).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
                {Object.entries(utm).map(([k, v]) => <span key={k} className="rounded-md bg-soft px-2 py-1 text-muted">{k}: <b className="text-ink-2">{v}</b></span>)}
                {lead.ip && <span className="rounded-md bg-soft px-2 py-1 text-muted">IP: <b className="text-ink-2">{lead.ip}</b></span>}
              </div>
            )}
          </Panel>
          <Panel title="Editează lead-ul">
            <form action={updateLead} className="grid gap-4 sm:grid-cols-2">
              <input type="hidden" name="id" value={lead.id} />
              <Field label="Nume"><Input name="name" defaultValue={lead.name} required /></Field>
              <Field label="Companie"><Input name="company" defaultValue={lead.company ?? ""} /></Field>
              <Field label="Email"><Input name="email" defaultValue={lead.email ?? ""} /></Field>
              <Field label="Telefon"><Input name="phone" defaultValue={lead.phone ?? ""} /></Field>
              <Field label="Sursă"><Select name="source" options={LEAD_SOURCE} defaultValue={lead.source} /></Field>
              <Field label="Valoare estimată (lei)"><Input name="value_estimate" type="number" defaultValue={lead.value_estimate ?? ""} /></Field>
              <Field label="Buget"><Input name="budget" defaultValue={lead.budget ?? ""} /></Field>
              <Field label="Responsabil"><Select name="assigned_to" defaultValue={lead.assigned_to ?? ""} options={staff.map((p) => ({ value: p.id, label: p.full_name }))} placeholder="—" /></Field>
              {lead.status === "pierdut" && <Field label="Motivul pierderii" className="sm:col-span-2"><Input name="lost_reason" defaultValue={lead.lost_reason ?? ""} /></Field>}
              <div className="flex items-center justify-between sm:col-span-2">
                <SubmitButton>Salvează</SubmitButton>
              </div>
            </form>
            <form action={deleteLead} className="mt-4 border-t border-line pt-4">
              <input type="hidden" name="id" value={lead.id} />
              <ConfirmSubmit message="Ștergi definitiv acest lead?">Șterge lead-ul</ConfirmSubmit>
            </form>
          </Panel>
        </div>
        <Panel title="Activitate">
          <NoteForm leadId={lead.id} clientId={lead.client_id ?? undefined} path={`/crm/leaduri/${lead.id}`} />
          <Timeline items={(acts ?? []) as unknown as ActivityRow[]} />
        </Panel>
      </div>
    </>
  );
}
