import "server-only";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { asSaved } from "@/lib/includes";
import { Document, Font, Image, Page, Path, Svg, StyleSheet, Text, View, renderToBuffer, Defs, LinearGradient, Stop } from "@react-pdf/renderer";
import type { Company } from "@/lib/documents";
import { formatDate, formatLei } from "@/lib/utils";

const fontDir = path.join(process.cwd(), "public", "fonts");
Font.register({
  family: "Jakarta",
  fonts: [
    { src: path.join(fontDir, "PlusJakartaSans-Regular.ttf"), fontWeight: 400 },
    { src: path.join(fontDir, "PlusJakartaSans-Bold.ttf"), fontWeight: 700 },
    { src: path.join(fontDir, "PlusJakartaSans-ExtraBold.ttf"), fontWeight: 800 },
  ],
});
Font.registerHyphenationCallback((w) => [w]);

const INK = "#0A0F3D";
const BODY = "#4B5375";
const MUTED = "#7A819E";
const LINE = "#E8EBF7";
const BLUE = "#2B4CF5";

const st = StyleSheet.create({
  page: { fontFamily: "Jakarta", fontSize: 9.5, color: BODY, paddingTop: 36, paddingBottom: 56, paddingHorizontal: 40, lineHeight: 1.45 },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 6 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 26 },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  h1: { fontSize: 22, fontWeight: 800, color: INK },
  h2: { fontSize: 12, fontWeight: 700, color: INK, marginTop: 14, marginBottom: 6 },
  muted: { color: MUTED, fontSize: 8.5 },
  box: { borderWidth: 1, borderColor: LINE, borderRadius: 10, padding: 12 },
  row: { flexDirection: "row" },
  th: { fontSize: 8, fontWeight: 700, color: MUTED, textTransform: "uppercase", paddingVertical: 6 },
  td: { paddingVertical: 7, borderTopWidth: 1, borderTopColor: LINE },
  totalRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: MUTED, borderTopWidth: 1, borderTopColor: LINE, paddingTop: 8 },
});

const MARK_PNG = path.join(process.cwd(), "public", "logo-mark.png");

function Mark() {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={MARK_PNG} style={{ width: 43, height: 28 }} />;
}

function GradientBar() {
  return (
    <Svg style={st.bar} viewBox="0 0 600 6" preserveAspectRatio="none">
      <Defs>
        <LinearGradient id="b" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#00B4FF" />
          <Stop offset="0.5" stopColor="#2B6BF7" />
          <Stop offset="1" stopColor="#B23CF0" />
        </LinearGradient>
      </Defs>
      <Path d="M0 0 H600 V6 H0 Z" fill="url(#b)" />
    </Svg>
  );
}

function Brand() {
  return (
    <View style={st.brand}>
      <Mark />
      <View>
        <Text style={{ fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1 }}>MAVA</Text>
        <Text style={{ fontSize: 6, letterSpacing: 3, color: INK }}>STUDIO</Text>
      </View>
    </View>
  );
}

