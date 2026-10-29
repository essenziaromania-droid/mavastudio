import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { Tone } from "@/lib/crm/constants";

export function PageHeader({ title, sub, actions, back }: { title: React.ReactNode; sub?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {back && (
          <Link href={back.href} className="mb-1 inline-block text-xs font-semibold text-brand-blue hover:underline">
            ← {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-extrabold md:text-[28px]">{title}</h1>
        {sub && <div className="mt-1 text-sm text-body">{sub}</div>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, actions, children, className, pad = true }: { title?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string; pad?: boolean }) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white shadow-card", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          <h2 className="text-[15px] font-bold">{title}</h2>
          {actions}
        </div>
      )}
      <div className={pad ? "p-5" : ""}>{children}</div>
    </section>
  );
}

const toneCls: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  orange: "bg-amber-50 text-amber-700 ring-amber-100",
  red: "bg-rose-50 text-rose-600 ring-rose-100",
  purple: "bg-purple-50 text-purple-700 ring-purple-100",
  gray: "bg-slate-100 text-slate-600 ring-slate-200",
  cyan: "bg-cyan-50 text-cyan-700 ring-cyan-100",
  pink: "bg-pink-50 text-pink-700 ring-pink-100",
};

export function Badge({ tone = "gray", children, className }: { tone?: Tone; children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", toneCls[tone], className)}>{children}</span>;
}

export function StatusBadge({ map, value }: { map: Record<string, { label: string; tone: Tone }>; value: string | null | undefined }) {
  const o = value ? map[value] : undefined;
  return <Badge tone={o?.tone ?? "gray"}>{o?.label ?? value ?? "—"}</Badge>;
}

export function Tabs({ items, active }: { items: { href: string; label: React.ReactNode; key: string; count?: number }[]; active: string }) {
  return (
    <div className="crm-scroll mb-5 flex gap-1 overflow-x-auto border-b border-line">
      {items.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={cn(
            "relative whitespace-nowrap px-4 py-2.5 text-sm font-semibold transition",
            active === t.key ? "text-brand-blue after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:bg-brand-blue" : "text-muted hover:text-ink",
          )}
        >
          {t.label}
          {t.count !== undefined && <span className="ml-1.5 rounded-full bg-soft px-1.5 py-0.5 text-[10px] text-body">{t.count}</span>}
        </Link>
      ))}
    </div>
  );
}

export function Table({ head, children, empty }: { head: React.ReactNode[]; children: React.ReactNode; empty?: React.ReactNode }) {
  const hasRows = Array.isArray(children) ? children.flat().filter(Boolean).length > 0 : Boolean(children);
  return (
    <div className="crm-scroll overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs font-semibold text-muted">
            {head.map((h, i) => (
              <th key={i} className="whitespace-nowrap px-4 py-3">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {!hasRows && <div className="px-4 py-12 text-center text-sm text-muted">{empty ?? "Nu există înregistrări."}</div>}
    </div>
  );
}

export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-4 py-3 align-middle text-ink-2", className)}>{children}</td>;
}

export function Kpi({ label, value, delta, invert, hint, tone }: { label: string; value: string; delta?: number | null; invert?: boolean; hint?: string; tone?: "red" }) {
  const good = delta === null || delta === undefined ? null : invert ? delta <= 0 : delta >= 0;
  return (
    <div className="rounded-2xl border border-line bg-white p-4 shadow-card">
      <p className={cn("text-xs font-semibold", tone === "red" ? "text-rose-500" : "text-muted")}>{label}</p>
      <p className={cn("mt-1.5 font-display text-[22px] font-extrabold", tone === "red" ? "text-rose-500" : "text-ink")}>{value}</p>
      <div className="mt-1 flex items-center gap-1 text-xs">
        {delta !== null && delta !== undefined && (
          <span className={cn("inline-flex items-center gap-0.5 font-semibold", good ? "text-emerald-600" : "text-rose-500")}>
            {delta >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {delta > 0 ? "+" : ""}
            {delta}%
          </span>
        )}
        {hint && <span className="text-muted">{hint}</span>}
      </div>
    </div>
  );
}

export function Avatar({ name, src, size = 32 }: { name?: string | null; src?: string | null; size?: number }) {
  const palette = ["from-blue-400 to-indigo-500", "from-fuchsia-400 to-purple-500", "from-emerald-400 to-teal-500", "from-amber-400 to-orange-500", "from-rose-400 to-pink-500", "from-cyan-400 to-sky-500"];
  const idx = (name ?? "?").split("").reduce((s, c) => s + c.charCodeAt(0), 0) % palette.length;
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name ?? ""} width={size} height={size} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <span className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white", palette[idx])} style={{ width: size, height: size, fontSize: size * 0.38 }} title={name ?? undefined}>
      {initials(name)}
    </span>
  );
}

export function Empty({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
      <p className="font-bold text-ink">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm text-body">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Field({ label, children, hint, className }: { label: string; children: React.ReactNode; hint?: string; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-xs font-semibold text-ink-2">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-muted">{hint}</span>}
    </label>
  );
}

export const inputCls = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputCls, props.className)} />;
}
export function Select({ options, placeholder, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[] | Record<string, string>; placeholder?: string }) {
  const list = Array.isArray(options) ? options : Object.entries(options).map(([value, label]) => ({ value, label }));
  return (
    <select {...props} className={cn(inputCls, "pr-8", props.className)}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {list.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function optionsFrom<T extends Record<string, { label: string }>>(map: T) {
  return Object.entries(map).map(([value, o]) => ({ value, label: o.label }));
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-soft", className)}>
      <div className={cn("h-full rounded-full", v >= 100 ? "bg-emerald-500" : "bg-brand-gradient")} style={{ width: `${v}%` }} />
    </div>
  );
}

export function KeyVal({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="py-2">
      <dt className="text-xs font-semibold text-muted">{k}</dt>
      <dd className="mt-0.5 text-sm text-ink">{v || "—"}</dd>
    </div>
  );
}
