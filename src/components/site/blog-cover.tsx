import { cn } from "@/lib/utils";

/**
 * Coperta unui articol fără poză: titlul scris pe gradientul MAVA (albastru → mov).
 * Aceeași compoziție e folosită și pentru imaginea de distribuire (src/app/og/[slug]/route.tsx).
 */
export function BlogCover({
  title,
  category,
  size = "card",
  className,
}: {
  title: string;
  category?: string | null;
  size?: "card" | "feature" | "hero";
  className?: string;
}) {
  const text =
    size === "hero" ? "text-2xl sm:text-4xl md:text-[2.6rem]" : size === "feature" ? "text-xl sm:text-2xl md:text-[1.75rem]" : "text-lg sm:text-xl";
  const pad = size === "hero" ? "p-6 sm:p-10 md:p-14" : size === "feature" ? "p-6 sm:p-9" : "p-5 sm:p-6";
  return (
    <div
      role="img"
      aria-label={title}
      className={cn("relative flex h-full w-full flex-col justify-between overflow-hidden text-white", pad, className)}
      style={{ background: "linear-gradient(135deg, #2B4CF5 0%, #5B3CF2 50%, #B23CF0 100%)" }}
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-to-br from-cyan-300/60 to-fuchsia-300/40 blur-[2px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-12 h-64 w-64 rounded-full bg-gradient-to-tr from-sky-300/30 to-transparent" />
      <div className="relative flex items-center justify-between gap-3">
        {category ? (
          <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white ring-1 ring-white/25 sm:text-xs">{category}</span>
        ) : <span />}
        <span className="font-display text-sm font-extrabold tracking-wide text-white/90">MAVA</span>
      </div>
      <p className={cn("relative mt-4 font-display font-extrabold leading-[1.15] [text-wrap:balance]", text, size === "card" && "line-clamp-4")}>{title}</p>
      <div className="relative mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-white/80" />
    </div>
  );
}
