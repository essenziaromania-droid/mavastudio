"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { localePath } from "@/lib/i18n";
import { useLocale } from "./locale-provider";

const KEY = "mava-cookie-consent";

const T = {
  ro: { text: "Folosim cookie-uri esențiale pentru funcționarea site-ului și, cu acordul tău, cookie-uri de analiză.", more: "Detalii", all: "Accept toate", essential: "Doar esențiale" },
  en: { text: "We use essential cookies to make this site work and, with your consent, analytics cookies.", more: "Details", all: "Accept all", essential: "Essential only" },
};

export function CookieBanner() {
  const locale = useLocale();
  const t = T[locale];
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocat */
    }
  }, []);
  if (!show) return null;
  const choose = (v: string) => {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    setShow(false);
  };
  return (
    <div className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-2xl border border-line bg-white p-4 shadow-card-hover sm:p-5">
      <p className="text-sm text-body">
        {t.text}{" "}
        <Link href={localePath("/politica-cookies", locale)} className="text-brand-blue underline">{t.more}</Link>
      </p>
      <div className="mt-3 flex gap-2">
        <button onClick={() => choose("all")} className="btn-primary btn-sm">{t.all}</button>
        <button onClick={() => choose("essential")} className="btn-ghost btn-sm">{t.essential}</button>
      </div>
    </div>
  );
}
