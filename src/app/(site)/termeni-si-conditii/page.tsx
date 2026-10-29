import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { getLocale, pageMeta } from "@/lib/i18n-server";

const RO = `
Prin utilizarea site-ului **mavastudio.ro** ești de acord cu termenii de mai jos.

## Conținutul site-ului

Textele, elementele grafice, logo-ul și materialele prezentate aparțin MAVA Studio sau sunt folosite cu acordul titularilor. Nu pot fi copiate sau folosite în scop comercial fără acordul nostru scris.

## Informații și oferte

Informațiile de pe site au caracter general. Prețurile, termenele și condițiile exacte ale unei colaborări sunt stabilite doar prin oferta și contractul transmise individual.

## Proiectele din portofoliu

Proiectele prezentate sunt folosite cu acordul clienților. Rezultatele obținute într-un proiect nu garantează rezultate identice în alte proiecte.

## Limitarea răspunderii

Depunem toate eforturile ca site-ul să funcționeze corect și să conțină informații actuale, însă nu putem garanta lipsa totală a erorilor sau disponibilitatea neîntreruptă.

## Contact

Pentru întrebări legate de acești termeni, scrie-ne la **contact@mavastudio.ro**.
`;

const EN = `
By using **mavastudio.ro** you agree to the terms below.

## Website content

The text, graphics, logo and materials on this site belong to MAVA Studio or are used with the owners' permission. They may not be copied or used commercially without our written consent.

## Information and proposals

The information on this site is general in nature. Exact prices, timelines and terms of a collaboration are set only through the proposal and contract sent to you individually.

## Portfolio projects

The projects shown are used with our clients' permission. Results achieved in one project do not guarantee identical results in other projects.

## Limitation of liability

We make every effort to keep the site working correctly and up to date, but we cannot guarantee that it is completely free of errors or always available.

## Governing law

These terms are governed by Romanian law.

## Contact

For questions about these terms, write to us at **contact@mavastudio.ro**.
`;

const T = { ro: { title: "Termeni și condiții", body: RO }, en: { title: "Terms and conditions", body: EN } };

export function generateMetadata(): Metadata {
  const locale = getLocale();
  return pageMeta("/termeni-si-conditii", locale, { title: T[locale].title });
}

export default function Page() {
  const locale = getLocale();
  return <LegalPage title={T[locale].title} updated="28.10.2026" body={T[locale].body} locale={locale} />;
}
