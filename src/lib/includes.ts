/**
 * „Ce include” un serviciu: grupuri de elemente (pagini, funcționalități, livrabile).
 *
 * În catalog se scrie ca text:
 *   ## Pagini
 *   Acasă            → inclus implicit
 *   ? Blog           → opțional (nebifat implicit)
 * În ofertă se salvează doar ce a fost bifat: [{ group: "Pagini", items: ["Acasă"] }].
 */

export type IncludeOption = { label: string; on: boolean };
export type IncludeGroup = { group: string; options: IncludeOption[] };
export type SavedIncludes = { group: string; items: string[] }[];

const DEFAULT_GROUP = "Include";

/** Textul din catalog → grupuri cu opțiuni (bifate sau nu implicit). */
export function parseIncludes(text: string | null | undefined): IncludeGroup[] {
  const groups: IncludeGroup[] = [];
  for (const raw of (text ?? "").replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    if (line.startsWith("##")) {
      groups.push({ group: line.replace(/^#+\s*/, ""), options: [] });
      continue;
    }
    if (!groups.length) groups.push({ group: DEFAULT_GROUP, options: [] });
    const optional = line.startsWith("?");
    groups[groups.length - 1]!.options.push({ label: optional ? line.slice(1).trim() : line, on: !optional });
  }
  return groups.filter((g) => g.options.length);
}

/** La editarea unei oferte: definiția din catalog + ce era deja bifat (inclusiv elementele adăugate manual). */
export function mergeIncludes(def: IncludeGroup[], saved: SavedIncludes | null | undefined): IncludeGroup[] {
  if (!saved?.length) return def.map((g) => ({ group: g.group, options: g.options.map((o) => ({ ...o })) }));
  const out: IncludeGroup[] = def.map((g) => {
    const chosen = new Set(saved.find((s) => s.group === g.group)?.items ?? []);
    const extra = (saved.find((s) => s.group === g.group)?.items ?? []).filter((i) => !g.options.some((o) => o.label === i));
    return { group: g.group, options: [...g.options.map((o) => ({ label: o.label, on: chosen.has(o.label) })), ...extra.map((label) => ({ label, on: true }))] };
  });
  for (const s of saved) if (!out.some((g) => g.group === s.group)) out.push({ group: s.group, options: s.items.map((label) => ({ label, on: true })) });
  return out;
}

/** Ce se salvează în ofertă: doar elementele bifate, fără grupuri goale. */
export function toSaved(groups: IncludeGroup[]): SavedIncludes {
  return groups.map((g) => ({ group: g.group, items: g.options.filter((o) => o.on && o.label.trim()).map((o) => o.label.trim()) })).filter((g) => g.items.length);
}

/** Normalizează valoarea venită din baza de date. */
export function asSaved(v: unknown): SavedIncludes {
  if (!Array.isArray(v)) return [];
  return v
    .filter((g) => g && typeof g.group === "string" && Array.isArray(g.items))
    .map((g) => ({ group: String(g.group), items: (g.items as unknown[]).map(String).filter(Boolean) }))
    .filter((g) => g.items.length);
}

/** Text Markdown cu specificațiile serviciilor, pentru anexa contractului. */
export function includesMarkdown(items: { name: string; includes?: unknown }[]) {
  const withSpecs = items.filter((i) => asSaved(i.includes).length);
  if (!withSpecs.length) return "";
  return withSpecs
    .map((i, n) => {
      const groups = asSaved(i.includes)
        .map((g) => `${g.group}:\n${g.items.map((x) => `- ${x}`).join("\n")}`)
        .join("\n\n");
      return `## ${n + 1}. ${i.name}\n\n${groups}`;
    })
    .join("\n\n");
}
