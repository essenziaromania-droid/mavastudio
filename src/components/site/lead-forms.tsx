"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, ChevronDown, FileText, Layers, Loader2, Mail, Paperclip, Phone, ShieldCheck, User, Wallet } from "lucide-react";
import { budgets, deadlines, PROJECT_TYPES, projectTypeLabel } from "@/content/site";
import { localePath, type Locale } from "@/lib/i18n";
import { useLocale } from "./locale-provider";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type Status = { state: "idle" | "sending" | "ok" | "error"; message?: string };

const T = {
  ro: {
    genericError: "A apărut o eroare. Te rugăm să încerci din nou.",
    networkError: "Nu am putut trimite mesajul. Verifică conexiunea și încearcă din nou.",
    thanks: "Mulțumim! Am primit cererea ta.",
    thanksText: "Echipa MAVA Studio te va contacta în maximum 24 de ore (zile lucrătoare) cu următorii pași.",
    another: "Trimite alt mesaj",
    consent: ["Sunt de acord cu prelucrarea datelor mele pentru a fi contactat(ă) în legătură cu solicitarea, conform", "politicii de confidențialitate"],
    name: "Nume", namePh: "Numele tău complet", company: "Companie", companyPh: "Numele companiei",
    email: "Email", emailPh: "exemplu@companie.ro", phone: "Telefon", phonePh: "+40 7XX XXX XXX",
    type: "Tip proiect", typePh: "Selectează tipul proiectului", budget: "Buget estimativ", budgetPh: "Selectează bugetul estimativ",
    message: "Mesaj", messagePh: "Spune-ne mai multe despre proiectul tău...\nObiective, funcționalități, termen, orice detaliu consideri relevant.",
    send: "Trimite cererea", safe: ["Informațiile tale sunt în siguranță.", "Îți vom răspunde în maximum 24 de ore."],
    steps: ["Serviciu", "Detalii", "Contact"],
    pkg: (n: string) => `Sunt interesat(ă) de pachetul ${n}.\n\n`,
    errService: "Alege cel puțin un serviciu.",
    errDesc: "Descrie pe scurt proiectul (minimum 10 caractere).",
    errFile: "Fișierul depășește 10 MB.",
    what: "Ce dorești?", whatSub: "Poți alege mai multe servicii.",
    deadline: "Deadline", describe: "Descrie proiectul",
    describePh: "Ce vrei să construim? Obiective, public țintă, exemple care îți plac, funcționalități importante...",
    attach: "Atașează un brief", attachHint: "(opțional · PDF, DOC, imagini · max. 10 MB)",
    contactTitle: "Datele tale de contact",
    back: "Înapoi", next: "Continuă",
  },
  en: {
    genericError: "Something went wrong. Please try again.",
    networkError: "We couldn't send your message. Check your connection and try again.",
    thanks: "Thank you! We've received your request.",
    thanksText: "The MAVA Studio team will get back to you within 24 hours (business days) with the next steps.",
    another: "Send another message",
    consent: ["I agree to the processing of my data so that I can be contacted about my request, in line with the", "privacy policy"],
    name: "Name", namePh: "Your full name", company: "Company", companyPh: "Company name",
    email: "Email", emailPh: "name@company.com", phone: "Phone", phonePh: "+44 7XXX XXX XXX",
    type: "Project type", typePh: "Select the project type", budget: "Estimated budget", budgetPh: "Select your estimated budget",
    message: "Message", messagePh: "Tell us more about your project...\nGoals, features, timeline, anything you think is relevant.",
    send: "Send request", safe: ["Your information is safe.", "We'll reply within 24 hours."],
    steps: ["Service", "Details", "Contact"],
    pkg: (n: string) => `I'm interested in the ${n} package.\n\n`,
    errService: "Choose at least one service.",
    errDesc: "Briefly describe your project (at least 10 characters).",
    errFile: "The file is larger than 10 MB.",
    what: "What do you need?", whatSub: "You can choose more than one service.",
    deadline: "Timeline", describe: "Describe your project",
    describePh: "What would you like us to build? Goals, target audience, examples you like, key features...",
    attach: "Attach a brief", attachHint: "(optional · PDF, DOC, images · max. 10 MB)",
    contactTitle: "Your contact details",
    back: "Back", next: "Continue",
  },
};

function collectUtm(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"].forEach((k) => {
      const v = params.get(k) ?? sessionStorage.getItem("mava_" + k);
      if (v) {
        out[k] = v;
        sessionStorage.setItem("mava_" + k, v);
      }
    });
    const ref = sessionStorage.getItem("mava_referrer") ?? document.referrer;
    if (ref) {
      out.referrer = ref;
      sessionStorage.setItem("mava_referrer", ref);
    }
    out.page = window.location.pathname;
  } catch {
    /* ignore */
  }
  return out;
}

