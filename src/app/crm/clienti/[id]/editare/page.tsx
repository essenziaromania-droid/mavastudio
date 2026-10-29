import { notFound } from "next/navigation";
import { requireModule } from "@/lib/crm/auth";
import { deleteClientAction, updateClientAction } from "../../../actions/sales";
import { PageHeader, Panel } from "@/components/crm/ui";
import { ClientForm } from "@/components/crm/client-form";
import { ConfirmSubmit } from "@/components/crm/client-ui";

export const metadata = { title: "Editează client" };

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const { sb } = await requireModule("clienti");
  const { data: c } = await sb.from("clients").select("*").eq("id", params.id).maybeSingle();
  if (!c) notFound();
  return (
    <>
      <PageHeader title={`Editează: ${c.name}`} back={{ href: `/crm/clienti/${c.id}`, label: c.name }} />
      <Panel className="max-w-4xl">
        <ClientForm action={updateClientAction} client={c} />
        <form action={deleteClientAction} className="mt-6 border-t border-line pt-5">
          <input type="hidden" name="id" value={c.id} />
          <ConfirmSubmit message="Ștergi clientul? Proiectele, ofertele și facturile rămân, dar fără client asociat.">Șterge clientul</ConfirmSubmit>
        </form>
      </Panel>
    </>
  );
}
