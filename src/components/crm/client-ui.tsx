"use client";
import { useFormStatus } from "react-dom";
import { useState, useTransition } from "react";
import { Check, Copy, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmitButton({ children, className, variant = "primary", pendingText }: { children: React.ReactNode; className?: string; variant?: "primary" | "ghost" | "outline" | "danger"; pendingText?: string }) {
  const { pending } = useFormStatus();
  const cls = variant === "primary" ? "btn-primary" : variant === "outline" ? "btn-outline" : variant === "danger" ? "btn border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100" : "btn-ghost";
  return (
    <button type="submit" disabled={pending} className={cn(cls, "!py-2.5", className)}>
      {pending ? <><Loader2 className="h-4 w-4 animate-spin" /> {pendingText ?? "Se salvează..."}</> : children}
    </button>
  );
}

/** Buton care cere confirmare înainte de a trimite formularul părinte. */
export function ConfirmSubmit({ children, message = "Sigur vrei să continui?", className }: { children: React.ReactNode; message?: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={className ?? "btn btn-sm border border-rose-200 bg-white text-rose-600 hover:bg-rose-50"}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </button>
  );
}

export function CopyButton({ text, label = "Copiază linkul" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="btn-ghost btn-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 1800);
        } catch {
          prompt("Copiază linkul:", text);
        }
      }}
    >
      {done ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />} {done ? "Copiat" : label}
    </button>
  );
}

/** Select care trimite automat formularul la schimbare (ex. schimbare status). */
export function AutoSubmitSelect({ name, defaultValue, options, className, action, hidden }: { name: string; defaultValue: string; options: { value: string; label: string }[]; className?: string; action: (fd: FormData) => Promise<void>; hidden?: Record<string, string> }) {
  const [pending, start] = useTransition();
  return (
    <div className="relative inline-flex items-center gap-2">
      <select
        name={name}
        defaultValue={defaultValue}
        disabled={pending}
        className={cn("rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-brand-blue", className)}
        onChange={(e) => {
          const fd = new FormData();
          fd.set(name, e.target.value);
          Object.entries(hidden ?? {}).forEach(([k, v]) => fd.set(k, v));
          start(() => action(fd));
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted" />}
    </div>
  );
}
