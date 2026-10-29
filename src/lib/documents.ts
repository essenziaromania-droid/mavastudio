import { formatDate, formatLei } from "@/lib/utils";
import { includesMarkdown } from "@/lib/includes";
import { ANNEX_KEYS, ANNEX_LABELS, CONTRACT_ANNEXES, CONTRACT_BODY, CONTRACT_DPA, DPA_CATEGORIES, type ContractTemplate } from "@/lib/contract-template";

export type OfferItem = { name: string; description?: string | null; quantity: number; unit: string; unit_price: number; recurring?: boolean; category?: string | null; includes?: unknown };

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

/** Generează textul contractului (markdown) din ofertă, pe baza șablonului (Setări → Contract). Poate fi editat în CRM înainte de trimitere. */
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
  offerNumber,
  template,
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
  offerNumber?: string | null;
  template?: ContractTemplate | null;
}) {
  const services = items
    .map((i) => `- **${i.name}**${i.description ? ` – ${i.description}` : ""}: ${i.quantity} ${i.unit} × ${formatLei(i.unit_price)}${i.recurring ? " / lună" : ""}`)
    .join("\n");

  // Anexele: câte una pentru fiecare tip de serviciu din ofertă (magazinul online primește și anexa de website).
  const cats = new Set(items.map((i) => i.category).filter(Boolean) as string[]);
  if (cats.has("ecommerce")) cats.add("website");
  const annexKeys = ANNEX_KEYS.filter((k) => cats.has(k));
  const withDpa = annexKeys.some((k) => DPA_CATEGORIES.includes(k));
  // Prima anexă: ce include concret fiecare serviciu, exact cum a fost bifat în ofertă.
  const specs = includesMarkdown(items);
  const annexes = [
    ...(specs
      ? [{ label: "Specificațiile serviciilor", text: `### Specificațiile serviciilor\n\nServiciile prevăzute la Art. 2 includ elementele de mai jos, conform ofertei acceptate. Orice element care nu se regăsește în această listă nu este inclus și poate fi ofertat separat.\n\n${specs}` }]
      : []),
    ...annexKeys.map((k) => ({ label: ANNEX_LABELS[k], text: template?.annexes?.[k]?.trim() || CONTRACT_ANNEXES[k] })),
    ...(withDpa ? [{ label: "Prelucrarea datelor cu caracter personal", text: template?.dpa?.trim() || CONTRACT_DPA }] : []),
  ];
  const annexList = annexes.length ? annexes.map((a, i) => `Anexa ${i + 1} – ${a.label}`).join("; ") : "nu este cazul";

  const recurring = items.some((i) => i.recurring);
  const oneOff = !items.length || items.some((i) => !i.recurring);
  const vars: Record<string, string> = {
    numar: number,
    data: formatDate(startDate ?? new Date()),
    prestator: party(company, "MAVA Studio"),
    beneficiar: party(client, client.name),
    reprezentant: client.contact_name && client.type !== "person" ? `, reprezentată prin ${client.contact_name}` : "",
    oferta: offerNumber || "—",
    servicii: services || "- conform ofertei",
    valoare: formatLei(total, { decimals: true }),
    tva: `${vatRate}%`,
    plata: paymentTerms?.trim() || "50% avans la semnare, 30% la livrarea versiunii beta, 20% la lansare",
    termen: deliveryTerm?.trim() || "conform ofertei, începând de la data prevăzută la Art. 5.2",
    cont_bancar: company.iban ? `, în contul ${company.iban}${company.bank ? ` deschis la ${company.bank}` : ""}` : "",
    email_prestator: company.email || "contact@mavastudio.ro",
    email_beneficiar: client.email || "comunicată de Beneficiar",
    anexe: annexList,
  };

  const fill = (text: string) =>
    text
      .replace(/\{\{#abonament\}\}([\s\S]*?)\{\{\/abonament\}\}/g, (_, t: string) => (recurring ? t : ""))
      .replace(/\{\{#proiect\}\}([\s\S]*?)\{\{\/proiect\}\}/g, (_, t: string) => (oneOff ? t : ""))
      .replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (m, k: string) => vars[k] ?? m);

  const body = fill(template?.body?.trim() || CONTRACT_BODY);
  const annexText = annexes.map((a, i) => `# Anexa ${i + 1} la Contractul nr. ${number}\n\n${fill(a.text)}`).join("\n\n");
  return renumber(`${body.trim()}\n\n${annexText}`).replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

/**
 * Renumerotează punctele articolelor (ex. **4.3.** → **4.2.**) după eliminarea clauzelor condiționale
 * și actualizează trimiterile de tipul „Art. 4.5” din tot documentul.
 */
function renumber(md: string) {
  const map = new Map<string, string>();
  let art = "";
  let n = 0;
  for (const line of md.split("\n")) {
    const a = /^## Art\. (\d+)\./.exec(line);
    if (a) {
      art = a[1]!;
      n = 0;
      continue;
    }
    if (line.startsWith("# ")) art = "";
    const p = /^\*\*(\d+)\.(\d+)\.\*\*/.exec(line);
    if (p && art && p[1] === art) map.set(`${p[1]}.${p[2]}`, `${art}.${++n}`);
  }
  return md
    .replace(/^\*\*(\d+\.\d+)\.\*\*/gm, (m, k: string) => (map.has(k) ? `**${map.get(k)}.**` : m))
    .replace(/Art\. (\d+\.\d+)/g, (m, k: string) => (map.has(k) ? `Art. ${map.get(k)}` : m));
}
