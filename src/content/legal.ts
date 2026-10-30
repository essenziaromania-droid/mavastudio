/**
 * Datele de identificare ale firmei, folosite DOAR în paginile legale ale site-ului
 * (obligatorii conform GDPR art. 13 și Legii nr. 365/2002 privind comerțul electronic).
 * Modifică aici și se actualizează în toate paginile legale.
 */
export const LEGAL = {
  legalName: "ESSENZIA SRL",
  tradeName: "MAVA Studio",
  cui: "RO44628032",
  /** Nr. de ordine în Registrul Comerțului (ex. J29/1234/2021). Gol = rândul nu apare. */
  regCom: "J2021001813293",
  address: "Str. Dumitru C. Brătianu nr. 2, sat Șoimești, comuna Ceptura, județul Prahova, România",
  email: "contact@mavastudio.ro",
  website: "www.mavastudio.ro",
  updated: "30.10.2026",
};

/** Blocul de identificare a firmei, în Markdown (listă). */
export function companyBlock(lang: "ro" | "en") {
  const l = LEGAL;
  return lang === "ro"
    ? [
        `- **Denumire:** ${l.legalName}, care operează sub numele comercial **${l.tradeName}**`,
        `- **Cod unic de înregistrare (CUI):** ${l.cui}`,
        l.regCom && `- **Nr. de ordine în Registrul Comerțului:** ${l.regCom}`,
        `- **Sediu social:** ${l.address}`,
        `- **Email:** ${l.email}`,
        `- **Website:** ${l.website}`,
      ]
        .filter(Boolean)
        .join("\n")
    : [
        `- **Company name:** ${l.legalName}, trading as **${l.tradeName}**`,
        `- **Tax identification number (CUI):** ${l.cui}`,
        l.regCom && `- **Trade Register number:** ${l.regCom}`,
        `- **Registered office:** ${l.address}`,
        `- **Email:** ${l.email}`,
        `- **Website:** ${l.website}`,
      ]
        .filter(Boolean)
        .join("\n");
}
