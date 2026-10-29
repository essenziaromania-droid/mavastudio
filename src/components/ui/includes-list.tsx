import { Check } from "lucide-react";
import { asSaved } from "@/lib/includes";
import { cn } from "@/lib/utils";

/** Afișează „Ce include” un serviciu din ofertă, grupat (Pagini, Funcționalități…). */
export function IncludesList({ value, className }: { value: unknown; className?: string }) {
  const groups = asSaved(value);
  if (!groups.length) return null;
  return (
    <div className={cn("mt-2 grid gap-x-6 gap-y-2 sm:grid-cols-2", className)}>
      {groups.map((g) => (
        <div key={g.group}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{g.group}</p>
          <ul className="mt-1 space-y-0.5">
            {g.items.map((x) => (
              <li key={x} className="flex items-start gap-1.5 text-xs text-body">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" strokeWidth={3} />
                {x}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
