import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, Eye, Send } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { deleteContract, sendContract, setContractStatus, updateContract } from "../../actions/contracts";
import { Field, Input, KeyVal, PageHeader, Panel, StatusBadge, Textarea, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, ConfirmSubmit, CopyButton, SubmitButton } from "@/components/crm/client-ui";
import { CONTRACT_STATUS } from "@/lib/crm/constants";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/content/site";

export const metadata = { title: "Contract" };

export default async function ContractPage({ params, searchParams }: { params: { id: string }; searchParams: { sent?: string; err?: string } }) {
  const { sb } = await requireModule("contracte");
  const { data: c } = await sb.from("contracts").select("*, clients(name, email, contact_email), offers(id, number), projects(id, name)").eq("id", params.id).maybeSingle();
  if (!c) notFound();
  const link = `${SITE.url}/contract/${c.public_token}`;
  const locked = c.status === "semnat";
  const project = (c.projects as { id: string; name: string }[])?.[0];

  return (
    <>
      <PageHeader
        back={{ href: "/crm/contracte", label: "Contracte" }}
        title={<span className="flex items-center gap-3">{c.number} <StatusBadge map={CONTRACT_STATUS} value={c.status} /></span>}
        sub={<>{c.title} · <Link href={`/crm/clienti/${c.client_id}`} className="text-brand-blue">{c.clients?.name}</Link>{c.offers && <> · din oferta <Link href={`/crm/oferte/${c.offers.id}`} className="text-brand-blue">{c.offers.number}</Link></>}</>}
        actions={
          <>
            <AutoSubmitSelect name="status" defaultValue={c.status} options={optionsFrom(CONTRACT_STATUS)} action={setContractStatus} hidden={{ id: c.id }} className="!py-2.5 !text-sm" />
            <a href={`/api/pdf/contract/${c.id}?download=1`} className="btn-ghost !py-2.5"><Download className="h-4 w-4" /> PDF</a>
            {project && <Link href={`/crm/proiecte/${project.id}`} className="btn-primary !py-2.5">Proiect: {project.name}</Link>}
          </>
        }
      />
      {searchParams.sent && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Contractul a fost trimis spre semnare.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">Emailul nu a putut fi trimis: {searchParams.err}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title={locked ? "Conținut (semnat – needitabil)" : "Conținut contract"}>
          <form action={updateContract} className="space-y-4">
            <input type="hidden" name="id" value={c.id} />
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Titlu" className="sm:col-span-2"><Input name="title" defaultValue={c.title} disabled={locked} /></Field>
              <Field label="Valoare (lei)"><Input name="value" type="number" step="0.01" defaultValue={c.value} disabled={locked} /></Field>
              <Field label="Data începerii"><Input name="start_date" type="date" defaultValue={c.start_date ?? ""} disabled={locked} /></Field>
            </div>
            <Field label="Text (Markdown: # titlu, ## secțiune, - listă, **bold**)">
              <Textarea name="body" rows={28} defaultValue={c.body ?? ""} className="font-mono text-xs leading-relaxed" disabled={locked} />
            </Field>
            {!locked && <SubmitButton>Salvează contractul</SubmitButton>}
          </form>
        </Panel>
        <div className="space-y-6">
          {!locked && (
            <Panel title="Trimite spre semnare">
              <form action={sendContract} className="space-y-3">
                <input type="hidden" name="id" value={c.id} />
                <Field label="Către"><Input name="to" type="email" defaultValue={c.clients?.contact_email || c.clients?.email || ""} required /></Field>
                <SubmitButton pendingText="Se trimite..."><Send className="h-4 w-4" /> Trimite email cu link de semnare</SubmitButton>
              </form>
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <CopyButton text={link} />
                <a href={link} target="_blank" className="btn-ghost btn-sm"><Eye className="h-4 w-4" /> Vezi ca și clientul</a>
              </div>
              <p className="mt-3 text-[11px] text-muted">Linkul de semnare funcționează după ce contractul nu mai este „Draft” (se trimite automat la prima expediere).</p>
            </Panel>
          )}
          <Panel title="Istoric">
            <dl>
              <KeyVal k="Creat" v={formatDate(c.created_at, true)} />
              <KeyVal k="Trimis" v={formatDate(c.sent_at, true)} />
              <KeyVal k="Vizualizat" v={formatDate(c.viewed_at, true)} />
              <KeyVal k="Semnat" v={c.signed_at ? `${formatDate(c.signed_at, true)} · ${c.signed_by_name}${c.signed_ip ? ` · IP ${c.signed_ip}` : ""}` : null} />
            </dl>
          </Panel>
          {!locked && (
            <form action={deleteContract}>
              <input type="hidden" name="id" value={c.id} />
              <ConfirmSubmit message="Ștergi definitiv contractul?">Șterge contractul</ConfirmSubmit>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
