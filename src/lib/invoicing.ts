import "server-only";
import { createHash } from "crypto";

/**
 * Integrări facturare. CRM-ul nu înlocuiește SmartBill / Oblio / FGO – trimite datele prin API,
 * iar factura (seria, numărul, linkul PDF) se salvează înapoi în CRM.
 */

export type InvoicingSettings = {
  provider: "manual" | "smartbill" | "oblio" | "fgo";
  smartbill: { email: string; token: string; cif: string; series: string };
  oblio: { email: string; secret: string; cif: string; series: string };
  fgo: { cui: string; key: string; series: string };
};

export const DEFAULT_INVOICING: InvoicingSettings = {
  provider: "manual",
  smartbill: { email: "", token: "", cif: "", series: "" },
  oblio: { email: "", secret: "", cif: "", series: "" },
  fgo: { cui: "", key: "", series: "" },
};

export type InvoiceClient = { name: string; type?: string | null; cui?: string | null; reg_com?: string | null; address?: string | null; city?: string | null; county?: string | null; country?: string | null; email?: string | null };
export type InvoiceDraft = { description: string; subtotal: number; vatRate: number; issueDate: string; dueDate?: string | null };
export type EmitResult = { ok: true; series: string; number: string; url?: string; externalId?: string } | { ok: false; error: string };

const isCompany = (c: InvoiceClient) => c.type !== "person" && !!c.cui;

/**
 * Cotele TVA din România (actuale: 21% standard, 11% redusă, 0%; vechi: 19%, 9%, 5%).
 * Cota dedusă din sume rotunjite (ex. 0,17 / 0,83 = 20,48%) se aliniază la cea mai apropiată cotă legală.
 */
const VAT_RATES = [21, 11, 0, 19, 9, 5];
export function snapVatRate(rate: number) {
  return VAT_RATES.reduce((best, r) => (Math.abs(r - rate) < Math.abs(best - rate) ? r : best), VAT_RATES[0]!);
}

/** Denumirea cotei, cum apare în SmartBill. */
function smartbillTaxName(rate: number) {
  if (rate === 21) return "Normala";
  if (rate === 11) return "Redusa";
  if (rate === 0) return "SDD";
  return "Veche";
}

/** Cod stabil pentru o linie de factură (unele conturi SmartBill cer cod obligatoriu la produse). */
const productCode = (name: string) => "MV-" + createHash("sha1").update(name.trim().toLowerCase()).digest("hex").slice(0, 8).toUpperCase();

