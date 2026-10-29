import Link from "next/link";
import { notFound } from "next/navigation";
import { Copy, Download, Eye, FilePen, Pencil, Send } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { contractFromOffer, deleteOffer, duplicateOffer, sendOffer, setOfferStatus } from "../../actions/offers";
import { Field, Input, KeyVal, PageHeader, Panel, StatusBadge, Textarea, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, ConfirmSubmit, CopyButton, SubmitButton } from "@/components/crm/client-ui";
import { CONTRACT_STATUS, OFFER_STATUS } from "@/lib/crm/constants";
import { formatDate, formatLei } from "@/lib/utils";
import { SITE } from "@/content/site";

export const metadata = { title: "Ofertă" };

export default async function OfferPage({ params, searchParams }: { params: { id: string }; searchParams: { sent?: string; err?: string } }) {
  const { sb } = await requireModule("oferte");
  const { data: o } = await sb.from("offers").select("*, clients(*), offer_items(*), contracts(id, number, status)").eq("id", params.id).maybeSingle();
  if (!o) notFound();
  const items = [...(o.offer_items ?? [])].sort((a, b) => a.sort - b.sort);
  const link = `${SITE.url}/oferta/${o.public_token}`;
  const contract = (o.contracts as { id: string; number: string; status: string }[])?.[0];
  const recipient = o.clients?.contact_email || o.clients?.email || "";

  return (
    <>
      <PageHeader
        back={{ href: "/crm/oferte", label: "Oferte" }}
        title={<span className="flex items-center gap-3">{o.number} <StatusBadge map={OFFER_STATUS} value={o.status} /></span>}
        sub={<>{o.title} · <Link href={`/crm/clienti/${o.client_id}`} className="text-brand-blue">{o.clients?.name}</Link></>}
        actions={
          <>
            <AutoSubmitSelect name="status" defaultValue={o.status} options={optionsFrom(OFFER_STATUS)} action={setOfferStatus} hidden={{ id: o.id }} className="!py-2.5 !text-sm" />
            <a href={`/api/pdf/oferta/${o.id}?download=1`} className="btn-ghost !py-2.5"><Download className="h-4 w-4" /> PDF</a>
            <Link href={`/crm/oferte/noua?edit=${o.id}`} className="btn-ghost !py-2.5"><Pencil className="h-4 w-4" /> Editează</Link>
            {contract ? (
              <Link href={`/crm/contracte/${contract.id}`} className="btn-primary !py-2.5"><FilePen className="h-4 w-4" /> {contract.number}</Link>
            ) : (
              <form action={contractFromOffer}><input type="hidden" name="id" value={o.id} /><SubmitButton><FilePen className="h-4 w-4" /> Generează contract</SubmitButton></form>
            )}
          </>
        }
      />
      {searchParams.sent && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Oferta a fost trimisă pe email, cu PDF atașat și link de acceptare.</p>}
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">Emailul nu a putut fi trimis: {searchParams.err}</p>}
      {o.status === "modificari" && o.client_feedback && (
        <p className="mb-5 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"><b>Clientul a cerut modificări:</b> {o.client_feedback}</p>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Servicii">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="py-2">Serviciu</th><th className="py-2 text-right">Cant.</th><th className="py-2 text-right">Preț unitar</th><th className="py-2 text-right">Valoare</th></tr></thead>
            <tbody className="divide-y divide-line">
              {items.map((i) => (
                <tr key={i.id}>
                  <td className="py-3"><p className="font-semibold text-ink">{i.name}{i.recurring ? " (lunar)" : ""}</p>{i.description && <p className="text-xs text-muted">{i.description}</p>}</td>
                  <td className="py-3 text-right">{Number(i.quantity)} {i.unit}</td>
                  <td className="py-3 text-right">{formatLei(i.unit_price)}</td>
                  <td className="py-3 text-right font-semibold text-ink">{formatLei(Number(i.quantity) * Number(i.unit_price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="ml-auto mt-4 max-w-xs space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-body">Subtotal</dt><dd>{formatLei(o.subtotal, { decimals: true })}</dd></div>
            {Number(o.discount_amount) > 0 && <div className="flex justify-between"><dt className="text-body">Discount ({Number(o.discount_percent)}%)</dt><dd>-{formatLei(o.discount_amount, { decimals: true })}</dd></div>}
            <div className="flex justify-between"><dt className="text-body">TVA ({Number(o.vat_rate)}%)</dt><dd>{formatLei(o.vat_amount, { decimals: true })}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base"><dt className="font-bold text-ink">Total</dt><dd className="font-extrabold text-brand-blue">{formatLei(o.total, { decimals: true })}</dd></div>
          </dl>
          <dl className="mt-6 grid gap-x-6 border-t border-line pt-4 sm:grid-cols-2">
            <KeyVal k="Termen de realizare" v={o.delivery_term} />
            <KeyVal k="Modalitate de plată" v={o.payment_terms} />
            <KeyVal k="Valabilă până la" v={formatDate(o.valid_until)} />
            <KeyVal k="Creată" v={formatDate(o.created_at, true)} />
          </dl>
        </Panel>

        <div className="space-y-6">
          <Panel title="Trimite oferta">
            <form action={sendOffer} className="space-y-3">
              <input type="hidden" name="id" value={o.id} />
              <Field label="Către"><Input name="to" type="email" defaultValue={recipient} required /></Field>
              <Field label="Mesaj"><Textarea name="message" rows={4} defaultValue={`Bună ziua,\n\nAșa cum am discutat, vă transmitem oferta noastră pentru ${o.title.toLowerCase()}. O puteți vizualiza și accepta online, din linkul de mai jos.`} /></Field>
              <SubmitButton pendingText="Se trimite..."><Send className="h-4 w-4" /> Trimite email cu PDF</SubmitButton>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
              <CopyButton text={link} />
              <a href={link} target="_blank" className="btn-ghost btn-sm"><Eye className="h-4 w-4" /> Vezi ca și clientul</a>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <KeyVal k="Trimisă" v={formatDate(o.sent_at, true)} />
              <KeyVal k="Vizualizată" v={formatDate(o.viewed_at, true)} />
              <KeyVal k="Acceptată" v={formatDate(o.accepted_at, true)} />
            </dl>
          </Panel>
          {contract && (
            <Panel title="Contract">
              <Link href={`/crm/contracte/${contract.id}`} className="flex items-center justify-between">
                <span className="font-semibold text-brand-blue">{contract.number}</span>
                <StatusBadge map={CONTRACT_STATUS} value={contract.status} />
              </Link>
            </Panel>
          )}
          <Panel title="Alte acțiuni">
            <div className="flex flex-wrap gap-2">
              <form action={duplicateOffer}><input type="hidden" name="id" value={o.id} /><SubmitButton variant="ghost" className="btn-sm"><Copy className="h-4 w-4" /> Duplică</SubmitButton></form>
              <form action={deleteOffer}><input type="hidden" name="id" value={o.id} /><ConfirmSubmit message="Ștergi definitiv oferta?">Șterge</ConfirmSubmit></form>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
