import Link from "next/link";
import { requireModule } from "@/lib/crm/auth";
import { PageHeader, Panel, Select, StatusBadge, Table, Td, Tabs } from "@/components/crm/ui";
import { SubmitButton } from "@/components/crm/client-ui";
import { CONTRACT_STATUS } from "@/lib/crm/constants";
import { formatDate, formatLei } from "@/lib/utils";
import { createBlankContract } from "../actions/contracts";
import { getClientsOptions } from "@/lib/crm/queries";

export const metadata = { title: "Contracte" };

const TABS: Record<string, string[] | null> = { toate: null, draft: ["draft"], trimise: ["trimis", "vizualizat"], semnate: ["semnat"], expirate: ["expirat", "anulat"] };

export default async function ContractsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const { sb } = await requireModule("contracte");
  const tab = searchParams.tab && searchParams.tab in TABS ? searchParams.tab : "toate";
  let q = sb.from("contracts").select("id, number, title, status, value, created_at, signed_at, clients(name)").order("created_at", { ascending: false }).limit(300);
  if (TABS[tab]) q = q.in("status", TABS[tab]!);
  const [{ data }, clients] = await Promise.all([q, getClientsOptions(sb)]);

  return (
    <>
      <PageHeader title="Contracte" sub="Generare, trimitere spre semnare electronică și urmărire." />
      <Tabs active={tab} items={[["toate", "Toate"], ["draft", "Draft"], ["trimise", "Trimise"], ["semnate", "Semnate"], ["expirate", "Expirate"]].map(([k, l]) => ({ key: k, label: l, href: `/crm/contracte?tab=${k}` }))} />
      <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
        <Panel pad={false}>
          <Table head={["Nr. contract", "Client", "Titlu", "Valoare", "Data", "Status"]} empty="Niciun contract. Contractele se generează din oferte acceptate.">
            {(data ?? []).map((c) => (
              <tr key={c.id} className="hover:bg-soft/50">
                <Td><Link href={`/crm/contracte/${c.id}`} className="font-semibold text-brand-blue">{c.number}</Link></Td>
                <Td className="font-medium text-ink">{(c.clients as unknown as { name: string } | null)?.name ?? "—"}</Td>
                <Td>{c.title}</Td>
                <Td className="font-semibold">{formatLei(c.value)}</Td>
                <Td className="text-xs">{formatDate(c.created_at)}</Td>
                <Td><StatusBadge map={CONTRACT_STATUS} value={c.status} /></Td>
              </tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Contract nou (fără ofertă)">
          <form action={createBlankContract} className="space-y-3">
            <Select name="client_id" options={clients} placeholder="Alege clientul" required />
            <input name="title" placeholder="Titlu contract" className="w-full rounded-xl border border-line px-3.5 py-2.5 text-sm" />
            <SubmitButton className="w-full">Adaugă contract</SubmitButton>
          </form>
        </Panel>
      </div>
    </>
  );
}
