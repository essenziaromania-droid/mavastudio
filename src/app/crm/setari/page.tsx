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
import { getDriveConnection, googleConfigured, googleRedirectUri } from "@/lib/google-drive";
import { disconnectGoogle, runCalendarSync, runDriveSync, saveCalendarTypes } from "../actions/drive";
import { disconnectImap, runMailSync, saveImapSettings } from "../actions/messages";
import { getMailConnection } from "@/lib/mailbox";
import { CAL_TYPE_LABELS, DEFAULT_CAL_TYPES, calendarUrl, hasCalendarScope } from "@/lib/google-calendar";
import { createAdminClient } from "@/lib/supabase/server";
import type { Company } from "@/lib/documents";
import { formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Setări" };

const INCLUDES_HINT = ["## Pagini", "Acasă", "Despre noi", "Contact", "? Blog", "## Funcționalități", "Formular de contact", "? Versiune în engleză"].join("\n");

const CATS = Object.fromEntries(Object.entries(SERVICE_CATEGORY).map(([k, v]) => [k, v.label]));

export default async function SettingsPage({ searchParams }: { searchParams: { tab?: string; saved?: string; google_ok?: string; google_err?: string; google_off?: string; drive_sync?: string; cal_sync?: string; mail_ok?: string; mail_err?: string; mail_off?: string } }) {
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
          <DrivePanel />
          <MailPanel />
          <Panel title="Email (Resend)">
            <p className="text-sm text-body">Emailurile (notificări lead, oferte, contracte, auto-răspuns) se trimit de pe <b>contact@mavastudio.ro</b> prin Resend. Status: {process.env.RESEND_API_KEY ? <b className="text-emerald-600">configurat</b> : <b className="text-rose-500">lipsește RESEND_API_KEY</b>}.</p>
          </Panel>
          <Panel title="În curând">
            <ul className="space-y-2 text-sm text-body">
              <li>• <b>Google Calendar</b> – sincronizare întâlniri și deadline-uri.</li>
              <li>• <b>Stripe</b>, <b>WhatsApp Business</b>, <b>Make / n8n</b> (webhook-uri).</li>
              <li>• Semnătură electronică calificată (furnizor extern). Acum: semnare electronică simplă cu nume, dată și IP.</li>
            </ul>
          </Panel>
        </div>
      </div>
    );
  }

  async function MailPanel() {
    const conn = s.isAdmin ? await getMailConnection().catch(() => null) : null;
    return (
      <Panel title="Căsuța de email (mesaje cu clienții)">
        {searchParams.mail_ok && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Căsuța a fost conectată. {Number(searchParams.mail_ok) ? `${searchParams.mail_ok} emailuri cu clienții au fost importate (ultimele 30 de zile).` : "Nu am găsit emailuri cu clienții în ultimele 30 de zile."}</p>}
        {searchParams.mail_err && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{searchParams.mail_err}</p>}
        {searchParams.mail_off && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Căsuța a fost deconectată. Mesajele deja importate rămân în CRM.</p>}
        {!s.isAdmin ? (
          <p className="text-sm text-body">Doar administratorul poate conecta căsuța de email.</p>
        ) : (
          <div className="space-y-3 text-sm text-body">
            <p>CRM-ul citește căsuța firmei și păstrează <b className="text-ink">doar emailurile cu clienții și lead-urile</b>, în fișa fiecăruia (tab-ul „Mesaje”) și în modulul Mesaje.</p>
            {conn && (
              <p className="rounded-xl bg-soft px-3 py-2 text-xs">
                Conectat: <b className="text-ink">{conn.config.user}</b> · {conn.last_sync ? `ultima verificare ${formatDate(conn.last_sync, true)}` : "încă neverificat"}
                {conn.last_error && <span className="block text-rose-600">Ultima eroare: {conn.last_error}</span>}
              </p>
            )}
            <form action={saveImapSettings} className="grid gap-3 sm:grid-cols-2">
              <Field label="Adresa de email"><Input name="user" type="email" required defaultValue={conn?.config.user ?? "contact@mavastudio.ro"} /></Field>
              <Field label="Parola căsuței" hint={conn ? "Salvată. Lasă gol pentru a o păstra." : "Parola cu care intri în webmail."}><Input name="password" type="password" autoComplete="new-password" required={!conn} /></Field>
              <Field label="Server IMAP" hint="Hostico: glc44.hostico.ro"><Input name="host" defaultValue={conn?.config.host ?? "glc44.hostico.ro"} /></Field>
              <Field label="Port"><Input name="port" type="number" defaultValue={String(conn?.config.port ?? 993)} /></Field>
              <div className="sm:col-span-2"><SubmitButton className="btn-sm" pendingText="Se verifică conexiunea...">{conn ? "Salvează" : "Conectează căsuța"}</SubmitButton></div>
            </form>
            {conn && (
              <div className="flex flex-wrap gap-2 border-t border-line pt-3">
                <form action={runMailSync}><input type="hidden" name="back" value="/crm/setari?tab=integrari" /><SubmitButton className="btn-sm" pendingText="Se verifică...">Verifică emailuri noi</SubmitButton></form>
                <form action={disconnectImap}><ConfirmSubmit message="Deconectezi căsuța? Mesajele importate rămân în CRM.">Deconectează</ConfirmSubmit></form>
              </div>
            )}
            <p className="text-[11px] text-muted">Parola se păstrează într-o zonă protejată, accesibilă doar serverului; nu o pot vedea alți utilizatori ai CRM-ului.</p>
          </div>
        )}
      </Panel>
    );
  }

  async function DrivePanel() {
    const conn = s.isAdmin ? await getDriveConnection().catch(() => null) : null;
    const ready = googleConfigured();
    let pending = 0;
    if (conn) {
      const { count } = await createAdminClient().from("files").select("id", { count: "exact", head: true }).is("drive_file_id", null);
      pending = count ?? 0;
    }
    const sync = searchParams.drive_sync?.split("-").map(Number);
    const cal = searchParams.cal_sync?.split("-").map(Number);
    const calOn = hasCalendarScope(conn);
    const types = { ...DEFAULT_CAL_TYPES, ...(conn?.data.cal_types ?? {}) };
    return (
      <Panel title="Google Drive și Calendar">
        {searchParams.google_ok && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Google Drive a fost conectat. Apasă „Sincronizează acum” ca să creezi dosarele clienților existenți.</p>}
        {searchParams.google_err && <p className="mb-3 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">{searchParams.google_err}</p>}
        {searchParams.google_off && <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">Google Drive a fost deconectat. Dosarele și fișierele deja copiate rămân în Drive.</p>}
        {sync && <p className="mb-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Sincronizare: {sync[0]} dosare de client create, {sync[1]} fișiere copiate.{sync[2] ? ` Mai sunt ${sync[2]} fișiere – apasă din nou „Sincronizează acum”.` : " Totul este sincronizat."}</p>}
        {!s.isAdmin ? (
          <p className="text-sm text-body">Doar administratorul poate administra conexiunea cu Google Drive.</p>
        ) : !ready ? (
          <div className="space-y-2 text-sm text-body">
            <p>Pentru conectare sunt necesare cheile aplicației Google în Vercel: <code className="rounded bg-soft px-1">GOOGLE_CLIENT_ID</code> și <code className="rounded bg-soft px-1">GOOGLE_CLIENT_SECRET</code>.</p>
            <p className="text-xs text-muted">Adresa de redirecționare de trecut în Google Cloud: <code className="break-all rounded bg-soft px-1">{googleRedirectUri()}</code></p>
          </div>
        ) : conn ? (
          <div className="space-y-3 text-sm text-body">
            <p>Conectat cu <b className="text-ink">{conn.account_email ?? "contul Google"}</b>. Fiecare client are un dosar cu subfolderele 01 Brief … 10 Facturi, iar fișierele din CRM se copiază automat acolo.</p>
            {conn.data.root_url && <a href={conn.data.root_url} target="_blank" className="btn-ghost btn-sm">Deschide „MAVA Studio – CRM” în Drive</a>}
            <p className="text-xs text-muted">{pending ? `${pending} fișiere încă necopiate în Drive.` : "Toate fișierele sunt copiate în Drive."}</p>
            <form action={runDriveSync}><SubmitButton className="btn-sm" pendingText="Se sincronizează...">Sincronizează Drive acum</SubmitButton></form>

            <div className="border-t border-line pt-4">
              <p className="font-bold text-ink">Google Calendar</p>
              {cal && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">Calendar sincronizat: {cal[0]} adăugate, {cal[1]} actualizate, {cal[2]} șterse.{cal[3] ? ` Mai sunt ${cal[3]} – apasă din nou „Sincronizează calendarul”.` : ""}</p>}
              {calOn ? (
                <div className="mt-2 space-y-3">
                  <p>Calendarul separat <b className="text-ink">„MAVA Studio – CRM”</b> se actualizează automat la fiecare modificare din CRM (și zilnic, ca rezervă).</p>
                  {conn.data.calendar_id && <a href={calendarUrl(conn.data.calendar_id)} target="_blank" className="btn-ghost btn-sm">Deschide în Google Calendar</a>}
                  <form action={saveCalendarTypes} className="space-y-1.5 rounded-xl bg-soft p-3">
                    <p className="text-xs font-semibold text-ink">Ce apare în calendar:</p>
                    {(Object.keys(CAL_TYPE_LABELS) as (keyof typeof CAL_TYPE_LABELS)[]).map((k) => (
                      <label key={k} className="flex items-center gap-2 text-sm"><input type="checkbox" name={k} defaultChecked={types[k]} className="accent-brand-blue" /> {CAL_TYPE_LABELS[k]}</label>
                    ))}
                    <SubmitButton className="btn-sm mt-2" pendingText="Se salvează...">Salvează și sincronizează</SubmitButton>
                  </form>
                  <form action={runCalendarSync}><SubmitButton className="btn-sm" pendingText="Se sincronizează...">Sincronizează calendarul</SubmitButton></form>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <p>Reconectează contul Google ca să activezi și sincronizarea cu Google Calendar (întâlniri, termene, postări). Drive-ul rămâne exact cum este.</p>
                  <a href="/api/google/connect" className="btn-primary btn-sm">Activează Google Calendar</a>
                </div>
              )}
            </div>
            <form action={disconnectGoogle} className="border-t border-line pt-3"><ConfirmSubmit message="Deconectezi contul Google? Fișierele și evenimentele deja copiate rămân în Google.">Deconectează contul Google</ConfirmSubmit></form>
          </div>
        ) : (
          <div className="space-y-3 text-sm text-body">
            <p>Conectează Google Drive-ul firmei: CRM-ul va crea automat un dosar pentru fiecare client (01 Brief … 10 Facturi) și va copia acolo fișierele, contractele semnate și facturile.</p>
            <p className="text-xs text-muted">CRM-ul primește acces doar la fișierele și dosarele create de el, nu la restul Drive-ului.</p>
            <a href="/api/google/connect" className="btn-primary btn-sm">Conectează Google Drive</a>
          </div>
        )}
      </Panel>
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
                <details className="col-span-6 pb-1">
                  <summary className="cursor-pointer text-xs font-semibold text-brand-blue">Ce include ({(c.includes ?? "").split("\n").filter((l: string) => l.trim() && !l.trim().startsWith("#")).length} elemente)</summary>
                  <Textarea name="includes" rows={12} defaultValue={c.includes ?? ""} className="mt-2 font-mono text-xs" placeholder={INCLUDES_HINT} />
                  <p className="mt-1 text-[11px] text-muted">„## Grup” începe un grup · un element pe rând · „? Element” = opțional (apare nebifat în ofertă). Apasă „Salvează” de pe rândul serviciului.</p>
                </details>
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
            <Field label="Ce include" hint="„## Grup”, apoi câte un element pe rând; „? Element” = opțional."><Textarea name="includes" rows={8} className="font-mono text-xs" placeholder={INCLUDES_HINT} /></Field>
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
