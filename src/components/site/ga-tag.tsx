import { CONSENT_KEY, GA_ID } from "@/lib/consent";

/**
 * Eticheta Google (GA4) cu Consent Mode v2, inclusă direct în HTML-ul paginilor site-ului.
 * Implicit, toate tipurile de stocare sunt „denied”: Google nu salvează cookie-uri și nu identifică vizitatorul.
 * Dacă vizitatorul a ales deja „Accept toate”, măsurarea completă pornește imediat; altfel, după alegerea din banner.
 * Reclamele rămân mereu dezactivate (nu folosim publicitate Google).
 */
export function GaTag() {
  if (!GA_ID) return null;
  const init = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
var g=false;try{g=localStorage.getItem(${JSON.stringify(CONSENT_KEY)})==="all";}catch(e){}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:g?"granted":"denied"});
gtag("js",new Date());gtag("config",${JSON.stringify(GA_ID)});`;
  return (
    <>
      <script id="ga4-init" dangerouslySetInnerHTML={{ __html: init }} />
      <script id="ga4" async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
    </>
  );
}
