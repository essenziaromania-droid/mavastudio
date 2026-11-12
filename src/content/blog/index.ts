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

export const FILE_ARTICLES = [a01, a02, a03, a04, a05, a06, a07, a08, a09, a10, a11, a12, a13, a14, a15];
export const FILE_POSTS = toBlogPosts(FILE_ARTICLES);