async function smartbill(cfg: InvoicingSettings["smartbill"], c: InvoiceClient, d: InvoiceDraft): Promise<EmitResult> {
  if (!cfg.email || !cfg.token || !cfg.cif || !cfg.series) return { ok: false, error: "Completează datele SmartBill în Setări → Integrări." };
  const res = await fetch("https://ws.smartbill.ro/SBORO/api/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json", Authorization: "Basic " + Buffer.from(`${cfg.email}:${cfg.token}`).toString("base64") },
    body: JSON.stringify({
      companyVatCode: cfg.cif,
      client: { name: c.name, vatCode: c.cui ?? "", regCom: c.reg_com ?? "", address: c.address ?? "", city: c.city ?? "", county: c.county ?? "", country: c.country ?? "Romania", email: c.email ?? "", isTaxPayer: isCompany(c) && /^RO/i.test(c.cui ?? ""), saveToDb: true },
      issueDate: d.issueDate,
      dueDate: d.dueDate ?? undefined,
      seriesName: cfg.series,
      isDraft: false,
      products: [{ name: d.description, code: productCode(d.description), isDiscount: false, measuringUnitName: "buc", currency: "RON", quantity: 1, price: d.subtotal, isTaxIncluded: false, taxName: smartbillTaxName(d.vatRate), taxPercentage: d.vatRate, isService: true, saveToDb: false }],
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errorText) return { ok: false, error: json.errorText || json.message || `SmartBill a răspuns cu ${res.status}` };
  return { ok: true, series: json.series, number: json.number, url: json.url };
}

async function oblio(cfg: InvoicingSettings["oblio"], c: InvoiceClient, d: InvoiceDraft): Promise<EmitResult> {
  if (!cfg.email || !cfg.secret || !cfg.cif || !cfg.series) return { ok: false, error: "Completează datele Oblio în Setări → Integrări." };
  const tokRes = await fetch("https://www.oblio.eu/api/authorize/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: cfg.email, client_secret: cfg.secret }),
  });
  const tok = await tokRes.json().catch(() => ({}));
  if (!tok.access_token) return { ok: false, error: "Autentificarea Oblio a eșuat. Verifică emailul și cheia API." };
  const res = await fetch("https://www.oblio.eu/api/docs/invoice", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok.access_token}` },
    body: JSON.stringify({
      cif: cfg.cif,
      client: { cif: c.cui ?? "", name: c.name, rc: c.reg_com ?? "", address: c.address ?? "", state: c.county ?? "", city: c.city ?? "", country: c.country ?? "Romania", email: c.email ?? "", vatPayer: isCompany(c) && /^RO/i.test(c.cui ?? "") },
      issueDate: d.issueDate,
      dueDate: d.dueDate ?? undefined,
      seriesName: cfg.series,
      language: "RO",
      precision: 2,
      currency: "RON",
      products: [{ name: d.description, measuringUnit: "buc", currency: "RON", vatName: d.vatRate ? "Normala" : "SDD", vatPercentage: d.vatRate, vatIncluded: false, quantity: 1, price: d.subtotal, productType: "Serviciu" }],
    }),
  });
  const json = await res.json().catch(() => ({}));
  if (json.status !== 200 || !json.data) return { ok: false, error: json.statusMessage || `Oblio a răspuns cu ${res.status}` };
  return { ok: true, series: json.data.seriesName, number: String(json.data.number), url: json.data.link };
}

async function fgo(cfg: InvoicingSettings["fgo"], c: InvoiceClient, d: InvoiceDraft): Promise<EmitResult> {
  if (!cfg.cui || !cfg.key || !cfg.series) return { ok: false, error: "Completează datele FGO în Setări → Integrări." };
  const hash = createHash("sha1").update(`${cfg.cui}${cfg.key}${c.name}`).digest("hex").toUpperCase();
  const gross = Math.round(d.subtotal * (1 + d.vatRate / 100) * 100) / 100;
  const body = new URLSearchParams({
    CodUnic: cfg.cui,
    Hash: hash,
    Serie: cfg.series,
    Valuta: "RON",
    TipFactura: "Factura",
    DataEmitere: d.issueDate,
    ...(d.dueDate ? { DataScadenta: d.dueDate } : {}),
    "Client[Denumire]": c.name,
    "Client[CodUnic]": c.cui ?? "",
    "Client[NrRegCom]": c.reg_com ?? "",
    "Client[Tip]": isCompany(c) ? "PJ" : "PF",
    "Client[Judet]": c.county ?? "",
    "Client[Localitate]": c.city ?? "",
    "Client[Adresa]": c.address ?? "",
    "Client[Email]": c.email ?? "",
    "Continut[0][Denumire]": d.description,
    "Continut[0][PretUnitar]": String(gross),
    "Continut[0][UM]": "buc",
    "Continut[0][NrProduse]": "1",
    "Continut[0][CotaTVA]": String(d.vatRate),
    PlatformaUrl: "https://www.mavastudio.ro",
  });
  const res = await fetch("https://api.fgo.ro/v1/factura/emitere", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  const json = await res.json().catch(() => ({}));
  if (!json.Success) return { ok: false, error: json.Message || `FGO a răspuns cu ${res.status}` };
  return { ok: true, series: json.Factura?.Serie ?? cfg.series, number: String(json.Factura?.Numar ?? ""), url: json.Factura?.Link };
}

export async function emitWithProvider(settings: InvoicingSettings, client: InvoiceClient, draft: InvoiceDraft): Promise<EmitResult> {
  try {
    switch (settings.provider) {
      case "smartbill":
        return await smartbill(settings.smartbill, client, draft);
      case "oblio":
        return await oblio(settings.oblio, client, draft);
      case "fgo":
        return await fgo(settings.fgo, client, draft);
      default:
        return { ok: false, error: "Niciun program de facturare selectat. Alege SmartBill, Oblio sau FGO în Setări → Integrări." };
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Eroare de conexiune cu programul de facturare." };
  }
}
