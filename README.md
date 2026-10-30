# MAVA Studio – site public + CRM

O singură aplicație Next.js 14 (TypeScript, Tailwind, Supabase):

| Zonă | Adresă | Ce conține |
|---|---|---|
| Site public | `www.mavastudio.ro` | Acasă, Servicii (+6 pagini), Proiecte (studii de caz), Despre noi, Contact, Începe un proiect, Blog, pagini legale |
| CRM / admin | `www.mavastudio.ro/crm` | Dashboard, Lead-uri, Clienți, Oferte, Contracte, Proiecte, Task-uri, Calendar, Financiar, Fișiere, Angajați, Rapoarte, **Website** (blog, portofoliu, setări site), Setări |
| Pentru clienți | `/oferta/{token}`, `/contract/{token}` | Ofertă online (Acceptă / Solicită modificări), semnare electronică contract |

## Pornire – pas cu pas

### 1. Supabase
1. Creează un proiect pe [supabase.com](https://supabase.com) (regiunea Frankfurt).
2. **SQL Editor** → lipește tot conținutul din `supabase/migrations/0001_init.sql` → **Run**. Apoi, pe rând, `supabase/migrations/0002_i18n.sql` (versiunea în engleză) `0003_signatures.sql` (semnături desenate pe contracte) `0004_service_includes.sql` (ce include fiecare serviciu) și `0005_client_portal.sql` (portalul clienților).
3. **Authentication → URL Configuration**: Site URL = `https://www.mavastudio.ro`; la Redirect URLs adaugă `https://www.mavastudio.ro/auth/callback` și `http://localhost:3000/auth/callback`.
4. **Authentication → Providers → Email**: dezactivează „Allow new users to sign up” după ce îți creezi contul (angajații se adaugă doar prin invitație din CRM).
5. **Authentication → Users → Add user**: creează-ți contul. **Primul utilizator devine automat Administrator.**

### 2. Email (Resend)
Creează cont pe [resend.com](https://resend.com), adaugă domeniul `mavastudio.ro` (înregistrările DNS indicate) și generează un API key. Opțional, setează Resend și ca SMTP în Supabase (Authentication → SMTP) ca invitațiile să plece tot de pe domeniul tău.

### 3. Variabile de mediu
Copiază `.env.example` în `.env.local` și completează valorile.

### 4. Local
```bash
npm install
npm run dev        # http://localhost:3000  ·  CRM: http://localhost:3000/crm
```

### 5. Publicare (Vercel)
1. Urcă proiectul pe GitHub și importă-l în Vercel.
2. Adaugă aceleași variabile de mediu în Vercel.
3. Adaugă domeniile `www.mavastudio.ro` și `mavastudio.ro` (redirect către www). CRM-ul este la `www.mavastudio.ro/crm`.

## Conținut
- **Logo** (oficial): `public/logo.svg` (siglă + text), `public/logo-mark.svg` (doar sigla), `public/icon.svg` (favicon), `public/logo-mark.png` (folosit în PDF-uri). Componenta: `src/components/ui/logo.tsx`.
- **Fotografii echipă** (opțional): `public/images/echipa.jpg` și `public/images/echipa/{strateg,designer,developer,video-editor,social-media}.jpg` – apar automat pe pagina Despre noi.
- **Portofoliu și blog**: din CRM → Website. Până publici primul proiect/articol, site-ul afișează conținutul demonstrativ din `src/content/demo.ts`.
- **Statistici** (50+, 98% …): ascunse implicit; se activează din CRM → Website → Contact, statistici & social, doar când cifrele sunt reale.
- Datele firmei (CUI, IBAN etc.) se completează în CRM → Setări și apar **doar** pe oferte, contracte și facturi, nu pe site.

## Site în română și engleză
- Vizitatorii din afara României (și Moldovei) văd automat site-ul în engleză, la adrese de tip `/en/services`, `/en/projects`. Țara vine de la Vercel (`x-vercel-ip-country`); local sau fără țară se folosește limba browserului.
- Butonul **RO / EN** din meniu schimbă limba și o ține minte 1 an (cookie `mava_lang`). Google nu e redirecționat și primește link-uri hreflang între cele două variante.
- Textele paginilor sunt în cod (`T = { ro, en }` în fiecare pagină; serviciile în `src/content/services.ts` și `services.en.ts`).
- **Blog și portofoliu**: fiecare editor din CRM → Website are o secțiune 🇬🇧 English. Articolele apar în engleză doar dacă au titlu și conținut în engleză; la proiecte, câmpurile goale se afișează în română.
- Lead-urile trimise de pe site-ul în engleză sunt marcate în CRM („Client internațional”) și primesc răspunsul automat în engleză. Bugetele sunt afișate în euro.
- Ofertele și contractele trimise clienților rămân în română.

## Fluxul automat
Formular site → **Lead** (cu UTM, IP, consimțământ GDPR) → email admin + auto-răspuns + task → **Ofertă** (generator, PDF, link online) → client acceptă → **Contract** generat automat → semnare online → **Proiect** din șablon + task-uri + tranșe 50/30/20 + **factură de avans** (draft) → emitere în SmartBill/Oblio/FGO → plată înregistrată → notificare PM. Automatizările se pornesc/opresc din Setări → Automatizări.

## Ce urmează (fazele următoare)
Google Drive (foldere automate), Google Calendar, portal client (`client.mavastudio.ro`) cu aprobări și feedback video pe timecode, modul calendar Social Media, mesaje centralizate (email/WhatsApp), constructor vizual de automatizări, sincronizare automată a plăților din programul de facturare, semnătură electronică calificată.