function companyLines(c: Company) {
  return [c.legal_name || c.name || "MAVA Studio", c.cui && `CUI ${c.cui}`, c.reg_com && `Reg. Com. ${c.reg_com}`, c.address, c.iban && `IBAN ${c.iban}${c.bank ? ` · ${c.bank}` : ""}`, c.email || "contact@mavastudio.ro"].filter(Boolean) as string[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function renderOfferPdf(o: any, company: Company): Promise<Buffer> {
  const items = [...(o.offer_items ?? [])].sort((a: any, b: any) => a.sort - b.sort);
  const cl = o.clients ?? {};
  const doc = (
    <Document title={`Oferta ${o.number}`} author="MAVA Studio">
      <Page size="A4" style={st.page}>
        <GradientBar />
        <View style={st.header}>
          <Brand />
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[st.h1, { lineHeight: 1.2, marginBottom: 4 }]}>Ofertă</Text>
            <Text style={{ color: BLUE, fontWeight: 700 }}>{o.number}</Text>
            <Text style={st.muted}>Data: {formatDate(o.created_at)}{o.valid_until ? ` · Valabilă până la ${formatDate(o.valid_until)}` : ""}</Text>
          </View>
        </View>

        <View style={[st.row, { gap: 12, marginBottom: 18 }]}>
          <View style={[st.box, { flex: 1 }]}>
            <Text style={[st.muted, { marginBottom: 4 }]}>FURNIZOR</Text>
            {companyLines(company).map((l, i) => <Text key={i} style={i === 0 ? { fontWeight: 700, color: INK } : undefined}>{l}</Text>)}
          </View>
          <View style={[st.box, { flex: 1 }]}>
            <Text style={[st.muted, { marginBottom: 4 }]}>CLIENT</Text>
            <Text style={{ fontWeight: 700, color: INK }}>{cl.name}</Text>
            {cl.cui && <Text>CUI {cl.cui}</Text>}
            {cl.reg_com && <Text>Reg. Com. {cl.reg_com}</Text>}
            {(cl.address || cl.city) && <Text>{[cl.address, cl.city, cl.county].filter(Boolean).join(", ")}</Text>}
            {cl.contact_name && <Text>În atenția: {cl.contact_name}</Text>}
            {(cl.contact_email || cl.email) && <Text>{cl.contact_email || cl.email}</Text>}
          </View>
        </View>

        <Text style={[st.h2, { fontSize: 14, marginTop: 0 }]}>{o.title}</Text>

        <View style={{ marginTop: 6 }}>
          <View style={[st.row, { borderBottomWidth: 1, borderBottomColor: LINE }]}>
            <Text style={[st.th, { flex: 5 }]}>Serviciu</Text>
            <Text style={[st.th, { flex: 1.2, textAlign: "right" }]}>Cant.</Text>
            <Text style={[st.th, { flex: 1.8, textAlign: "right" }]}>Preț unitar</Text>
            <Text style={[st.th, { flex: 2, textAlign: "right" }]}>Valoare</Text>
          </View>
          {items.map((i: any) => (
            <View key={i.id ?? i.name} style={[st.row, { paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: LINE }]} wrap={false}>
              <View style={{ flex: 5, paddingRight: 8 }}>
                <Text style={{ fontWeight: 700, color: INK }}>{i.name}{i.recurring ? " (lunar)" : ""}</Text>
                {i.description && <Text style={st.muted}>{i.description}</Text>}
                {asSaved(i.includes).map((g) => (
                  <Text key={g.group} style={{ fontSize: 8, color: BODY, marginTop: 2 }}>
                    <Text style={{ fontWeight: 700, color: INK }}>{g.group}: </Text>
                    {g.items.join(" · ")}
                  </Text>
                ))}
              </View>
              <Text style={{ flex: 1.2, textAlign: "right" }}>{Number(i.quantity)} {i.unit}</Text>
              <Text style={{ flex: 1.8, textAlign: "right" }}>{formatLei(i.unit_price)}</Text>
              <Text style={{ flex: 2, textAlign: "right", fontWeight: 700, color: INK }}>{formatLei(Number(i.quantity) * Number(i.unit_price))}</Text>
            </View>
          ))}
        </View>

        <View style={{ alignSelf: "flex-end", width: 230, marginTop: 12 }} wrap={false}>
          <View style={st.totalRow}><Text>Subtotal</Text><Text>{formatLei(o.subtotal, { decimals: true })}</Text></View>
          {Number(o.discount_amount) > 0 && <View style={st.totalRow}><Text>Discount ({Number(o.discount_percent)}%)</Text><Text>-{formatLei(o.discount_amount, { decimals: true })}</Text></View>}
          <View style={st.totalRow}><Text>TVA ({Number(o.vat_rate)}%)</Text><Text>{formatLei(o.vat_amount, { decimals: true })}</Text></View>
          <View style={[st.totalRow, { marginTop: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: LINE }]}>
            <Text style={{ fontWeight: 800, color: INK, fontSize: 12 }}>Total</Text>
            <Text style={{ fontWeight: 800, color: BLUE, fontSize: 12 }}>{formatLei(o.total, { decimals: true })}</Text>
          </View>
        </View>

        {[
          ["Termen de realizare", o.delivery_term],
          ["Modalitate de plată", o.payment_terms],
          ["Condiții", o.conditions],
          ["Observații", o.notes],
        ]
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <View key={k} wrap={false}>
              <Text style={st.h2}>{k}</Text>
              <Text>{v}</Text>
            </View>
          ))}

        <View style={st.footer} fixed>
          <Text>MAVA Studio · www.mavastudio.ro · contact@mavastudio.ro</Text>
        </View>
      </Page>
    </Document>
  );
  return addPageNumbers(await renderToBuffer(doc));
}

