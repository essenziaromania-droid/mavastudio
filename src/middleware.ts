import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  LOCALE_COOKIE, LOCALE_HEADER, ROMANIAN_COUNTRIES, hasEnglishVersion, internalPath, isEnglishPath, localePath, type Locale,
} from "@/lib/i18n";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|bingpreview|lighthouse|embedly|whatsapp|telegram|preview/i;
const NOT_SITE = ["/crm", "/login", "/auth", "/api", "/oferta", "/contract"];

/** Limba preferată a vizitatorului: alegerea salvată → țara (Vercel) → limba browserului. */
function preferredLocale(req: NextRequest): Locale {
  const saved = req.cookies.get(LOCALE_COOKIE)?.value;
  if (saved === "ro" || saved === "en") return saved;
  const country = req.headers.get("x-vercel-ip-country") ?? req.geo?.country;
  if (country) return ROMANIAN_COUNTRIES.includes(country.toUpperCase()) ? "ro" : "en";
  const langs = (req.headers.get("accept-language") ?? "").toLowerCase();
  if (!langs) return "ro";
  return /(^|,)\s*ro\b/.test(langs) ? "ro" : "en";
}

function withLocale(req: NextRequest, locale: Locale, rewriteTo?: URL) {
  const headers = new Headers(req.headers);
  headers.set(LOCALE_HEADER, locale);
  return rewriteTo ? NextResponse.rewrite(rewriteTo, { request: { headers } }) : NextResponse.next({ request: { headers } });
}

/** Site-ul public: română la adresele existente, engleză sub /en. */
function siteMiddleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Butonul RO / EN: ?setlang=en|ro → salvăm alegerea și curățăm adresa.
  const setlang = req.nextUrl.searchParams.get("setlang");
  if (setlang === "ro" || setlang === "en") {
    const clean = req.nextUrl.clone();
    clean.searchParams.delete("setlang");
    const res = NextResponse.redirect(clean);
    res.cookies.set(LOCALE_COOKIE, setlang, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }

  if (isEnglishPath(path)) {
    const target = internalPath(path);
    if (!target) return withLocale(req, "en");
    const url = req.nextUrl.clone();
    url.pathname = target;
    return withLocale(req, "en", url);
  }

  // Vizitatorii din afara României sunt trimiși la versiunea în engleză (roboții de căutare nu).
  if (hasEnglishVersion(path) && !BOT.test(req.headers.get("user-agent") ?? "") && preferredLocale(req) === "en") {
    const url = req.nextUrl.clone();
    url.pathname = localePath(path, "en");
    const res = NextResponse.redirect(url);
    if (!req.cookies.get(LOCALE_COOKIE)) res.cookies.set(LOCALE_COOKIE, "en", { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    return res;
  }
  return withLocale(req, "ro");
}

/**
 * - app.mavastudio.ro/*  → /crm/*  (CRM-ul rulează pe subdomeniu, dar este aceeași aplicație)
 * - /crm/* necesită autentificare → altfel /login
 * - restul: site-ul public, în română sau engleză
 */
export async function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const url = req.nextUrl.clone();
  const isAppHost = host.startsWith("app.");

  if (!isAppHost && !NOT_SITE.some((p) => url.pathname === p || url.pathname.startsWith(p + "/"))) {
    return siteMiddleware(req);
  }

  if (isAppHost && !url.pathname.startsWith("/crm") && !url.pathname.startsWith("/login") && !url.pathname.startsWith("/auth") && !url.pathname.startsWith("/api")) {
    url.pathname = `/crm${url.pathname === "/" ? "" : url.pathname}`;
  }

  const needsAuth = url.pathname.startsWith("/crm");
  let res = url.pathname !== req.nextUrl.pathname ? NextResponse.rewrite(url) : NextResponse.next({ request: req });

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (needsAuth) {
      const login = req.nextUrl.clone();
      login.pathname = "/login";
      login.search = "?setup=1";
      return NextResponse.redirect(login);
    }
    return res;
  }

  if (!needsAuth && !url.pathname.startsWith("/login")) return res;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return req.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
        res = url.pathname !== req.nextUrl.pathname ? NextResponse.rewrite(url, { request: req }) : NextResponse.next({ request: req });
        cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (needsAuth && !user) {
    const login = req.nextUrl.clone();
    login.pathname = "/login";
    login.search = `?next=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(login);
  }

  // 2FA: dacă utilizatorul are TOTP activat dar sesiunea nu e verificată (aal2), îl trimitem la verificare.
  if (needsAuth && user) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") {
      const mfa = req.nextUrl.clone();
      mfa.pathname = "/login";
      mfa.search = "?mfa=1";
      return NextResponse.redirect(mfa);
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|images|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml)$).*)"],
};
