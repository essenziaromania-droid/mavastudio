import { requireModule } from "@/lib/crm/auth";
import { createLead } from "../../actions/sales";
import { Field, Input, PageHeader, Panel, Select, Textarea } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { LEAD_SOURCE } from "@/lib/crm/constants";
import { BUDGETS, PROJECT_TYPES } from "@/content/site";
import { getStaff } from "@/lib/crm/queries";

export const metadata = { title: "Lead nou" };

export default async function NewLeadPage() {
  const { sb } = await requireModule("leads");
  const staff = await getStaff(sb);
  return (
    <>
      <PageHeader title="Lead nou" back={{ href: "/crm/leaduri", label: "Lead-uri" }} />
      <Panel className="max-w-3xl">
        <form action={createLead} className="grid gap-4 sm:grid-cols-2">
          <Field label="Nume *"><Input name="name" required /></Field>
          <Field label="Companie"><Input name="company" /></Field>
          <Field label="Email"><Input name="email" type="email" /></Field>
          <Field label="Telefon"><Input name="phone" /></Field>
          <Field label="Sursă"><Select name="source" options={LEAD_SOURCE} defaultValue="manual" /></Field>
          <Field label="Buget"><Select name="budget" options={BUDGETS.map((b) => ({ value: b, label: b }))} placeholder="—" /></Field>
          <Field label="Valoare estimată (lei)"><Input name="value_estimate" type="number" min={0} step="100" /></Field>
          <Field label="Responsabil"><Select name="assigned_to" options={staff.map((p) => ({ value: p.id, label: p.full_name }))} placeholder="—" /></Field>
          <div className="sm:col-span-2">
            <p className="mb-1.5 text-xs font-semibold text-ink-2">Servicii de interes</p>
            <div className="flex flex-wrap gap-2">
              {PROJECT_TYPES.map((t) => (
                <label key={t.value} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50 has-[:checked]:text-brand-blue">
                  <input type="checkbox" name="services" value={t.value} className="accent-brand-blue" /> {t.label}
                </label>
              ))}
            </div>
          </div>
          <Field label="Detalii" className="sm:col-span-2"><Textarea name="message" rows={4} /></Field>
          <div className="sm:col-span-2"><SubmitButton>Salvează lead-ul</SubmitButton></div>
        </form>
      </Panel>
    </>
  );
}
