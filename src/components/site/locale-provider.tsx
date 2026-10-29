"use client";
import { createContext, useContext } from "react";
import { localePath, type Locale } from "@/lib/i18n";

const Ctx = createContext<Locale>("ro");

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <Ctx.Provider value={locale}>{children}</Ctx.Provider>;
}

export function useLocale() {
  return useContext(Ctx);
}

/** Funcție care transformă o adresă românească în adresa pentru limba curentă. */
export function useLocalePath() {
  const locale = useLocale();
  return (path: string) => localePath(path, locale);
}
