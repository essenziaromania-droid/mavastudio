export type Tone = "blue" | "green" | "orange" | "red" | "purple" | "gray" | "cyan" | "pink";

type Opt = { label: string; tone: Tone };
const m = <T extends string>(o: Record<T, Opt>) => o;

export const LEAD_STATUS = m({
  nou: { label: "Nou", tone: "blue" },
  contactat: { label: "Contactat", tone: "cyan" },
  calificat: { label: "Calificat", tone: "purple" },
  oferta: { label: "Ofertă", tone: "orange" },
  negociere: { label: "Negociere", tone: "pink" },
  castigat: { label: "Câștigat", tone: "green" },
  pierdut: { label: "Pierdut", tone: "red" },
});

export const LEAD_SOURCE: Record<string, string> = {
  site: "Site",
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  google_ads: "Google Ads",
  linkedin: "LinkedIn",
  recomandare: "Recomandare",
  manual: "Manual",
  email: "Email",
  altul: "Altul",
};

export const CLIENT_STATUS = m({
  lead: { label: "Lead nou", tone: "blue" },
  prospect: { label: "Prospect", tone: "orange" },
  activ: { label: "Client activ", tone: "green" },
  inactiv: { label: "Inactiv", tone: "gray" },
});

export const OFFER_STATUS = m({
  draft: { label: "Draft", tone: "gray" },
  trimisa: { label: "Trimisă", tone: "blue" },
  vizualizata: { label: "Vizualizată", tone: "cyan" },
  acceptata: { label: "Acceptată", tone: "green" },
  modificari: { label: "Modificări cerute", tone: "orange" },
  respinsa: { label: "Respinsă", tone: "red" },
  expirata: { label: "Expirată", tone: "gray" },
});

export const CONTRACT_STATUS = m({
  draft: { label: "Draft", tone: "gray" },
  trimis: { label: "Trimis", tone: "blue" },
  vizualizat: { label: "Vizualizat", tone: "cyan" },
  semnat: { label: "Semnat", tone: "green" },
  expirat: { label: "Expirat", tone: "orange" },
  anulat: { label: "Anulat", tone: "red" },
});

export const PROJECT_STATUS = m({
  de_inceput: { label: "De început", tone: "gray" },
  in_lucru: { label: "În lucru", tone: "blue" },
  review: { label: "Review", tone: "orange" },
  finalizat: { label: "Finalizat", tone: "green" },
  anulat: { label: "Anulat", tone: "red" },
});

export const TASK_STATUS = m({
  de_facut: { label: "De făcut", tone: "red" },
  in_lucru: { label: "În lucru", tone: "blue" },
  review: { label: "În review", tone: "orange" },
  finalizat: { label: "Finalizat", tone: "green" },
});

export const PRIORITY = m({
  scazuta: { label: "Scăzută", tone: "gray" },
  medie: { label: "Medie", tone: "blue" },
  ridicata: { label: "Ridicată", tone: "orange" },
  urgenta: { label: "Urgentă", tone: "red" },
});

export const INVOICE_STATUS = m({
  draft: { label: "Draft", tone: "gray" },
  emisa: { label: "Emisă", tone: "blue" },
  trimisa: { label: "Trimisă", tone: "cyan" },
  platita: { label: "Plătită", tone: "green" },
  partial: { label: "Parțial plătită", tone: "orange" },
  restanta: { label: "Restantă", tone: "red" },
  anulata: { label: "Anulată", tone: "gray" },
});

export const EXPENSE_CATEGORY: Record<string, string> = {
  software: "Software",
  freelanceri: "Freelanceri",
  reclama: "Reclamă",
  hosting: "Hosting",
  abonamente: "Abonamente",
  salarii: "Salarii",
  echipamente: "Echipamente",
  altele: "Altele",
};

export const EVENT_TYPE = m({
  intalnire: { label: "Întâlnire", tone: "blue" },
  deadline: { label: "Deadline", tone: "red" },
  lansare: { label: "Lansare", tone: "green" },
  review: { label: "Review", tone: "orange" },
  prezentare: { label: "Prezentare", tone: "purple" },
  altul: { label: "Altul", tone: "gray" },
});

/** Categorii de servicii (pentru oferte, proiecte, venituri pe servicii). */
export const SERVICE_CATEGORY: Record<string, { label: string; color: string }> = {
  website: { label: "Website-uri", color: "#2B4CF5" },
  ecommerce: { label: "Magazine online", color: "#00B4FF" },
  saas: { label: "SaaS", color: "#7C3AED" },
  crm: { label: "CRM", color: "#10B981" },
  ai: { label: "Foto & Video AI", color: "#E040C8" },
  video: { label: "Editare video", color: "#F43F5E" },
  social: { label: "Social Media", color: "#F59E0B" },
  mentenanta: { label: "Mentenanță", color: "#0E7490" },
  altele: { label: "Alte servicii", color: "#94A3B8" },
};

export const ROLES: Record<string, string> = {
  admin: "Administrator",
  project_manager: "Project Manager",
  developer: "Developer",
  designer: "Designer",
  video_editor: "Video Editor",
  social_media: "Social Media Manager",
  financiar: "Financiar",
};

export const MODULES: { key: string; label: string; hint?: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "leads", label: "Lead-uri" },
  { key: "clienti", label: "Clienți" },
  { key: "oferte", label: "Oferte" },
  { key: "contracte", label: "Contracte" },
  { key: "proiecte", label: "Proiecte (atribuite)" },
  { key: "proiecte_toate", label: "Proiecte (toate) & management", hint: "creare, editare, toate proiectele" },
  { key: "taskuri", label: "Task-uri (creare)" },
  { key: "calendar", label: "Calendar" },
  { key: "financiar", label: "Financiar", hint: "facturi, plăți, cheltuieli" },
  { key: "fisiere", label: "Fișiere" },
  { key: "angajati", label: "Angajați" },
  { key: "rapoarte", label: "Rapoarte" },
  { key: "social", label: "Social media (calendar postări)" },
  { key: "website", label: "Website (blog, portofoliu)" },
  { key: "setari", label: "Setări" },
];

export const DRIVE_FOLDERS = ["01 Brief", "02 Contract", "03 Assets", "04 Design", "05 Foto", "06 Video", "07 Development", "08 Social Media", "09 Livrabile", "10 Facturi"];

export const PORTFOLIO_CATEGORIES: Record<string, string> = {
  website: "Website",
  saas: "SaaS",
  crm: "CRM",
  ai: "AI Content",
  social: "Social Media",
  video: "Video",
};


/* ───────── Social media ───────── */

export const SOCIAL_STATUS = m({
  idee: { label: "Idee", tone: "gray" },
  in_lucru: { label: "În lucru", tone: "blue" },
  de_aprobat: { label: "La client", tone: "purple" },
  modificari: { label: "Modificări", tone: "orange" },
  aprobat: { label: "Aprobat", tone: "green" },
  programat: { label: "Programat", tone: "cyan" },
  publicat: { label: "Publicat", tone: "green" },
});

export const SOCIAL_PLATFORMS: Record<string, string> = { facebook: "Facebook", instagram: "Instagram", tiktok: "TikTok", linkedin: "LinkedIn", youtube: "YouTube" };
export const SOCIAL_FORMATS: Record<string, string> = { postare: "Postare", carusel: "Carusel", reel: "Reel", story: "Story", video: "Video" };
