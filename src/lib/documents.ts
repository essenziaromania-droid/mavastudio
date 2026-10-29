import { formatDate, formatLei } from "@/lib/utils";

export type OfferItem = { name: string; description?: string | null; quantity: number; unit: string; unit_price: number; recurring?: boolean; category?: string | null };

export function computeTotals(items: OfferItem[], discountPercent: number, vatRate: number) {
  const subtotal = round(items.reduce((s, i) => s + Number(i.quantity) * Number(i.unit_price), 0));
  const discount = round((subtotal * Number(discountPercent || 0)) / 100);
  const base = subtotal - discount;
  const vat = round((base * Number(vatRate || 0)) / 100);
  return { subtotal, discount_amount: discount, vat_amount: vat, total: round(base + vat) };
}

export function round(n: number) {
  return Math.round(n * 100) / 100;
}

export type Company = { name?: string; legal_name?: string; cui?: string; reg_com?: string; address?: string; iban?: string; bank?: string; email?: string; phone?: string };
export type ClientLike = { name: string; type?: string; cui?: string | null; reg_com?: string | null; address?: string | null; city?: string | null; county?: string | null; email?: string | null; phone?: string | null; contact_name?: string | null };

function party(c: { name?: string; legal_name?: string; cui?: string | null; reg_com?: string | null; address?: string | null; city?: string | null; county?: string | null }, fallback: string) {
  const parts = [
    `**${c.legal_name || c.name || fallback}**`,
    c.cui ? `CUI ${c.cui}` : null,
    c.reg_com ? `Nr. Reg. Com. ${c.reg_com}` : null,
    [c.address, c.city, c.county].filter(Boolean).join(", ") || null,
  ].filter(Boolean);
  return parts.join(", ");
}

/** Generează textul contractului (markdown) din ofertă. Poate fi editat în CRM înainte de trimitere. */
export function buildContractBody({
  number,
  company,
  client,
  items,
  total,
  vatRate,
  deliveryTerm,
  paymentTerms,
  startDate,
}: {
  number: string;
  company: Company;
  client: ClientLike;
  items: OfferItem[];
  total: number;
  vatRate: number;
  deliveryTerm?: string | null;
  paymentTerms?: string | null;
  startDate?: string | null;
}) {
  const lines = items.map((i) => `- ${i.name}${i.description ? ` – ${i.description}` : ""}: ${i.quantity} ${i.unit} × ${formatLei(i.unit_price)}${i.recurring ? " / lună" : ""}`).join("\n");
  return `# Contract de prestări servicii nr. ${number}

Încheiat astăzi, ${formatDate(startDate ?? new Date())}, între:

1. ${party(company, "MAVA Studio")}, în calitate de **Prestator**, și
2. ${party(client, client.name)}, în calitate de **Beneficiar**${client.contact_name ? `, reprezentat prin ${client.contact_name}` : ""}.

## 1. Obiectul contractului

Prestatorul se obligă să realizeze pentru Beneficiar următoarele servicii:

${lines}

## 2. Valoarea contractului

Valoarea totală a contractului este de **${formatLei(total)}** (TVA ${vatRate}% inclus, unde este cazul).

## 3. Modalitatea de plată

${paymentTerms || "50% avans la semnare, 30% la livrarea versiunii beta, 20% la lansare."}

Plata se face prin transfer bancar, în termen de 5 zile lucrătoare de la emiterea facturii${company.iban ? `, în contul ${company.iban}${company.bank ? ` deschis la ${company.bank}` : ""}` : ""}.

## 4. Termen de realizare

${deliveryTerm || "Termenul de realizare este cel stabilit în ofertă și începe să curgă de la primirea avansului și a materialelor necesare."}

## 5. Obligațiile părților

**Prestatorul** se obligă să realizeze serviciile la standarde profesionale, să informeze Beneficiarul despre stadiul proiectului și să păstreze confidențialitatea informațiilor primite.

**Beneficiarul** se obligă să furnizeze la timp materialele și informațiile necesare, să ofere feedback în termen de 5 zile lucrătoare de la fiecare livrare și să achite contravaloarea serviciilor la termen.

## 6. Revizii și modificări

Sunt incluse două runde de revizii pentru fiecare etapă. Modificările care depășesc obiectul contractului se ofertează separat.

## 7. Drepturi de proprietate intelectuală

După plata integrală, drepturile patrimoniale asupra livrabilelor finale se transferă Beneficiarului. Prestatorul poate prezenta proiectul în portofoliul propriu, cu excepția cazului în care părțile convin altfel în scris.

## 8. Confidențialitate și date personale

Părțile se obligă să păstreze confidențialitatea informațiilor primite și să respecte Regulamentul (UE) 2016/679 (GDPR).

## 9. Încetarea contractului

Contractul încetează prin îndeplinirea obligațiilor, prin acordul părților sau prin reziliere, cu notificare scrisă de 15 zile, în cazul neîndeplinirii obligațiilor de către una dintre părți.

## 10. Dispoziții finale

Eventualele litigii se soluționează pe cale amiabilă, iar în caz contrar de instanțele competente. Contractul poate fi semnat electronic, iar semnătura electronică are aceeași valoare ca semnătura olografă.
`;
}
