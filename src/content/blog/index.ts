// Fișier generat: lista articolelor, în ordinea publicării (vezi schedule.ts).
import { toBlogPosts } from "./schedule";
import a01 from "./posts/01-cat-costa-un-site";
import a02 from "./posts/02-de-ce-ai-nevoie-de-un-crm";
import a03 from "./posts/03-fotografie-de-produs-cu-ai";
import a04 from "./posts/04-cat-costa-administrarea-social-media";
import a05 from "./posts/05-obligatii-legale-site-romania";
import a06 from "./posts/06-seo-local-google-business-profile";
import a07 from "./posts/07-landing-page-sau-site-de-prezentare";
import a08 from "./posts/08-clipuri-scurte-reels-tiktok-shorts";
import a09 from "./posts/09-cat-costa-un-magazin-online";
import a10 from "./posts/10-strategie-social-media-afaceri-mici";
import a11 from "./posts/11-seo-pentru-afaceri-mici-ghid";
import a12 from "./posts/12-crm-gata-facut-sau-personalizat";
import a13 from "./posts/13-ce-trebuie-sa-contina-un-site-de-prezentare";
import a14 from "./posts/14-geo-cum-apari-in-chatgpt-si-google-ai";
import a15 from "./posts/15-ai-sau-sedinta-foto-clasica";
import a16 from "./posts/16-obligatii-legale-magazin-online";
import a17 from "./posts/17-calendar-editorial-social-media";
import a18 from "./posts/18-cat-costa-editarea-video";
import a19 from "./posts/19-viteza-site-ului-core-web-vitals";
import a20 from "./posts/20-automatizari-pentru-afaceri-mici";
import a21 from "./posts/21-idei-de-postari-pentru-afaceri";
import a22 from "./posts/22-domeniu-gazduire-email-profesional";
import a23 from "./posts/23-plati-online-magazin";

export const FILE_ARTICLES = [a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13, a14, a15, a16, a17, a18, a19, a20, a21, a22, a23];
export const FILE_POSTS = toBlogPosts(FILE_ARTICLES);
