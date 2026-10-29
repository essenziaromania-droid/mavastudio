import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: false });

/** Conținutul vine doar din admin (utilizatori autentificați), dar eliminăm totuși scripturile și handler-ele inline. */
export function renderMarkdown(md: string) {
  const html = marked.parse(md ?? "", { async: false }) as string;
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/javascript:/gi, "");
}

export function readingTime(md: string) {
  return Math.max(1, Math.round((md ?? "").split(/\s+/).length / 200));
}
