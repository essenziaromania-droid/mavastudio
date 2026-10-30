/** Secunde → „m:ss” (pentru comentariile pe video). */
export function formatTimecode(t: number | null | undefined) {
  if (t == null) return "";
  const s = Math.max(0, Math.floor(Number(t)));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
