import { requireModule } from "@/lib/crm/auth";
import { Avatar, Badge, Field, Input, PageHeader, Panel, Select } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { ROLES } from "@/lib/crm/constants";
import { inviteEmployee, updateEmployee } from "../actions/admin";

export const metadata = { title: "Angajați" };

export default async function EmployeesPage({ searchParams }: { searchParams: { err?: string; invited?: string } }) {
  const { sb } = await requireModule("angajati");
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: people }, { data: tasks }] = await Promise.all([
    sb.from("profiles").select("*").order("status").order("full_name"),
    sb.from("tasks").select("assignee_id, status, deadline"),
  ]);
  const stats = (id: string) => {
    const t = (tasks ?? []).filter((x) => x.assignee_id === id);
    return { open: t.filter((x) => x.status !== "finalizat").length, done: t.filter((x) => x.status === "finalizat").length, late: t.filter((x) => x.status !== "finalizat" && x.deadline && x.deadline < today).length };
  };

  return (
    <>
      <PageHeader title="Angajați" sub="Echipa, rolurile și accesul în CRM." />
      {searchParams.err && <p className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{searchParams.err}</p>}
      {searchParams.invited && <p className="mb-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Invitația a fost trimisă. Angajatul își va seta parola din emailul primit.</p>}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-3">
          {(people ?? []).map((p) => {
            const st = stats(p.id);
            return (
              <details key={p.id} className="group rounded-2xl border border-line bg-white shadow-card">
                <summary className="flex cursor-pointer list-none items-center gap-4 p-4 [&::-webkit-details-marker]:hidden">
                  <Avatar name={p.full_name} src={p.avatar_url} size={42} />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink">{p.full_name || p.email}</p>
                    <p className="truncate text-xs text-muted">{p.email}{p.phone ? ` · ${p.phone}` : ""}</p>
                  </div>
                  <span className="hidden text-xs text-body md:block">{st.open} deschise · {st.done} finalizate{st.late ? <b className="text-rose-500"> · {st.late} întârziate</b> : ""}</span>
                  <Badge tone="purple">{ROLES[p.role]}</Badge>
                  <Badge tone={p.status === "activ" ? "green" : "gray"}>{p.status === "activ" ? "Activ" : "Inactiv"}</Badge>
                </summary>
                <form action={updateEmployee} className="grid gap-3 border-t border-line p-4 sm:grid-cols-5">
                  <input type="hidden" name="id" value={p.id} />
                  <Field label="Nume"><Input name="full_name" defaultValue={p.full_name} /></Field>
                  <Field label="Telefon"><Input name="phone" defaultValue={p.phone ?? ""} /></Field>
                  <Field label="Rol"><Select name="role" options={ROLES} defaultValue={p.role} /></Field>
                  <Field label="Status"><Select name="status" options={{ activ: "Activ", inactiv: "Inactiv" }} defaultValue={p.status} /></Field>
                  <Field label="Cost orar (lei)" hint="Pentru profitabilitate."><Input name="hourly_cost" type="number" step="1" defaultValue={p.hourly_cost} /></Field>
                  <div className="sm:col-span-5"><SubmitButton className="btn-sm">Salvează</SubmitButton></div>
                </form>
              </details>
            );
          })}
        </div>
        <Panel title="Adaugă angajat">
          <form action={inviteEmployee} className="space-y-3">
            <Field label="Nume complet *"><Input name="full_name" required /></Field>
            <Field label="Email *"><Input name="email" type="email" required placeholder="nume@mavastudio.ro" /></Field>
            <Field label="Telefon"><Input name="phone" /></Field>
            <Field label="Rol"><Select name="role" options={Object.fromEntries(Object.entries(ROLES).filter(([k]) => k !== "admin").concat([["admin", "Administrator"]]))} defaultValue="developer" /></Field>
            <Field label="Cost orar (lei)"><Input name="hourly_cost" type="number" /></Field>
            <SubmitButton className="w-full" pendingText="Se trimite invitația...">Trimite invitație</SubmitButton>
            <p className="text-[11px] text-muted">Angajatul primește un email de la Supabase cu link pentru setarea parolei. Accesul depinde de rol (vezi Setări → Permisiuni).</p>
          </form>
        </Panel>
      </div>
    </>
  );
}
