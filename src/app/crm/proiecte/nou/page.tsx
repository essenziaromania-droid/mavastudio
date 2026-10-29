import { requireModule } from "@/lib/crm/auth";
import { createProject } from "../../actions/projects";
import { Field, Input, PageHeader, Panel, Select, Textarea } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { SERVICE_CATEGORY } from "@/lib/crm/constants";
import { getClientsOptions, getStaff } from "@/lib/crm/queries";

export const metadata = { title: "Proiect nou" };

export default async function NewProjectPage({ searchParams }: { searchParams: { client?: string } }) {
  const { sb, userId } = await requireModule("proiecte_toate");
  const [clients, staff, { data: templates }] = await Promise.all([getClientsOptions(sb), getStaff(sb), sb.from("project_templates").select("name, category, stages")]);
  return (
    <>
      <PageHeader title="Proiect nou" back={{ href: "/crm/proiecte", label: "Proiecte" }} />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Panel>
          <form action={createProject} className="grid gap-4 sm:grid-cols-2">
            <Field label="Nume proiect *" className="sm:col-span-2"><Input name="name" required placeholder="Website Essenzia" /></Field>
            <Field label="Client"><Select name="client_id" options={clients} placeholder="—" defaultValue={searchParams.client ?? ""} /></Field>
            <Field label="Tip serviciu"><Select name="category" options={Object.fromEntries(Object.entries(SERVICE_CATEGORY).map(([k, v]) => [k, v.label]))} defaultValue="website" /></Field>
            <Field label="Valoare (lei)"><Input name="value" type="number" step="100" min={0} /></Field>
            <Field label="Project Manager"><Select name="manager_id" options={staff.map((p) => ({ value: p.id, label: p.full_name }))} defaultValue={userId} /></Field>
            <Field label="Data începerii"><Input name="start_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></Field>
            <Field label="Deadline" hint="Lasă gol pentru calcul automat din șablon."><Input name="deadline" type="date" /></Field>
            <div className="sm:col-span-2">
              <p className="mb-1.5 text-xs font-semibold text-ink-2">Echipă</p>
              <div className="flex flex-wrap gap-2">
                {staff.map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-3 py-1.5 text-sm has-[:checked]:border-brand-blue has-[:checked]:bg-blue-50">
                    <input type="checkbox" name="members" value={p.id} className="accent-brand-blue" /> {p.full_name}
                  </label>
                ))}
              </div>
            </div>
            <Field label="Descriere" className="sm:col-span-2"><Textarea name="description" rows={3} /></Field>
            <label className="flex items-center gap-2 text-sm text-ink sm:col-span-2"><input type="checkbox" name="template" defaultChecked className="h-4 w-4 accent-brand-blue" /> Creează automat task-urile și tranșele de plată din șablonul tipului de serviciu</label>
            <div className="sm:col-span-2"><SubmitButton>Creează proiectul</SubmitButton></div>
          </form>
        </Panel>
        <Panel title="Șabloane de proiect">
          <div className="space-y-4">
            {(templates ?? []).map((t) => (
              <div key={t.name}>
                <p className="text-sm font-bold text-ink">{t.name}</p>
                <p className="text-xs text-body">{(t.stages as { title: string }[]).map((x) => x.title).join(" → ")}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
