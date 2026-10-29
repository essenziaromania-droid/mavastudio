import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Download } from "lucide-react";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { hasSupabase } from "@/lib/supabase/env";
import { formatDate, formatLei } from "@/lib/utils";
import { IncludesList } from "@/components/ui/includes-list";
import { OfferResponse } from "./response";
import { addActivity, notify } from "@/lib/events";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Ofertă", robots: { index: false, follow: false } };

export default async function PublicOffer({ params }: { params: { token: string } }) {
  if (!hasSupabase || !/^[0-9a-f-]{36}$/i.test(params.token)) notFound();
  const sb = createAdminClient();
  const { data: o } = await sb.from("offers").select("*, clients(name, contact_name), offer_items(*)").eq("public_token", params.token).maybeSingle();
  // Echipa logată în CRM vede pagina ca previzualizare: și ofertele netrimise, fără a marca vizualizarea clientului.
  const { data: auth } = await createClient().auth.getUser();
  const preview = !!auth.user;
  if (!o || (o.status === "draft" && !preview)) notFound();

  // Prima vizualizare a clientului → status „vizualizată” + notificare
  if (!o.viewed_at && !preview) {
    await sb.from("offers").update({ viewed_at: new Date().toISOString(), status: o.status === "trimisa" ? "vizualizata" : o.status }).eq("id", o.id);
    await addActivity(sb, { client_id: o.client_id, type: "oferta", title: `Oferta ${o.number} a fost vizualizată` });
    await notify(sb, { type: "oferta", title: `👀 Oferta ${o.number} a fost vizualizată`, body: o.clients?.name, link: `/crm/oferte/${o.id}` });
  }

  const items = [...(o.offer_items ?? [])].sort((a, b) => a.sort - b.sort);
  const expired = o.valid_until && o.valid_until < new Date().toISOString().slice(0, 10);

  return (
    <section className="bg-hero-soft">
      <div className="container max-w-4xl py-12">
        {preview && (
          <p className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Previzualizare din CRM. {o.status === "draft" ? "Clientul poate deschide linkul doar după ce îl trimiți." : "Deschiderea de către tine nu se înregistrează ca vizualizare a clientului."}
          </p>
        )}
        <div className="card overflow-hidden">
          <div className="h-1.5 bg-brand-gradient" />
          <div className="p-6 md:p-10">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <p className="eyebrow">Ofertă {o.number}</p>
                <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{o.title}</h1>
                <p className="mt-2 text-body">Pentru <b className="text-ink">{o.clients?.name}</b>{o.clients?.contact_name ? ` · în atenția ${o.clients.contact_name}` : ""}</p>
              </div>
              <div className="text-sm text-body sm:text-right">
                <p>Emisă: {formatDate(o.created_at)}</p>
                {o.valid_until && <p className={expired ? "font-semibold text-rose-500" : ""}>Valabilă până la: {formatDate(o.valid_until)}</p>}
                <a href={`/api/pdf/oferta/${params.token}?public=1&download=1`} className="btn-ghost btn-sm mt-3"><Download className="h-4 w-4" /> Descarcă PDF</a>
              </div>
            </div>

            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead><tr className="border-b border-line text-left text-xs uppercase tracking-wider text-muted"><th className="py-3">Serviciu</th><th className="py-3 text-right">Cantitate</th><th className="py-3 text-right">Preț unitar</th><th className="py-3 text-right">Valoare</th></tr></thead>
                <tbody className="divide-y divide-line">
                  {items.map((i) => (
                    <tr key={i.id}>
                      <td className="py-4"><p className="font-semibold text-ink">{i.name}{i.recurring ? " (lunar)" : ""}</p>{i.description && <p className="text-xs text-muted">{i.description}</p>}<IncludesList value={i.includes} className="mb-1" /></td>
                      <td className="py-4 text-right">{Number(i.quantity)} {i.unit}</td>
                      <td className="py-4 text-right">{formatLei(i.unit_price)}</td>
                      <td className="py-4 text-right font-semibold text-ink">{formatLei(Number(i.quantity) * Number(i.unit_price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto mt-6 max-w-xs space-y-2 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatLei(o.subtotal, { decimals: true })}</dd></div>
              {Number(o.discount_amount) > 0 && <div className="flex justify-between"><dt>Discount ({Number(o.discount_percent)}%)</dt><dd>-{formatLei(o.discount_amount, { decimals: true })}</dd></div>}
              <div className="flex justify-between"><dt>TVA ({Number(o.vat_rate)}%)</dt><dd>{formatLei(o.vat_amount, { decimals: true })}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-lg"><dt className="font-bold text-ink">Total</dt><dd className="font-extrabold text-gradient">{formatLei(o.total, { decimals: true })}</dd></div>
            </dl>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {[["Termen de realizare", o.delivery_term], ["Modalitate de plată", o.payment_terms], ["Condiții", o.conditions], ["Observații", o.notes]].filter(([, v]) => v).map(([k, v]) => (
                <div key={k}><h2 className="text-base font-bold">{k}</h2><p className="mt-1 whitespace-pre-line text-sm text-body">{v}</p></div>
              ))}
            </div>
          </div>
          <div className="border-t border-line bg-soft/60 p-6 md:p-10">
            {preview ? <p className="text-sm text-muted">Aici clientul vede butoanele „Accept oferta” și „Solicit modificări”.</p> : <OfferResponse token={params.token} status={o.status} expired={Boolean(expired)} />}
          </div>
        </div>
      </div>
    </section>
  );
}
