import { getSession } from "@/lib/crm/auth";
import { PageHeader, Panel } from "@/components/crm/ui";
import { ROLES } from "@/lib/crm/constants";
import { AccountForms, TwoFactor } from "./forms";

export const metadata = { title: "Contul meu" };

export default async function AccountPage({ searchParams }: { searchParams: { reset?: string } }) {
  const s = await getSession();
  return (
    <>
      <PageHeader title="Contul meu" sub={`${s.profile.email} · ${ROLES[s.profile.role]}`} />
      {searchParams.reset && <p className="mb-5 rounded-xl bg-blue-50 px-4 py-3 text-sm text-brand-blue">Setează o parolă nouă pentru contul tău mai jos.</p>}
      <div className="grid gap-6 lg:grid-cols-2">
        <AccountForms fullName={s.profile.full_name} phone={s.profile.phone ?? ""} />
        <Panel title="Verificare în doi pași (2FA)">
          <TwoFactor />
        </Panel>
      </div>
    </>
  );
}
