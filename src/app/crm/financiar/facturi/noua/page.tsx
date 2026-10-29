import { requireModule } from "@/lib/crm/auth";
import { createInvoice } from "../../../actions/finance";
import { Field, Input, PageHeader, Panel, Select } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { getClientsOptions, getProjectsOptions } from "@/lib/crm/queries";
import { SERVICE_CATEGORY } from "@/lib/crm/constants";

export const metadata = { title: "Factură nouă" };

export default async function NewInvoicePage({ searchParams }: { searchParams: { client?: string; project?: string; milestone?: string } }) {
  const { sb } = await requireModule("financiar");
  const [clients, projects] = await Promise.all([getClientsOptions(sb), getProjectsOptions(sb)]);
  let amount = "";
  let description = "";
  let category = "";
  let clientId = searchParams.client ?? "";
  if (searchParams.milestone) {
    const { data: m } = await sb.from("payment_milestones").select("label, amount, projects(name, category, client_id)").eq("id", searchParams.milestone).single();
    if (m) {
      const p = m.projects as unknown as { name: string; category: string; client_id: string } | null;
      amount = String(m.amount);
      description = `${m.label} – ${p?.name ?? ""}`;
      category = p?.category ?? "";
      clientId = p?.client_id ?? clientId;
    }
  } else if (searchParams.project) {
    const { data: p } = await sb.from("projects").select("name, category, client_id").eq("id", searchParams.project).single();
    if (p) {
      description = p.name;
      category = p.category ?? "";
      clientId = p.client_id ?? clientId;
    }
  }
  const in5 = new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title="Factură nouă" back={{ href: "/crm/financiar?tab=facturi", label: "Facturi" }} />
      <Panel className="max-w-3xl">
        <form action={createInvoice} className="grid gap-4 sm:grid-cols-2">
          {searchParams.milestone && <input type="hidden" name="milestone_id" value={searchParams.milestone} />}
          <Field label="Client *"><Select name="client_id" options={clients} defaultValue={clientId} placeholder="Alege clientul" required /></Field>
          <Field label="Proiect"><Select name="project_id" options={projects} defaultValue={searchParams.project ?? ""} placeholder="—" /></Field>
          <Field label="Descriere servicii *" className="sm:col-span-2"><Input name="description" defaultValue={description} required /></Field>
          <Field label="Total cu TVA (lei) *"><Input name="total" type="number" step="0.01" defaultValue={amount} required /></Field>
          <Field label="Cotă TVA (%)"><Input name="vat_rate" type="number" defaultValue={21} /></Field>
          <Field label="Data emiterii"><Input name="issue_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
          <Field label="Scadență"><Input name="due_date" type="date" defaultValue={in5} /></Field>
          <Field label="Categorie serviciu" hint="Pentru raportul „Venituri pe servicii”."><Select name="service_category" options={Object.fromEntries(Object.entries(SERVICE_CATEGORY).map(([k, v]) => [k, v.label]))} defaultValue={category} placeholder="—" /></Field>
          <div className="rounded-xl bg-soft p-4 text-sm sm:col-span-2">
            <label className="flex items-center gap-2 font-semibold text-ink"><input type="radio" name="mode" value="draft" defaultChecked className="accent-brand-blue" /> Creează draft și emite din CRM prin SmartBill / Oblio / FGO</label>
            <label className="mt-2 flex items-center gap-2 font-semibold text-ink"><input type="radio" name="mode" value="manual" className="accent-brand-blue" /> Factura e deja emisă – doar o înregistrez</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Input name="series" placeholder="Serie (ex. MAVA)" />
              <Input name="number" placeholder="Număr" />
              <Input name="external_url" placeholder="Link PDF (opțional)" />
            </div>
          </div>
          <div className="sm:col-span-2"><SubmitButton>Salvează factura</SubmitButton></div>
        </form>
      </Panel>
    </>
  );
}
