import { Fragment } from "react";
import { requireModule } from "@/lib/crm/auth";
import { Field, Input, PageHeader, Panel, Select, Table, Td, Tabs, Textarea } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { MODULES, ROLES, SERVICE_CATEGORY } from "@/lib/crm/constants";
import { deleteCatalogItem, resetContractTemplate, saveCatalogItem, saveContractTemplate, savePermissions, saveSettings, saveTemplate } from "../actions/admin";
import { ConfirmSubmit } from "@/components/crm/client-ui";
import { ANNEX_KEYS, ANNEX_LABELS, CONTRACT_ANNEXES, CONTRACT_BODY, CONTRACT_DPA, CONTRACT_VARIABLES, DPA_CATEGORIES, type ContractTemplate } from "@/lib/contract-template";
import { DEFAULT_AUTOMATIONS, getSetting, type AutomationSettings } from "@/lib/events";
import { DEFAULT_INVOICING, type InvoicingSettings } from "@/lib/invoicing";
import type { Company } from "@/lib/documents";
import { formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Setări" };

const CATS = Object.fromEntries(Object.entries(SERVICE_CATEGORY).map(([k, v]) => [k, v.label]));

export default async function SettingsPage({ searchParams }: { searchParams: { tab?: string; saved?: string } }) {
  const s = await requireModule("setari");
  const { sb } = s;
  const tab = searchParams.tab ?? "firma";
  const back = `/crm/setari?tab=${tab}`;

  return (
    <>
      <PageHeader title="Setări" sub="Datele firmei, utilizatori și permisiuni, integrări, automatizări și șabloane." />
      <Tabs
        active={tab}
        items={[
          ["firma", "Informații firmă"],
          ["permisiuni", "Utilizatori și permisiuni"],
          ["integrari", "Integrări"],
          ["automatizari", "Automatizări"],
          ["catalog", "Catalog servicii"],
          ["contract", "Contract"],
          ["sabloane", "Șabloane proiecte"],
          ["audit", "Audit log"],
        ].map(([k, l]) => ({ key: k, label: l, href: `/crm/setari?tab=${k}` }))}
      />
      {searchParams.saved && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Setările au fost salvate.</p>}

      {tab === "firma" && <CompanyTab />}
      {tab === "permisiuni" && <PermissionsTab />}
      {tab === "integrari" && <IntegrationsTab />}
      {tab === "automatizari" && <AutomationsTab />}
      {tab === "catalog" && <CatalogTab />}
      {tab === "contract" && <ContractTab />}
      {tab === "sabloane" && <TemplatesTab />}
      {tab === "audit" && <AuditTab />}
    </>
  );

  async function CompanyTab() {
    const c = await getSetting<Company & { vat_payer?: boolean }>(sb, "company", {});
    return (
      <Panel title="Datele firmei" className="max-w-3xl">
        <p className="mb-5 text-sm text-body">Aceste date apar <b>doar</b> pe oferte, contracte și facturi – nu sunt afișate pe site.</p>
        <form action={saveSettings} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="key" value="company" />
          <input type="hidden" name="back" value={back} />
          <input type="hidden" name="bools" value="vat_payer" />
          <Field label="Nume comercial"><Input name="v.name" defaultValue={c.name ?? "MAVA Studio"} /></Field>
          <Field label="Denumire legală (SRL)"><Input name="v.legal_name" defaultValue={c.legal_name ?? ""} /></Field>
          <Field label="CUI"><Input name="v.cui" defaultValue={c.cui ?? ""} /></Field>
          <Field label="Nr. Reg. Com."><Input name="v.reg_com" defaultValue={c.reg_com ?? ""} /></Field>
          <Field label="Adresă sediu" className="sm:col-span-2"><Input name="v.address" defaultValue={c.address ?? ""} /></Field>
          <Field label="IBAN"><Input name="v.iban" defaultValue={c.iban ?? ""} /></Field>
          <Field label="Bancă"><Input name="v.bank" defaultValue={c.bank ?? ""} /></Field>
          <Field label="Email"><Input name="v.email" defaultValue={c.email ?? "contact@mavastudio.ro"} /></Field>
          <Field label="Telefon"><Input name="v.phone" defaultValue={c.phone ?? ""} /></Field>
          <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="b.vat_payer" defaultChecked={c.vat_payer !== false} className="accent-brand-blue" /> Firma este plătitoare de TVA</label>
          <div className="sm:col-span-2"><SubmitButton>Salvează</SubmitButton></div>
        </form>
      </Panel>
    );
  }

  async function PermissionsTab() {
    const { data } = await sb.from("role_permissions").select("role, module");
    const has = (r: string, m: string) => (data ?? []).some((x) => x.role === r && x.module === m);
    const roles = Object.entries(ROLES).filter(([k]) => k !== "admin");
    return (
      <Panel title="Permisiuni pe roluri" pad={false}>
        <p className="px-5 pt-4 text-sm text-body">Administratorul are mereu acces complet. Bifează modulele la care are acces fiecare rol. „Proiecte (atribuite)” = vede doar proiectele unde este membru sau manager.</p>
        <form action={savePermissions}>
          <div className="crm-scroll overflow-x-auto p-5">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="text-xs text-muted">
                  <th className="py-2 text-left">Modul</th>
                  {roles.map(([k, l]) => <th key={k} className="px-2 py-2 text-center">{l}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {MODULES.map((m) => (
                  <tr key={m.key}>
                    <td className="py-2.5"><p className="font-semibold text-ink">{m.label}</p>{m.hint && <p className="text-[11px] text-muted">{m.hint}</p>}</td>
                    {roles.map(([r]) => (
                      <td key={r} className="text-center"><input type="checkbox" name={`perm:${r}:${m.key}`} defaultChecked={has(r, m.key)} className="h-4 w-4 accent-brand-blue" /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line px-5 py-4">{s.isAdmin ? <SubmitButton>Salvează permisiunile</SubmitButton> : <p className="text-xs text-muted">Doar administratorul poate modifica permisiunile.</p>}</div>
        </form>
      </Panel>
    );
  }

  async function IntegrationsTab() {
    const cfg = await getSetting<InvoicingSettings>(sb, "invoicing", DEFAULT_INVOICING);
    const secretHint = (v: string) => (v ? "Salvat. Lasă gol pentru a-l păstra." : undefined);
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title="Facturare (SmartBill / Oblio / FGO)">
          <form action={saveSettings} className="space-y-5">
            <input type="hidden" name="key" value="invoicing" />
            <input type="hidden" name="back" value={back} />
            <Field label="Program de facturare implicit"><Select name="v.provider" defaultValue={cfg.provider} options={{ manual: "Niciunul (înregistrez manual)", smartbill: "SmartBill", oblio: "Oblio", fgo: "FGO" }} /></Field>
            <fieldset className="rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-bold text-ink">SmartBill</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email cont"><Input name="v.smartbill.email" defaultValue={cfg.smartbill.email} /></Field>
                <Field label="Token API" hint={secretHint(cfg.smartbill.token)}><Input name="v.smartbill.token" type="password" autoComplete="off" /></Field>
                <Field label="CIF firmă"><Input name="v.smartbill.cif" defaultValue={cfg.smartbill.cif} /></Field>
                <Field label="Serie facturi"><Input name="v.smartbill.series" defaultValue={cfg.smartbill.series} /></Field>
              </div>
            </fieldset>
            <fieldset className="rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-bold text-ink">Oblio</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Email cont"><Input name="v.oblio.email" defaultValue={cfg.oblio.email} /></Field>
                <Field label="Cheie API (secret)" hint={secretHint(cfg.oblio.secret)}><Input name="v.oblio.secret" type="password" autoComplete="off" /></Field>
                <Field label="CIF firmă"><Input name="v.oblio.cif" defaultValue={cfg.oblio.cif} /></Field>
                <Field label="Serie facturi"><Input name="v.oblio.series" defaultValue={cfg.oblio.series} /></Field>
              </div>
            </fieldset>
            <fieldset className="rounded-xl border border-line p-4">
              <legend className="px-1 text-sm font-bold text-ink">FGO</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="CUI"><Input name="v.fgo.cui" defaultValue={cfg.fgo.cui} /></Field>
                <Field label="Cheie privată" hint={secretHint(cfg.fgo.key)}><Input name="v.fgo.key" type="password" autoComplete="off" /></Field>
                <Field label="Serie"><Input name="v.fgo.series" defaultValue={cfg.fgo.series} /></Field>
              </div>
            </fieldset>
            <SubmitButton>Salvează integrarea</SubmitButton>
          </form>
        </Panel>
        <div className="space-y-6">
          <Panel title="Email (Resend)">
            <p className="text-sm text-body">Emailurile (notificări lead, oferte, contracte, auto-răspuns) se trimit de pe <b>contact@mavastudio.ro</b> prin Resend. Status: {process.env.RESEND_API_KEY ? <b className="text-emerald-600">configurat</b> : <b className="text-rose-500">lipsește RESEND_API_KEY</b>}.</p>
          </Panel>
          <Panel title="În curând">
            <ul className="space-y-2 text-sm text-body">
              <li>• <b>Google Drive</b> – creare automată a folderelor client/proiect (01 Brief … 09 Livrabile). Până atunci, fișierele se stochează în CRM, în aceeași structură.</li>
              <li>• <b>Google Calendar</b> – sincronizare întâlniri și deadline-uri.</li>
              <li>• <b>Stripe</b>, <b>WhatsApp Business</b>, <b>Make / n8n</b> (webhook-uri).</li>
              <li>• Semnătură electronică calificată (furnizor extern). Acum: semnare electronică simplă cu nume, dată și IP.</li>
            </ul>
          </Panel>
        </div>
      </div>
    );
  }

  async function AutomationsTab() {
    const a = await getSetting<AutomationSettings>(sb, "automations", DEFAULT_AUTOMATIONS);
    const rows: [keyof AutomationSettings, string, string][] = [
      ["lead_new_notify", "Lead nou → notificare + email către administrator", "Când cineva completează formularul de pe site."],
      ["lead_new_task", "Lead nou → creează task „Contactează lead-ul”", "Deadline: a doua zi, prioritate ridicată."],
      ["lead_new_autoreply", "Lead nou → email automat de confirmare către client", "„Am primit cererea ta, revenim în 24h”."],
      ["offer_accepted_contract", "Ofertă acceptată → generează contract", "Contractul se creează automat din ofertă, ca draft, gata de trimis."],
      ["contract_signed_project", "Contract semnat → creează proiect + task-uri + tranșe", "Din șablonul tipului de serviciu, cu plan de plăți 50/30/20."],
      ["contract_signed_invoice", "Contract semnat → pregătește factura de avans", "Draft de factură pentru prima tranșă, gata de emis."],
      ["invoice_paid_notify", "Factură achitată → notifică Project Manager-ul", "Proiectul trece în „În lucru” dacă era „De început”."],
    ];
    return (
      <Panel title="Automatizări (Trigger → Acțiuni)" className="max-w-3xl">
        <form action={saveSettings} className="space-y-1">
          <input type="hidden" name="key" value="automations" />
          <input type="hidden" name="back" value={back} />
          <input type="hidden" name="bools" value={rows.map((r) => r[0]).join(",")} />
          {rows.map(([k, title, desc]) => (
            <label key={k} className="flex cursor-pointer items-start gap-4 rounded-xl p-3 hover:bg-soft">
              <input type="checkbox" name={`b.${k}`} defaultChecked={a[k]} className="mt-1 h-4 w-4 accent-brand-blue" />
              <span><span className="block text-sm font-semibold text-ink">{title}</span><span className="block text-xs text-muted">{desc}</span></span>
            </label>
          ))}
          <div className="pt-4"><SubmitButton>Salvează</SubmitButton></div>
        </form>
      </Panel>
    );
  }

  async function CatalogTab() {
    const { data } = await sb.from("services_catalog").select("*").order("sort");
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <Panel title="Servicii și prețuri (folosite în generatorul de oferte)" pad={false}>
          <div className="divide-y divide-line">
            {(data ?? []).map((c) => (
              <form key={c.id} action={saveCatalogItem} className="grid grid-cols-[2fr_1fr_110px_90px_auto_auto] items-center gap-2 px-4 py-2">
                <input type="hidden" name="id" value={c.id} />
                <Input name="name" defaultValue={c.name} className="!py-1.5" />
                <Select name="category" options={CATS} defaultValue={c.category} className="!py-1.5" />
                <Input name="price" type="number" defaultValue={c.price} className="!py-1.5" title="Preț fără TVA" />
                <Input name="unit" defaultValue={c.unit} className="!py-1.5" />
                <input type="hidden" name="description" value={c.description ?? ""} />
                {c.recurring && <input type="hidden" name="recurring" value="on" />}
                <SubmitButton className="btn-sm !px-3 !py-1.5">Salvează</SubmitButton>
                <button formAction={deleteCatalogItem} className="rounded-lg px-2 py-1.5 text-xs text-muted hover:bg-rose-50 hover:text-rose-500" title="Șterge">Șterge</button>
              </form>
            ))}
          </div>
        </Panel>
        <Panel title="Serviciu nou">
          <form action={saveCatalogItem} className="space-y-3">
            <Field label="Nume *"><Input name="name" required /></Field>
            <Field label="Categorie"><Select name="category" options={CATS} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Preț (fără TVA)"><Input name="price" type="number" /></Field>
              <Field label="Unitate"><Input name="unit" defaultValue="proiect" /></Field>
            </div>
            <Field label="Descriere"><Input name="description" /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="recurring" className="accent-brand-blue" /> Serviciu lunar</label>
            <SubmitButton className="w-full">Adaugă în catalog</SubmitButton>
          </form>
          <p className="mt-4 text-xs text-muted">Exemplu: Website Business — {formatLei(8500)}, SEO — {formatLei(1500)}, Mentenanță — {formatLei(750)}/lună.</p>
        </Panel>
      </div>
    );
  }

  async function ContractTab() {
    const t = await getSetting<ContractTemplate>(sb, "contract_template", {});
    const customized = [t.body && "contractul-cadru", t.dpa && "anexa GDPR", ...ANNEX_KEYS.filter((k) => t.annexes?.[k]).map((k) => ANNEX_LABELS[k])].filter(Boolean);
    const area = "font-mono text-[12.5px] leading-relaxed";
    return (
      <div className="space-y-6">
        <Panel title="Cum funcționează">
          <div className="space-y-2 text-sm text-body">
            <p>La fiecare contract generat dintr-o ofertă, CRM-ul folosește <b className="text-ink">contractul-cadru</b> de mai jos și adaugă automat câte o <b className="text-ink">anexă cu condiții specifice</b> pentru fiecare tip de serviciu din ofertă, plus <b className="text-ink">anexa GDPR</b> când serviciile implică date personale ({DPA_CATEGORIES.map((k) => ANNEX_LABELS[k].toLowerCase()).join(", ")}).</p>
            <p>Modificările făcute aici se aplică doar contractelor generate de acum înainte. Fiecare contract poate fi ajustat și individual, înainte de trimitere, din pagina lui.</p>
            <p className="text-xs text-muted">Textul implicit a fost redactat ca model pentru o agenție digitală din România. Recomandăm verificarea lui de către un avocat înainte de utilizare.</p>
          </div>
          {customized.length > 0 && <p className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-800">Texte modificate față de varianta implicită: {customized.join(", ")}.</p>}
          <details className="mt-4">
            <summary className="cursor-pointer text-sm font-semibold text-brand-blue">Variabile disponibile</summary>
            <div className="mt-3 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2">
              {CONTRACT_VARIABLES.map(([v, d]) => (
                <div key={v}><code className="rounded bg-soft px-1.5 py-0.5 font-mono text-ink">{v}</code> <span className="text-muted">– {d}</span></div>
              ))}
            </div>
          </details>
        </Panel>
        <form action={saveContractTemplate} className="space-y-6">
          <Panel title="Contractul-cadru (toate serviciile)">
            <Textarea name="body" rows={30} defaultValue={t.body ?? CONTRACT_BODY} className={area} />
          </Panel>
          <div className="grid gap-6 xl:grid-cols-2">
            {ANNEX_KEYS.map((k) => (
              <Panel key={k} title={`Anexă · ${ANNEX_LABELS[k]}`}>
                <Textarea name={`annex_${k}`} rows={14} defaultValue={t.annexes?.[k] ?? CONTRACT_ANNEXES[k]} className={area} />
              </Panel>
            ))}
            <Panel title="Anexă · Prelucrarea datelor (GDPR art. 28)">
              <Textarea name="dpa" rows={14} defaultValue={t.dpa ?? CONTRACT_DPA} className={area} />
            </Panel>
          </div>
          <div className="sticky bottom-4 z-10 flex justify-end">
            <SubmitButton className="shadow-card-hover">Salvează șablonul de contract</SubmitButton>
          </div>
        </form>
        {customized.length > 0 && (
          <form action={resetContractTemplate}>
            <ConfirmSubmit message="Revii la textul implicit? Toate modificările din șablon se pierd.">Revino la textul implicit</ConfirmSubmit>
          </form>
        )}
      </div>
    );
  }

  async function TemplatesTab() {
    const { data } = await sb.from("project_templates").select("*").order("name");
    const toText = (st: { title: string; days: number }[]) => st.map((x) => `${x.title} | ${x.days}`).join("\n");
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[...(data ?? []), { id: "", name: "", category: "website", stages: [] }].map((t) => (
          <Panel key={t.id || "new"} title={t.id ? t.name : "Șablon nou"}>
            <form action={saveTemplate} className="space-y-3">
              {t.id && <input type="hidden" name="id" value={t.id} />}
              <div className="grid grid-cols-2 gap-3">
                <Field label="Nume"><Input name="name" defaultValue={t.name} required /></Field>
                <Field label="Tip serviciu"><Select name="category" options={CATS} defaultValue={t.category} /></Field>
              </div>
              <Field label="Etape (una pe linie: Titlu | zile)"><Textarea name="stages" rows={7} defaultValue={toText(t.stages as { title: string; days: number }[])} className="font-mono text-xs" /></Field>
              <SubmitButton className="btn-sm">Salvează șablonul</SubmitButton>
            </form>
          </Panel>
        ))}
      </div>
    );
  }

  async function AuditTab() {
    const { data } = await sb.from("audit_log").select("*").order("created_at", { ascending: false }).limit(300);
    return (
      <Panel title="Audit log (ultimele 300 de acțiuni)" pad={false}>
        <Table head={["Data", "Cine", "Acțiune", "Entitate"]} empty="Nicio acțiune înregistrată.">
          {(data ?? []).map((a) => (
            <Fragment key={a.id}>
              <tr>
                <Td className="text-xs text-muted">{formatDate(a.created_at, true)}</Td>
                <Td className="font-semibold text-ink">{a.actor_name ?? "Sistem"}</Td>
                <Td className="whitespace-normal">{a.action}</Td>
                <Td className="text-xs">{a.entity}{a.entity_id && !/^[0-9a-f-]{36}$/.test(a.entity_id) ? ` · ${a.entity_id}` : ""}</Td>
              </tr>
            </Fragment>
          ))}
        </Table>
      </Panel>
    );
  }
}
