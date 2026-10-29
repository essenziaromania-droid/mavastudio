import Link from "next/link";
import { Plus } from "lucide-react";
import { requireModule } from "@/lib/crm/auth";
import { PageHeader, Panel, StatusBadge, Table, Td, Tabs } from "@/components/crm/ui";
import { OFFER_STATUS } from "@/lib/crm/constants";
import { formatDate, formatLei } from "@/lib/utils";

export const metadata = { title: "Oferte" };

export default async function OffersPage({ searchParams }: { searchParams: { status?: string } }) {
  const { sb } = await requireModule("oferte");
  const status = searchParams.status ?? "toate";
  let q = sb.from("offers").select("id, number, title, status, total, created_at, valid_until, clients(name)").order("created_at", { ascending: false }).limit(300);
  if (status !== "toate") q = q.eq("status", status);
  const { data } = await q;
  const { data: all } = await sb.from("offers").select("status, total");
  const sumBy = (s: string) => (all ?? []).filter((o) => o.status === s).reduce((a, o) => a + Number(o.total), 0);

  return (
    <>
      <PageHeader
        title="Oferte"
        sub={<>Acceptate: <b className="text-ink">{formatLei(sumBy("acceptata"))}</b> · În așteptare: <b className="text-ink">{formatLei(sumBy("trimisa") + sumBy("vizualizata"))}</b></>}
        actions={<Link href="/crm/oferte/noua" className="btn-primary !py-2.5"><Plus className="h-4 w-4" /> Generează ofertă</Link>}
      />
      <Tabs
        active={status}
        items={[{ key: "toate", label: "Toate", href: "/crm/oferte", count: all?.length }, ...Object.entries(OFFER_STATUS).map(([k, v]) => ({ key: k, label: v.label, href: `/crm/oferte?status=${k}`, count: (all ?? []).filter((o) => o.status === k).length }))]}
      />
      <Panel pad={false}>
        <Table head={["Număr", "Client", "Titlu", "Valoare", "Data", "Valabilă până", "Status"]} empty="Nicio ofertă.">
          {(data ?? []).map((o) => (
            <tr key={o.id} className="hover:bg-soft/50">
              <Td><Link href={`/crm/oferte/${o.id}`} className="font-semibold text-brand-blue">{o.number}</Link></Td>
              <Td className="font-medium text-ink">{(o.clients as unknown as { name: string } | null)?.name ?? "—"}</Td>
              <Td>{o.title}</Td>
              <Td className="font-semibold">{formatLei(o.total)}</Td>
              <Td className="text-xs">{formatDate(o.created_at)}</Td>
              <Td className="text-xs">{formatDate(o.valid_until)}</Td>
              <Td><StatusBadge map={OFFER_STATUS} value={o.status} /></Td>
            </tr>
          ))}
        </Table>
      </Panel>
    </>
  );
}
