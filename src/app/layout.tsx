import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE, siteCopy } from "@/content/site";
import { getLocale } from "@/lib/i18n-server";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const locale = getLocale();
  const c = siteCopy(locale);
  return {
    metadataBase: new URL(SITE.url),
    title: { default: c.defaultTitle, template: "%s | MAVA Studio" },
    description: c.description,
    openGraph: { type: "website", locale: locale === "en" ? "en_US" : "ro_RO", siteName: "MAVA Studio", url: SITE.url },
    icons: { icon: "/icon.svg" },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} className={jakarta.variable} style={{ ["--font-display" as string]: "var(--font-sans)" }}>
      <body>{children}</body>
    </html>
  );
}
