// Fișier generat: lista articolelor, în ordinea publicării (vezi schedule.ts).
import { toBlogPosts } from "./schedule";
import a01 from "./posts/01-cat-costa-un-site";
import a02 from "./posts/02-de-ce-ai-nevoie-de-un-crm";

export const FILE_ARTICLES = [a01, a02];
export const FILE_POSTS = toBlogPosts(FILE_ARTICLES);