/* ───────────── Contract: text sobru, de document juridic ───────────── */

const ct = StyleSheet.create({
  page: { fontFamily: "Jakarta", fontSize: 9.5, color: "#1F2433", paddingTop: 40, paddingBottom: 60, paddingHorizontal: 56, lineHeight: 1.5 },
  title: { fontSize: 15, fontWeight: 800, color: INK, textAlign: "center", marginTop: 6, marginBottom: 14 },
  annexTitle: { fontSize: 13, fontWeight: 800, color: INK, textAlign: "center", marginBottom: 4 },
  annexSub: { fontSize: 10.5, fontWeight: 700, color: INK, textAlign: "center", marginBottom: 14 },
  art: { fontSize: 10.5, fontWeight: 700, color: INK, marginTop: 12, marginBottom: 5 },
  p: { marginBottom: 6, textAlign: "justify" },
  li: { flexDirection: "row", marginBottom: 3, paddingLeft: 8 },
  bullet: { width: 14 },
  liText: { flex: 1, textAlign: "justify" },
  signTitle: { fontWeight: 700, color: INK, marginBottom: 4 },
  signLine: { borderBottomWidth: 1, borderBottomColor: "#9AA1B9", height: 34, marginTop: 6, marginBottom: 4 },
  footerLeft: { position: "absolute", bottom: 28, left: 56, fontSize: 8, color: MUTED },
});

/** Textul contractului fără marcaje: fără ** și fără diezi; doar titlurile sunt îngroșate. */
function ContractText({ text }: { text: string }) {
  const plain = (s: string) => s.replace(/\*\*/g, "").replace(/\s*\n\s*/g, " ").trim();
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  let first = true;
  return (
    <>
      {blocks.map((t, i) => {
        if (t.startsWith("# Anexa")) return <Text key={i} break style={ct.annexTitle}>{plain(t.slice(2))}</Text>;
        if (t.startsWith("# ")) {
          const style = first ? ct.title : ct.annexTitle;
          first = false;
          return <Text key={i} style={style}>{plain(t.slice(2))}</Text>;
        }
        if (t.startsWith("### ")) return <Text key={i} style={ct.annexSub}>{plain(t.slice(4))}</Text>;
        if (t.startsWith("## ")) return <Text key={i} style={ct.art} minPresenceAhead={40}>{plain(t.slice(3))}</Text>;
        const lines = t.split("\n").map((l) => l.trim());
        // Liste (- sau 1.), eventual precedate de un rând de introducere.
        const listStart = lines.findIndex((l) => /^(-|\d+\.)\s/.test(l));
        if (listStart !== -1 && lines.slice(listStart).every((l) => /^(-|\d+\.)\s/.test(l))) {
          return (
            <View key={i} style={{ marginBottom: 6 }}>
              {listStart > 0 && <Text style={ct.p}>{plain(lines.slice(0, listStart).join(" "))}</Text>}
              {lines.slice(listStart).map((l, j) => (
                <View key={j} style={ct.li} wrap={false}>
                  <Text style={ct.bullet}>{l.startsWith("-") ? "•" : l.split(" ")[0]}</Text>
                  <Text style={ct.liText}>{plain(l.replace(/^(-|\d+\.)\s/, ""))}</Text>
                </View>
              ))}
            </View>
          );
        }
        return <Text key={i} style={ct.p}>{plain(t)}</Text>;
      })}
    </>
  );
}

