import Link from "next/link";
import { notFound } from "next/navigation";
import { Download, ExternalLink, Mail, Send } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { addPayment, deleteInvoice, emitInvoice, sendInvoiceEmail, setInvoiceStatus } from "../../../actions/finance";
import { Field, Input, KeyVal, Textarea, PageHeader, Panel, Select, StatusBadge, Table, Td, optionsFrom } from "@/components/crm/ui";
import { AutoSubmitSelect, ConfirmSubmit, SubmitButton } from "@/components/crm/client-ui";
import { INVOICE_STATUS } from "@/lib/crm/constants";
import { formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Factură" };

export default async function InvoicePage({ params, searchParams }: { params: { id: string }; searchParams: { err?: string; ok?: string; sent?: string } }) {
  const { sb } = await requireModule("financiar");
  const { data: i } = await sb.from("invoices").select("*, clients(id, name, email, contact_email), projects(id, name), payments(*)").eq("id", params.id).maybeSingle();
  if (!i) notFound();
  const rest = Number(i.total) - Number(i.paid_amount);
  const label = [i.series, i.number].filter(Boolean).join(" ") || "Factură draft";
  const issued = !!i.number && i.provider !== "manual";
  const pdfUrl = `/api/invoices/${i.id}/pdf`;
  const clientEmail = i.clients?.contact_email || i.clients?.email || "";

  return (
    <>
      <PageHeader
        back={{ href: "/crm/financiar?tab=facturi", label: "Facturi" }}
        title={<span className="flex items-center gap-3">{label} <StatusBadge map={INVOICE_STATUS} value={i.status} /></span>}
        sub={<>{i.clients && <Link href={`/crm/clienti/${i.clients.id}`} className="text-brand-blue">{i.clients.name}</Link>}{i.projects && <> · <Link href={`/crm/proiecte/${i.projects.id}`} className="text-brand-blue">{i.projects.name}</Link></>}</>}
        actions={
          <>
            <AutoSubmitSelect name="status" defaultValue={i.status} options={optionsFrom(INVOICE_STATUS)} action={setInvoiceStatus} hidden={{ id: i.id }} className="!py-2.5 !text-sm" />
            {issued && <a href={pdfUrl} target="_blank" className="btn-ghost !py-2.5"><ExternalLink className="h-4 w-4" /> Vezi PDF</a>}
            {issued && <a href={`${pdfUrl}?download=1`} className="btn-primary !py-2.5"><Download className="h-4 w-4" /> Descarcă PDF</a>}
          </>
        }
      />
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}
      {searchParams.ok && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Factura a fost emisă în programul de facturare.</p>}
      {searchParams.sent && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Factura a fost trimisă pe email către {searchParams.sent}.</p>}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Panel title="Detalii">
            <p className="mb-4 text-sm font-semibold text-ink">{i.description}</p>
            <dl className="grid gap-x-6 sm:grid-cols-3">
              <KeyVal k="Subtotal" v={formatLei(i.subtotal, { decimals: true })} />
              <KeyVal k="TVA" v={formatLei(i.vat_amount, { decimals: true })} />
              <KeyVal k="Total" v={<b>{formatLei(i.total, { decimals: true })}</b>} />
              <KeyVal k="Emisă" v={formatDate(i.issue_date)} />
              <KeyVal k="Scadență" v={formatDate(i.due_date)} />
              <KeyVal k="Program facturare" v={<span className="uppercase">{i.provider}</span>} />
            </dl>
            {i.status === "draft" && (
              <form action={emitInvoice} className="mt-5 border-t border-line pt-5">
                <input type="hidden" name="id" value={i.id} />
                <SubmitButton pendingText="Se emite..."><Send className="h-4 w-4" /> Emite factura (SmartBill / Oblio / FGO)</SubmitButton>
                <p className="mt-2 text-xs text-muted">Se folosește programul implicit setat în Setări → Integrări.</p>
              </form>
            )}
          </Panel>
          <Panel title="Plăți încasate" pad={false}>
            <Table head={["Data", "Metodă", "Sumă", "Note"]} empty="Nicio plată încă.">
              {((i.payments as { id: string; paid_at: string; method: string; amount: number; notes: string | null }[]) ?? []).map((p) => (
                <tr key={p.id}>
                  <Td className="text-xs">{formatDate(p.paid_at)}</Td>
                  <Td className="text-xs capitalize">{p.method}</Td>
                  <Td className="font-semibold text-emerald-600">{formatLei(p.amount, { decimals: true })}</Td>
                  <Td className="text-xs text-muted">{p.notes}</Td>
                </tr>
              ))}
            </Table>
          </Panel>
        </div>
        <div className="space-y-6">
          {issued && (
            <Panel title="Trimite clientului">
              <form action={sendInvoiceEmail} className="space-y-3">
                <input type="hidden" name="id" value={i.id} />
                <Field label="Email client" hint={clientEmail ? undefined : "Clientul nu are email salvat în fișă."}><Input name="to" type="email" defaultValue={clientEmail} required /></Field>
                <Field label="Mesaj (opțional)"><Textarea name="message" rows={3} placeholder="Ex.: Vă mulțumim pentru colaborare!" /></Field>
                <SubmitButton className="w-full" pendingText="Se trimite..."><Mail className="h-4 w-4" /> Trimite factura pe email</SubmitButton>
                <p className="text-xs text-muted">Emailul pleacă de pe contact@mavastudio.ro, cu factura PDF atașată. Răspunsurile clientului vin tot pe contact@mavastudio.ro.</p>
              </form>
            </Panel>
          )}
          <Panel title="Înregistrează plată">
            <p className="mb-3 text-sm text-body">Rest de încasat: <b className={rest > 0 ? "text-rose-500" : "text-emerald-600"}>{formatLei(rest, { decimals: true })}</b></p>
            {rest > 0 && i.status !== "draft" ? (
              <form action={addPayment} className="space-y-3">
                <input type="hidden" name="invoice_id" value={i.id} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Sumă"><Input name="amount" type="number" step="0.01" defaultValue={rest.toFixed(2)} required /></Field>
                  <Field label="Data"><Input name="paid_at" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
                </div>
                <Field label="Metodă"><Select name="method" options={{ transfer: "Transfer bancar", card: "Card", numerar: "Numerar", alta: "Altă metodă" }} /></Field>
                <Field label="Note"><Input name="notes" /></Field>
                <SubmitButton className="w-full">Adaugă plata</SubmitButton>
              </form>
            ) : (
              i.status === "draft" && <p className="text-xs text-muted">Emite factura înainte de a înregistra plăți.</p>
            )}
          </Panel>
          {["draft", "anulata"].includes(i.status) && (
            <form action={deleteInvoice}>
              <input type="hidden" name="id" value={i.id} />
              <ConfirmSubmit message="Ștergi factura din CRM?">Șterge factura</ConfirmSubmit>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
