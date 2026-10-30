import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CookieBanner } from "@/components/site/cookie-banner";
import { Analytics } from "@/components/site/analytics";
import { GaTag } from "@/components/site/ga-tag";
import { LocaleProvider } from "@/components/site/locale-provider";
import { getLocale } from "@/lib/i18n-server";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();
  return (
    <LocaleProvider locale={locale}>
      <GaTag />
      <Header />
      <main>{children}</main>
      <Footer locale={locale} />
      <CookieBanner />
      <Analytics />
    </LocaleProvider>
  );
}