type Party = { title: string; entity: string; signer?: string | null; at?: string | null; ip?: string | null; image?: string | null };

/** O parte semnatară: denumire, semnătura desenată (dacă există) și datele semnării electronice. */
function SignBox({ p, compact }: { p: Party; compact?: boolean }) {
  const h = compact ? 30 : 40;
  return (
    <View style={{ flex: 1 }}>
      <Text style={ct.signTitle}>{p.title}</Text>
      <Text>{p.entity}</Text>
      {p.at ? (
        <>
          {p.image ? (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image src={p.image} style={{ height: h, width: h * 3, objectFit: "contain", objectPositionX: 0, marginTop: 4 }} />
          ) : (
            <View style={{ height: h }} />
          )}
          <View style={{ borderTopWidth: 1, borderTopColor: "#9AA1B9", paddingTop: 3 }}>
            <Text style={{ fontSize: 8.5, color: INK }}>{p.signer}</Text>
            <Text style={{ fontSize: 7.5, color: "#047857" }}>Semnat electronic · {formatDate(p.at, true)}{p.ip ? ` · IP ${p.ip}` : ""}</Text>
          </View>
        </>
      ) : (
        <>
          <View style={[ct.signLine, { height: h }]} />
          <Text style={st.muted}>Semnătura și data</Text>
        </>
      )}
    </View>
  );
}

function Signatures({ c, company, compact }: { c: any; company: Company; compact?: boolean }) {
  const provider: Party = {
    title: "PRESTATOR",
    entity: company.legal_name || company.name || "MAVA Studio",
    signer: c.provider_signed_by,
    at: c.provider_signed_at,
    ip: c.provider_signed_ip,
    image: c.provider_signature,
  };
  const client: Party = { title: "BENEFICIAR", entity: c.clients?.name ?? "", signer: c.signed_by_name, at: c.signed_at, ip: c.signed_ip, image: c.client_signature };
  return (
    <View style={[st.row, { gap: 36, marginTop: compact ? 18 : 26 }]} wrap={false}>
      <SignBox p={provider} compact={compact} />
      <SignBox p={client} compact={compact} />
    </View>
  );
}

export async function renderContractPdf(c: any, company: Company): Promise<Buffer> {
  const body = String(c.body ?? "").replace(/\r\n?/g, "\n");
  // Semnăturile vin la finalul contractului și la finalul fiecărei anexe.
  const parts = body.split(/^(?=# Anexa)/m);
  const main = parts[0] ?? "";
  const annexes = parts.slice(1);
  const doc = (
    <Document title={`Contract ${c.number}`} author="MAVA Studio">
      <Page size="A4" style={ct.page}>
        <GradientBar />
        <Text style={ct.footerLeft} fixed>Contract nr. {c.number}</Text>
        <View style={[st.header, { marginBottom: 18 }]}>
          <Brand />
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ color: BLUE, fontWeight: 700 }}>{c.number}</Text>
            <Text style={st.muted}>{formatDate(c.start_date ?? c.created_at)}</Text>
          </View>
        </View>
        <ContractText text={main} />
        <Signatures c={c} company={company} />
        {annexes.map((a, i) => (
          <View key={i}>
            <ContractText text={a} />
            <Signatures c={c} company={company} compact />
          </View>
        ))}
      </Page>
    </Document>
  );
  return addPageNumbers(await renderToBuffer(doc));
}

/** Scrie „Pagina X din Y” în colțul din dreapta-jos al fiecărei pagini. */
async function addPageNumbers(buf: Buffer): Promise<Buffer> {
  const pdf = await PDFDocument.load(buf);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  pages.forEach((page, i) => {
    const text = `Pagina ${i + 1} din ${pages.length}`;
    const size = 8;
    page.drawText(text, { x: page.getWidth() - 56 - font.widthOfTextAtSize(text, size), y: 31, size, font, color: rgb(0.48, 0.51, 0.62) });
  });
  return Buffer.from(await pdf.save());
}
