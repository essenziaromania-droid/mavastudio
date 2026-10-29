import { requireModule } from "@/lib/crm/auth";
import { PageHeader } from "@/components/crm/ui";
import { OfferBuilder } from "@/components/crm/offer-builder";
import { getClientsOptions } from "@/lib/crm/queries";

export const metadata = { title: "Generează ofertă" };

export default async function NewOfferPage({ searchParams }: { searchParams: { client?: string; lead?: string; edit?: string } }) {
  const { sb } = await requireModule("oferte");
  const [{ data: catalog }, clients] = await Promise.all([sb.from("services_catalog").select("*").eq("active", true).order("sort"), getClientsOptions(sb)]);

  let initial: Parameters<typeof OfferBuilder>[0]["initial"] = { client_id: searchParams.client, lead_id: searchParams.lead };
  if (searchParams.edit) {
    const { data: o } = await sb.from("offers").select("*, offer_items(*)").eq("id", searchParams.edit).single();
    if (o) {
      initial = {
        ...o,
        items: [...(o.offer_items ?? [])].sort((a, b) => a.sort - b.sort).map((i) => ({ name: i.name, description: i.description, quantity: Number(i.quantity), unit: i.unit, unit_price: Number(i.unit_price), recurring: i.recurring, category: i.category, includes: i.includes })),
      };
    }
  }

  return (
    <>
      <PageHeader title={searchParams.edit ? "Editează oferta" : "Generează ofertă"} back={{ href: "/crm/oferte", label: "Oferte" }} />
      <OfferBuilder catalog={(catalog ?? []) as never} clients={clients} initial={initial} />
    </>
  );
}
