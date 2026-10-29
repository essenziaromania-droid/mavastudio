import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Eye, PenLine, Send } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { clearSavedSignature, deleteContract, sendContract, setContractStatus, signAsProvider, updateContract, withdrawProviderSignature } from "../../actions/contracts";
import { SignaturePad } from "@/components/ui/signature-pad";
import { Field, Input, KeyVal, PageHeader, Panel, StatusBadge, Textarea, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, ConfirmSubmit, CopyButton, SubmitButton } from "@/components/crm/client-ui";
import { CONTRACT_STATUS } from "@/lib/crm/constants";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/content/site";

export const metadata = { title: "Contract" };

export default async function ContractPage({ params, searchParams }: { params: { id: string }; searchParams: { sent?: string; err?: string; signed?: string } }) {
  const { sb, userId, profile } = await requireModule("contracte");
  const { data: c } = await sb.from("contracts").select("*, clients(name, email, contact_email), offers(id, number), projects(id, name)").eq("id", params.id).maybeSingle();
  if (!c) notFound();
  const link = `${SITE.url}/contract/${c.public_token}`;
  const clientSigned = c.status === "semnat" || !!c.signed_at;
  const providerSigned = !!c.provider_signed_at;
  const locked = clientSigned || providerSigned;
  const { data: me } = await sb.from("profiles").select("signature").eq("id", userId).maybeSingle();
  const savedSignature = (me as { signature?: string | null } | null)?.signature ?? null;
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
      {searchParams.signed && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Ai semnat contractul ca prestator.{clientSigned ? " Ambele părți au semnat; exemplarul final a fost trimis pe email." : " Acum îl poți trimite clientului spre semnare."}</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Panel title={locked ? "Conținut (semnat – needitabil)" : "Conținut contract"}>
          {providerSigned && !clientSigned && <p className="mb-4 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800">Textul este blocat pentru că l-ai semnat. Ca să-l modifici, retrage semnătura din panoul „Semnături”.</p>}
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
          <Panel title="Semnături">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Prestator · MAVA Studio</p>
                {providerSigned ? (
                  <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                    {c.provider_signature && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.provider_signature} alt="Semnătura prestatorului" className="h-16 w-auto" />
                    )}
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {c.provider_signed_by}</p>
                    <p className="text-xs text-emerald-800/80">{formatDate(c.provider_signed_at, true)}{c.provider_signed_ip ? ` · IP ${c.provider_signed_ip}` : ""}</p>
                    {!clientSigned && (
                      <form action={withdrawProviderSignature} className="mt-2">
                        <input type="hidden" name="id" value={c.id} />
                        <ConfirmSubmit message="Retragi semnătura? Contractul devine din nou editabil.">Retrage semnătura</ConfirmSubmit>
                      </form>
                    )}
                  </div>
                ) : (
                  <form action={signAsProvider} className="mt-2 space-y-3">
                    <input type="hidden" name="id" value={c.id} />
                    <Field label="Numele semnatarului"><Input name="name" defaultValue={profile.full_name ?? ""} required /></Field>
                    {savedSignature ? (
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input type="checkbox" name="use_saved" defaultChecked className="accent-brand-blue" /> Folosește semnătura mea salvată
                        </label>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={savedSignature} alt="Semnătura salvată" className="h-14 w-auto rounded-lg border border-line bg-white px-2" />
                        <details className="text-xs">
                          <summary className="cursor-pointer text-brand-blue">Semnează altfel (desenează o semnătură nouă)</summary>
                          <div className="mt-2"><SignaturePad name="signature" /></div>
                          <label className="mt-2 flex items-center gap-2"><input type="checkbox" name="remember" className="accent-brand-blue" /> Înlocuiește semnătura salvată</label>
                        </details>
                      </div>
                    ) : (
                      <>
                        <SignaturePad name="signature" />
                        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="remember" defaultChecked className="accent-brand-blue" /> Salvează semnătura pentru contractele următoare</label>
                      </>
                    )}
                    <SubmitButton pendingText="Se semnează..."><PenLine className="h-4 w-4" /> Semnează ca prestator</SubmitButton>
                    <p className="text-[11px] text-muted">Recomandat: semnează înainte să trimiți contractul. După semnare, textul se blochează. Se înregistrează numele, data, ora și IP-ul.</p>
                  </form>
                )}
                {savedSignature && providerSigned && (
                  <form action={clearSavedSignature} className="mt-2">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-[11px] text-muted underline hover:text-ink">Șterge semnătura salvată din profil</button>
                  </form>
                )}
              </div>
              <div className="border-t border-line pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Beneficiar · {c.clients?.name}</p>
                {clientSigned ? (
                  <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                    {c.client_signature && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.client_signature} alt="Semnătura clientului" className="h-16 w-auto" />
                    )}
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-emerald-700"><CheckCircle2 className="h-4 w-4" /> {c.signed_by_name}</p>
                    <p className="text-xs text-emerald-800/80">{formatDate(c.signed_at, true)}{c.signed_ip ? ` · IP ${c.signed_ip}` : ""}</p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-body">Încă nu a semnat. Clientul semnează din linkul primit pe email.</p>
                )}
              </div>
              {clientSigned && providerSigned && (
                <p className="rounded-xl bg-soft px-3 py-2 text-xs text-body">
                  Semnat de ambele părți.{c.signed_copy_sent_at ? ` Exemplarul final a fost trimis pe email la ${formatDate(c.signed_copy_sent_at, true)}.` : ""}
                </p>
              )}
            </div>
          </Panel>
          {!clientSigned && (
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
          {!clientSigned && !providerSigned && (
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