async function submitLead(fd: FormData, locale: Locale): Promise<Status> {
  const t = T[locale];
  fd.set("utm", JSON.stringify(collectUtm()));
  fd.set("language", locale);
  try {
    const res = await fetch("/api/leads", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { state: "error", message: json.error ?? t.genericError };
    return { state: "ok" };
  } catch {
    return { state: "error", message: t.networkError };
  }
}

function Success({ onReset }: { onReset?: () => void }) {
  const t = T[useLocale()];
  return (
    <div className="flex flex-col items-center py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500"><Check className="h-8 w-8" strokeWidth={3} /></div>
      <h3 className="mt-5 text-2xl font-extrabold">{t.thanks}</h3>
      <p className="mt-2 max-w-md text-body">{t.thanksText}</p>
      {onReset && <button onClick={onReset} className="btn-ghost mt-6">{t.another}</button>}
    </div>
  );
}

function Field({ icon: I, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="relative">
      <I className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      {children}
    </div>
  );
}

function Consent() {
  const locale = useLocale();
  const t = T[locale];
  return (
    <label className="flex items-start gap-3 text-xs leading-relaxed text-body">
      <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 rounded border-line accent-brand-blue" />
      <span>
        {t.consent[0]}{" "}
        <Link href={localePath("/politica-de-confidentialitate", locale)} className="text-brand-blue underline" target="_blank">{t.consent[1]}</Link>. *
      </span>
    </label>
  );
}

/** Câmp ascuns anti-spam (boții îl completează). */
function Honeypot() {
  return <input type="text" name="website" tabIndex={-1} autoComplete="off" className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />;
}

/* ───────────── Formular Contact ───────────── */

export function ContactForm() {
  const locale = useLocale();
  const t = T[locale];
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  if (status.state === "ok") return <Success onReset={() => setStatus({ state: "idle" })} />;

  return (
    <form
      ref={formRef}
      className="relative space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setStatus({ state: "sending" });
        const fd = new FormData(e.currentTarget);
        fd.set("form", "contact");
        setStatus(await submitLead(fd, locale));
      }}
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label">{t.name} <span className="text-rose-500">*</span></label>
          <Field icon={User}><input name="name" required maxLength={120} className="input pl-11" placeholder={t.namePh} /></Field>
        </div>
        <div>
          <label className="label">{t.company}</label>
          <Field icon={Building2}><input name="company" maxLength={160} className="input pl-11" placeholder={t.companyPh} /></Field>
        </div>
        <div>
          <label className="label">{t.email} <span className="text-rose-500">*</span></label>
          <Field icon={Mail}><input name="email" type="email" required maxLength={160} className="input pl-11" placeholder={t.emailPh} /></Field>
        </div>
        <div>
          <label className="label">{t.phone} <span className="text-rose-500">*</span></label>
          <Field icon={Phone}><input name="phone" type="tel" required maxLength={30} className="input pl-11" placeholder={t.phonePh} /></Field>
        </div>
        <div>
          <label className="label">{t.type} <span className="text-rose-500">*</span></label>
          <Field icon={Layers}>
            <select name="services" required defaultValue="" className="input appearance-none pl-11 pr-10">
              <option value="" disabled>{t.typePh}</option>
              {PROJECT_TYPES.map((x) => <option key={x.value} value={x.value}>{projectTypeLabel(x, locale)}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </Field>
        </div>
        <div>
          <label className="label">{t.budget}</label>
          <Field icon={Wallet}>
            <select name="budget" defaultValue="" className="input appearance-none pl-11 pr-10">
              <option value="">{t.budgetPh}</option>
              {budgets(locale).map((b) => <option key={b}>{b}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </Field>
        </div>
      </div>
      <div>
        <label className="label">{t.message} <span className="text-rose-500">*</span></label>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted" />
          <textarea name="message" required rows={5} maxLength={5000} className="input pl-11" placeholder={t.messagePh} />
        </div>
      </div>
      <Consent />
      {status.state === "error" && <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{status.message}</p>}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <button disabled={status.state === "sending"} className="btn-primary !px-12 !py-4 text-base">
          {status.state === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <>{t.send} <ArrowRight className="h-4 w-4" /></>}
        </button>
        <div className="flex items-center gap-3 text-xs text-muted">
          <ShieldCheck className="h-6 w-6 shrink-0" />
          <span>{t.safe[0]}<br />{t.safe[1]}</span>
        </div>
      </div>
    </form>
  );
}

/* ───────────── Formular „Începe un proiect” (în pași) ───────────── */

export function ProjectWizard({ initialService, initialPackage }: { initialService?: string; initialPackage?: string }) {
  const locale = useLocale();
  const t = T[locale];
  const STEPS = t.steps;
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<string[]>(initialService ? [initialService] : []);
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState(initialPackage ? t.pkg(`${initialPackage[0]!.toUpperCase()}${initialPackage.slice(1)}`) : "");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [error, setError] = useState("");
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (step > 0) topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  if (status.state === "ok") return <Success />;

  const toggle = (v: string) => setServices((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
  const next = () => {
    setError("");
    if (step === 0 && !services.length) return setError(t.errService);
    if (step === 1 && description.trim().length < 10) return setError(t.errDesc);
    setStep((s) => s + 1);
  };

  return (
    <div ref={topRef} className="scroll-mt-28">
      <ol className="mb-8 flex items-center gap-3">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-3">
            <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold", i <= step ? "bg-brand-gradient text-white" : "bg-soft text-muted")}>
              {i < step ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
            </span>
            <span className={cn("hidden text-sm font-semibold sm:block", i <= step ? "text-ink" : "text-muted")}>{s}</span>
            {i < STEPS.length - 1 && <span className={cn("h-px flex-1", i < step ? "bg-brand-blue" : "bg-line")} />}
          </li>
        ))}
      </ol>

      <form
        className="relative"
        onSubmit={async (e) => {
          e.preventDefault();
          if (step < 2) return next();
          setStatus({ state: "sending" });
          const fd = new FormData(e.currentTarget);
          fd.set("form", "wizard");
          fd.delete("services");
          services.forEach((s) => fd.append("services", s));
          fd.set("budget", budget);
          fd.set("deadline", deadline);
          fd.set("message", description);
          if (file) fd.set("attachment", file);
          setStatus(await submitLead(fd, locale));
        }}
      >
        <Honeypot />
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-extrabold">{t.what}</h2>
            <p className="mt-1 text-body">{t.whatSub}</p>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {PROJECT_TYPES.map((pt) => {
                const on = services.includes(pt.value);
                return (
                  <button
                    type="button"
                    key={pt.value}
                    onClick={() => toggle(pt.value)}
                    className={cn(
                      "relative flex flex-col items-center gap-3 rounded-2xl border-2 p-5 text-center transition",
                      on ? "border-brand-blue bg-blue-50/60 shadow-card-hover" : "border-line bg-white hover:border-brand-blue/40",
                    )}
                  >
                    {on && <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue text-white"><Check className="h-3 w-3" strokeWidth={3} /></span>}
                    <span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", on ? "bg-brand-gradient text-white" : "bg-soft text-brand-blue")}>
                      <Icon name={pt.icon} />
                    </span>
                    <span className="text-sm font-semibold text-ink">{projectTypeLabel(pt, locale)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-7">
            <div>
              <h2 className="text-2xl font-extrabold">{t.budget}</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {budgets(locale).map((b) => (
                  <button type="button" key={b} onClick={() => setBudget(b)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", budget === b ? "border-brand-blue bg-brand-blue text-white" : "border-line bg-white text-ink-2 hover:border-brand-blue/40")}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">{t.deadline}</h2>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {deadlines(locale).map((d) => (
                  <button type="button" key={d} onClick={() => setDeadline(d)} className={cn("rounded-full border px-4 py-2 text-sm font-medium transition", deadline === d ? "border-brand-blue bg-brand-blue text-white" : "border-line bg-white text-ink-2 hover:border-brand-blue/40")}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold">{t.describe}</h2>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} maxLength={5000} className="input mt-4" placeholder={t.describePh} />
            </div>
            <div>
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-dashed border-line p-5 transition hover:border-brand-blue/50">
                <Paperclip className="h-5 w-5 text-brand-blue" />
                <span className="text-sm text-body">{file ? <b className="text-ink">{file.name}</b> : <>{t.attach} <span className="text-muted">{t.attachHint}</span></>}</span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.zip,.ppt,.pptx,.xls,.xlsx"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    if (f && f.size > 10 * 1024 * 1024) return setError(t.errFile);
                    setFile(f);
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-extrabold">{t.contactTitle}</h2>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div><label className="label">{t.name} *</label><Field icon={User}><input name="name" required maxLength={120} className="input pl-11" placeholder={t.namePh} /></Field></div>
              <div><label className="label">{t.company}</label><Field icon={Building2}><input name="company" maxLength={160} className="input pl-11" placeholder={t.companyPh} /></Field></div>
              <div><label className="label">{t.phone} *</label><Field icon={Phone}><input name="phone" type="tel" required maxLength={30} className="input pl-11" placeholder={t.phonePh} /></Field></div>
              <div><label className="label">{t.email} *</label><Field icon={Mail}><input name="email" type="email" required maxLength={160} className="input pl-11" placeholder={t.emailPh} /></Field></div>
            </div>
            <div className="mt-6"><Consent /></div>
          </div>
        )}

        {(error || status.state === "error") && <p className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error || status.message}</p>}

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> {t.back}</button>
          ) : <span />}
          <button disabled={status.state === "sending"} className="btn-primary !px-10 !py-4">
            {status.state === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : step < 2 ? <>{t.next} <ArrowRight className="h-4 w-4" /></> : <>{t.send} <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </form>
    </div>
  );
}
