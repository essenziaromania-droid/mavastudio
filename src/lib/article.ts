import { renderMarkdown } from "@/lib/markdown";
import { localePath, type Locale } from "@/lib/i18n";

export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const stripTags = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();

/**
 * Pregătește un articol pentru afișare:
 *  - id pe fiecare titlu H2 (pentru cuprins și linkuri directe);
 *  - linkurile externe se deschid în tab nou, cu rel="noopener";
 *  - cuprinsul (H2) și întrebările frecvente (pentru datele structurate FAQPage).
 */
export function prepareArticle(md: string, locale: Locale = "ro", siteHost = "mavastudio.ro") {
  let html = renderMarkdown(md);
  // Linkurile interne se scriu cu adresa românească; în engleză le trimitem la pagina /en/... echivalentă.
  if (locale === "en") html = html.replace(/<a href="(\/[^"]*)"/g, (_m, href: string) => `<a href="${localePath(href, "en")}"`);
  const toc: { id: string; title: string }[] = [];
  const used = new Set<string>();

  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_m, inner: string) => {
    const title = stripTags(inner);
    let id = slugify(title) || "sectiune";
    while (used.has(id)) id += "-2";
    used.add(id);
    toc.push({ id, title });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href: string) =>
    href.includes(siteHost) ? m : `<a href="${href}" target="_blank" rel="noopener"`,
  );

  // Întrebările frecvente: H3 + paragrafele de după, până la următorul titlu.
  const faq: { q: string; a: string }[] = [];
  const faqStart = html.search(/<h2 id="[^"]*">(?:Întrebări frecvente|Intrebari frecvente|Frequently asked questions|FAQ)<\/h2>/i);
  if (faqStart >= 0) {
    const rest = html.slice(faqStart).replace(/^<h2[^>]*>[\s\S]*?<\/h2>/, "");
    const end = rest.search(/<h2[ >]/);
    const block = end >= 0 ? rest.slice(0, end) : rest;
    const re = /<h3>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3>|$)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(block))) {
      const q = stripTags(m[1]!);
      const a = stripTags(m[2]!).replace(/\s+/g, " ");
      if (q && a) faq.push({ q, a });
    }
  }

  return { html, toc, faq };
}

export function wordCount(md: string) {
  return (md ?? "").replace(/[#*>\-\[\]()|]/g, " ").split(/\s+/).filter(Boolean).length;
}
