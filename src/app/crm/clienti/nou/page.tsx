import { requireModule } from "@/lib/crm/auth";
import { createClientAction } from "../../actions/sales";
import { PageHeader, Panel } from "@/components/crm/ui";
import { ClientForm } from "@/components/crm/client-form";

export const metadata = { title: "Client nou" };

export default async function NewClientPage() {
  await requireModule("clienti");
  return (
    <>
      <PageHeader title="Client nou" back={{ href: "/crm/clienti", label: "Clienți" }} />
      <Panel className="max-w-4xl"><ClientForm action={createClientAction} submitLabel="Adaugă clientul" /></Panel>
    </>
  );
}
