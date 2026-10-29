"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2, Plus, Trash2, X } from "lucide-react";
import { saveOffer, type OfferInput } from "@/app/crm/actions/offers";
import { computeTotals } from "@/lib/documents";
import { SERVICE_CATEGORY } from "@/lib/crm/constants";
import { Icon } from "@/components/ui/icon";
import { cn, formatLei } from "@/lib/utils";
import { inputCls } from "./ui";
import { asSaved, mergeIncludes, parseIncludes, toSaved, type IncludeGroup } from "@/lib/includes";
import { IncludesList } from "@/components/ui/includes-list";

type CatalogItem = { id: string; category: string; name: string; description: string | null; unit: string; price: number; recurring: boolean; includes?: string | null };
type Item = OfferInput["items"][number] & { key: string; groups: IncludeGroup[] };

const CAT_ICON: Record<string, string> = { website: "monitor", ecommerce: "cart", saas: "database", crm: "users", ai: "sparkles", video: "play", social: "megaphone", mentenanta: "settings", altele: "layers" };
const uid = () => Math.random().toString(36).slice(2);

export function OfferBuilder({
  catalog,
  clients,
  initial,
}: {
  catalog: CatalogItem[];
  clients: { value: string; label: string }[];
  initial: Partial<OfferInput> & { items?: OfferInput["items"] };
}) {
  const router = useRouter();
  const [step, setStep] = useState(initial.id ? 2 : 1);
  const [clientId, setClientId] = useState(initial.client_id ?? "");
  const [title, setTitle] = useState(initial.title ?? "Ofertă servicii digitale");
  const [items, setItems] = useState<Item[]>(() =>
    (initial.items ?? []).map((i) => ({ ...i, key: uid(), groups: mergeIncludes(parseIncludes(catalog.find((c) => c.name === i.name)?.includes), asSaved(i.includes)) })),
  );
  const [open, setOpen] = useState<string | null>(null);
  const [discount, setDiscount] = useState(initial.discount_percent ?? 0);
  const [vat, setVat] = useState(initial.vat_rate ?? 21);
  const [delivery, setDelivery] = useState(initial.delivery_term ?? "");
  const [payment, setPayment] = useState(initial.payment_terms ?? "50% avans la semnarea contractului, 30% la livrarea versiunii beta, 20% la lansare.");
  const [conditions, setConditions] = useState(initial.conditions ?? "Prețurile includ două runde de revizii pe etapă. Conținutul (texte, fotografii) este furnizat de client, dacă nu este inclus explicit în ofertă.");
  const [notes, setNotes] = useState(initial.notes ?? "");
  const [validUntil, setValidUntil] = useState(initial.valid_until ?? new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const totals = useMemo(() => computeTotals(items, discount, vat), [items, discount, vat]);
  const byCat = useMemo(() => {
    const m = new Map<string, CatalogItem[]>();
    catalog.forEach((c) => m.set(c.category, [...(m.get(c.category) ?? []), c]));
    return m;
  }, [catalog]);

  const addFromCatalog = (c: CatalogItem) =>
    setItems((xs) => (xs.some((x) => x.name === c.name) ? xs.filter((x) => x.name !== c.name) : [...xs, { key: uid(), category: c.category, name: c.name, description: c.description, quantity: 1, unit: c.unit, unit_price: Number(c.price), recurring: c.recurring, groups: parseIncludes(c.includes) }]));
  const update = (key: string, patch: Partial<Item>) => setItems((xs) => xs.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const setGroups = (key: string, fn: (g: IncludeGroup[]) => IncludeGroup[]) => setItems((xs) => xs.map((x) => (x.key === key ? { ...x, groups: fn(x.groups) } : x)));
  const toggleOpt = (key: string, gi: number, oi: number) =>
    setGroups(key, (gs) => gs.map((g, a) => (a !== gi ? g : { ...g, options: g.options.map((o, b) => (b === oi ? { ...o, on: !o.on } : o)) })));
  const addOpt = (key: string, gi: number, label: string) =>
    label.trim() && setGroups(key, (gs) => gs.map((g, a) => (a !== gi ? g : { ...g, options: [...g.options, { label: label.trim(), on: true }] })));
  const removeOpt = (key: string, gi: number, oi: number) =>
    setGroups(key, (gs) => gs.map((g, a) => (a !== gi ? g : { ...g, options: g.options.filter((_, b) => b !== oi) })).filter((g) => g.options.length));
  const addGroup = (key: string, name: string) => name.trim() && setGroups(key, (gs) => [...gs, { group: name.trim(), options: [] }]);

  const save = () => {
    setError("");
    start(async () => {
      const r = await saveOffer({
        id: initial.id,
        client_id: clientId || null,
        lead_id: initial.lead_id ?? null,
        title,
        discount_percent: Number(discount) || 0,
        vat_rate: Number(vat) || 0,
        delivery_term: delivery,
        payment_terms: payment,
        conditions,
        notes,
        valid_until: validUntil || null,
        items: items.map(({ key: _k, groups, ...rest }) => ({ ...rest, includes: toSaved(groups) })),
      });
      if (r.error) return setError(r.error);
      router.push(`/crm/oferte/${r.id}`);
      router.refresh();
    });
  };

  const steps = ["Selectează servicii", "Detalii și prețuri", "Previzualizare"];

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
      <div>
        <ol className="mb-6 flex flex-wrap items-center gap-3">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <button type="button" onClick={() => setStep(i + 1)} className="flex items-center gap-2">
                <span className={cn("flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", step >= i + 1 ? "bg-brand-blue text-white" : "bg-white text-muted ring-1 ring-line")}>{i + 1}</span>
                <span className={cn("text-sm font-semibold", step === i + 1 ? "text-ink" : "text-muted")}>{s}</span>
              </button>
              {i < 2 && <span className="hidden h-px w-10 bg-line sm:block" />}
            </li>
          ))}
        </ol>

        <div className="mb-5 grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-2">
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">Client *</span>
            <select value={clientId} onChange={(e) => setClientId(e.target.value)} className={inputCls}>
              <option value="">Alege clientul</option>
              {clients.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">Titlul ofertei</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </label>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            {Array.from(byCat.entries()).map(([cat, list]) => (
              <div key={cat}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">{SERVICE_CATEGORY[cat]?.label ?? cat}</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((c) => {
                    const on = items.some((x) => x.name === c.name);
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => addFromCatalog(c)}
                        className={cn("relative flex items-start gap-3 rounded-2xl border-2 bg-white p-4 text-left transition", on ? "border-brand-blue shadow-card-hover" : "border-line hover:border-brand-blue/40")}
                      >
                        <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", on ? "bg-brand-blue text-white" : "bg-blue-50 text-brand-blue")}><Icon name={CAT_ICON[c.category] ?? "layers"} className="h-5 w-5" /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-ink">{c.name}</span>
                          <span className="block text-xs text-muted">{formatLei(c.price)}{c.recurring ? " / lună" : ""}</span>
                        </span>
                        {on && <Check className="absolute right-3 top-3 h-4 w-4 text-brand-blue" strokeWidth={3} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button type="button" onClick={() => { setItems((xs) => [...xs, { key: uid(), name: "Serviciu personalizat", quantity: 1, unit: "proiect", unit_price: 0, category: "altele", groups: [] }]); setStep(2); }} className="btn-ghost btn-sm">
              <Plus className="h-4 w-4" /> Serviciu personalizat
            </button>
            <div><button type="button" onClick={() => setStep(2)} className="btn-primary">Continuă</button></div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.key} className="grid gap-2 rounded-xl border border-line p-3 sm:grid-cols-[2fr_90px_110px_130px_auto]">
                    <div className="space-y-1.5">
                      <input value={i.name} onChange={(e) => update(i.key, { name: e.target.value })} className={cn(inputCls, "font-semibold")} placeholder="Serviciu" />
                      <input value={i.description ?? ""} onChange={(e) => update(i.key, { description: e.target.value })} className={cn(inputCls, "text-xs")} placeholder="Descriere (opțional)" />
                      <label className="flex items-center gap-2 text-xs text-body"><input type="checkbox" checked={!!i.recurring} onChange={(e) => update(i.key, { recurring: e.target.checked })} className="accent-brand-blue" /> Serviciu lunar (recurent)</label>
                    </div>
                    <input type="number" min={0} step="0.5" value={i.quantity} onChange={(e) => update(i.key, { quantity: Number(e.target.value) })} className={inputCls} title="Cantitate" />
                    <input value={i.unit} onChange={(e) => update(i.key, { unit: e.target.value })} className={inputCls} title="Unitate" />
                    <input type="number" min={0} step="50" value={i.unit_price} onChange={(e) => update(i.key, { unit_price: Number(e.target.value) })} className={inputCls} title="Preț unitar (lei, fără TVA)" />
                    <button type="button" onClick={() => setItems((xs) => xs.filter((x) => x.key !== i.key))} className="self-start rounded-lg p-2.5 text-muted hover:bg-rose-50 hover:text-rose-500"><Trash2 className="h-4 w-4" /></button>
                    <div className="sm:col-span-5">
                      <button type="button" onClick={() => setOpen(open === i.key ? null : i.key)} className="flex items-center gap-1.5 text-xs font-semibold text-brand-blue">
                        <ChevronDown className={cn("h-3.5 w-3.5 transition", open === i.key && "rotate-180")} />
                        Ce include ({i.groups.reduce((n, g) => n + g.options.filter((o) => o.on).length, 0)} elemente bifate)
                      </button>
                      {open === i.key && (
                        <div className="mt-3 space-y-4 rounded-xl bg-soft/60 p-4">
                          {i.groups.map((g, gi) => (
                            <div key={g.group + gi}>
                              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">{g.group}</p>
                              <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                                {g.options.map((o, oi) => (
                                  <div key={o.label + oi} className="group flex items-center gap-2 text-sm">
                                    <label className="flex flex-1 cursor-pointer items-center gap-2">
                                      <input type="checkbox" checked={o.on} onChange={() => toggleOpt(i.key, gi, oi)} className="accent-brand-blue" />
                                      <span className={o.on ? "text-ink" : "text-muted"}>{o.label}</span>
                                    </label>
                                    <button type="button" onClick={() => removeOpt(i.key, gi, oi)} className="opacity-0 transition group-hover:opacity-100" title="Elimină"><X className="h-3.5 w-3.5 text-muted hover:text-rose-500" /></button>
                                  </div>
                                ))}
                              </div>
                              <input
                                placeholder={`+ Adaugă în „${g.group}” și apasă Enter`}
                                className={cn(inputCls, "mt-1.5 !py-1.5 text-xs")}
                                onKeyDown={(e) => {
                                  if (e.key !== "Enter") return;
                                  e.preventDefault();
                                  addOpt(i.key, gi, e.currentTarget.value);
                                  e.currentTarget.value = "";
                                }}
                              />
                            </div>
                          ))}
                          <input
                            placeholder="+ Grup nou (ex. Pagini, Funcționalități) și apasă Enter"
                            className={cn(inputCls, "!py-1.5 text-xs")}
                            onKeyDown={(e) => {
                              if (e.key !== "Enter") return;
                              e.preventDefault();
                              addGroup(i.key, e.currentTarget.value);
                              e.currentTarget.value = "";
                            }}
                          />
                          <p className="text-[11px] text-muted">Clientul vede doar elementele bifate, în ofertă și în anexa contractului. Lista implicită a fiecărui serviciu se editează în Setări → Catalog servicii.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {!items.length && <p className="py-6 text-center text-sm text-muted">Nu ai ales încă servicii.</p>}
                <button type="button" onClick={() => setItems((xs) => [...xs, { key: uid(), name: "", quantity: 1, unit: "proiect", unit_price: 0, category: "altele", groups: [] }])} className="btn-ghost btn-sm"><Plus className="h-4 w-4" /> Adaugă rând</button>
                <p className="text-[11px] text-muted">Prețurile se introduc fără TVA. Cantitate · Unitate · Preț unitar.</p>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border border-line bg-white p-5 shadow-card sm:grid-cols-3">
              <label><span className="mb-1.5 block text-xs font-semibold text-ink-2">Discount (%)</span><input type="number" min={0} max={100} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className={inputCls} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-ink-2">TVA (%)</span><input type="number" min={0} max={100} value={vat} onChange={(e) => setVat(Number(e.target.value))} className={inputCls} /></label>
              <label><span className="mb-1.5 block text-xs font-semibold text-ink-2">Valabilă până la</span><input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} className={inputCls} /></label>
              <label className="sm:col-span-3"><span className="mb-1.5 block text-xs font-semibold text-ink-2">Termen de realizare</span><input value={delivery} onChange={(e) => setDelivery(e.target.value)} className={inputCls} placeholder="ex. 4–6 săptămâni de la primirea avansului" /></label>
              <label className="sm:col-span-3"><span className="mb-1.5 block text-xs font-semibold text-ink-2">Modalitate de plată</span><textarea rows={2} value={payment} onChange={(e) => setPayment(e.target.value)} className={inputCls} /></label>
              <label className="sm:col-span-3"><span className="mb-1.5 block text-xs font-semibold text-ink-2">Condiții</span><textarea rows={3} value={conditions} onChange={(e) => setConditions(e.target.value)} className={inputCls} /></label>
              <label className="sm:col-span-3"><span className="mb-1.5 block text-xs font-semibold text-ink-2">Observații</span><textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputCls} /></label>
            </div>
            <button type="button" onClick={() => setStep(3)} className="btn-primary">Previzualizare</button>
          </div>
        )}

        {step === 3 && (
          <div className="rounded-2xl border border-line bg-white p-8 shadow-card">
            <div className="mb-6 h-1.5 rounded-full bg-brand-gradient" />
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">Ofertă pentru {clients.find((c) => c.value === clientId)?.label ?? "—"}</p>
            <h2 className="mt-1 text-2xl font-extrabold">{title}</h2>
            <table className="mt-6 w-full text-sm">
              <thead><tr className="border-b border-line text-left text-xs text-muted"><th className="py-2">Serviciu</th><th className="py-2 text-right">Cant.</th><th className="py-2 text-right">Preț</th><th className="py-2 text-right">Valoare</th></tr></thead>
              <tbody className="divide-y divide-line">
                {items.map((i) => (
                  <tr key={i.key}>
                    <td className="py-2.5"><p className="font-semibold text-ink">{i.name}{i.recurring ? " (lunar)" : ""}</p>{i.description && <p className="text-xs text-muted">{i.description}</p>}<IncludesList value={toSaved(i.groups)} /></td>
                    <td className="py-2.5 text-right">{i.quantity} {i.unit}</td>
                    <td className="py-2.5 text-right">{formatLei(i.unit_price)}</td>
                    <td className="py-2.5 text-right font-semibold text-ink">{formatLei(i.quantity * i.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {[["Termen de realizare", delivery], ["Modalitate de plată", payment], ["Condiții", conditions], ["Observații", notes]].filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="mt-5"><p className="text-sm font-bold text-ink">{k}</p><p className="whitespace-pre-line text-sm text-body">{v}</p></div>
            ))}
          </div>
        )}
      </div>

      <aside className="xl:sticky xl:top-24 xl:self-start">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
          <h3 className="mb-3 font-bold">Ofertă</h3>
          <ul className="space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.key} className="flex justify-between gap-3"><span className="truncate text-body">{i.name || "—"}</span><span className="shrink-0 font-semibold text-ink">{formatLei(i.quantity * i.unit_price)}</span></li>
            ))}
          </ul>
          <button type="button" onClick={() => setStep(1)} className="mt-3 text-xs font-semibold text-brand-blue">+ Adaugă serviciu</button>
          <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-body">Subtotal</dt><dd>{formatLei(totals.subtotal)}</dd></div>
            {totals.discount_amount > 0 && <div className="flex justify-between"><dt className="text-body">Discount ({discount}%)</dt><dd>-{formatLei(totals.discount_amount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-body">TVA ({vat}%)</dt><dd>{formatLei(totals.vat_amount)}</dd></div>
            <div className="flex justify-between border-t border-line pt-2 text-base"><dt className="font-bold text-ink">Total</dt><dd className="font-extrabold text-brand-blue">{formatLei(totals.total)}</dd></div>
          </dl>
          {error && <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{error}</p>}
          <button type="button" disabled={pending} onClick={save} className="btn-primary mt-5 w-full">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : initial.id ? "Salvează modificările" : "Salvează oferta"}
          </button>
          <p className="mt-2 text-center text-[11px] text-muted">După salvare poți descărca PDF-ul și trimite oferta.</p>
        </div>
      </aside>
    </div>
  );
}
