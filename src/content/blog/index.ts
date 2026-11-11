// Fișier generat: lista articolelor, în ordinea publicării (vezi schedule.ts).
import { toBlogPosts } from "./schedule";
import a01 from "./posts/01-cat-costa-un-site";
import a02 from "./posts/02-de-ce-ai-nevoie-de-un-crm";
import a03 from "./posts/03-fotografie-de-produs-cu-ai";
import a04 from "./posts/04-cat-costa-administrarea-social-media";
import a05 from "./posts/05-obligatii-legale-site-romania";
import a06 from "./posts/06-seo-local-google-business-profile";
import a07 from "./posts/07-landing-page-sau-site-de-prezentare";

export const FILE_ARTICLES = [a01, a02, a03, a04, a05, a06, a07];
export const FILE_POSTS = toBlogPosts(FILE_ARTICLES);
