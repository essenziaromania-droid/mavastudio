-- MAVA Studio · „Ce include” fiecare serviciu (pagini, funcționalități, livrabile)
-- Rulează după 0003_signatures.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.
--
-- Format (editabil din CRM → Setări → Catalog servicii):
--   ## Grup            → titlul unui grup (ex. Pagini, Funcționalități)
--   Element            → inclus implicit (bifat în ofertă)
--   ? Element          → opțional (apare nebifat; îl bifezi doar dacă îl oferi)

alter table public.services_catalog add column if not exists includes text;
-- Ce s-a ales efectiv în ofertă: [{ "group": "Pagini", "items": ["Acasă", "Contact"] }]
alter table public.offer_items add column if not exists includes jsonb not null default '[]'::jsonb;

update public.services_catalog set includes = $$## Pagini
Acasă
Despre noi
Servicii
Contact
? Portofoliu / Proiecte
? Blog
? Întrebări frecvente
## Funcționalități
Formular de contact cu notificare pe email
Hartă și date de contact
Link-uri către rețelele sociale
? Buton WhatsApp
? Programări online
? Versiune în limba engleză
## Design
Design personalizat, în identitatea vizuală a brandului
Adaptare pentru telefon și tabletă
## SEO și performanță
SEO tehnic de bază (titluri, descrieri, sitemap)
Optimizarea vitezei de încărcare
Certificat SSL (https)
Integrare Google Analytics
## Conformitate
Pagini de confidențialitate, cookies și termeni
Banner de consimțământ cookies
## Livrare
Instruire pentru administrarea conținutului
30 de zile de suport după lansare$$
where name = 'Website de prezentare' and includes is null;

update public.services_catalog set includes = $$## Pagini
Acasă
Despre noi
Servicii (până la 6 pagini de serviciu)
Portofoliu / Studii de caz
Blog
Contact
? Echipa
? Cariere
? Întrebări frecvente
## Funcționalități
Blog administrabil, cu categorii
Formulare de contact și de cerere ofertă
Integrare newsletter
Link-uri către rețelele sociale
? Buton WhatsApp
? Programări online
? Versiune în limba engleză
? Integrare CRM
## Design
Design personalizat, în identitatea vizuală a brandului
Adaptare pentru telefon și tabletă
Animații și micro-interacțiuni
## SEO și performanță
SEO on-page pentru toate paginile
Google Search Console și Google Analytics 4
Date structurate (Schema.org)
Optimizarea vitezei de încărcare
Certificat SSL (https)
## Conformitate
Pagini de confidențialitate, cookies și termeni
Banner de consimțământ cookies
## Livrare
Instruire pentru administrarea conținutului
30 de zile de suport după lansare$$
where name = 'Website Business' and includes is null;

update public.services_catalog set includes = $$## Secțiuni
Hero cu mesaj principal și buton de acțiune
Beneficii
Cum funcționează
Testimoniale
Întrebări frecvente
Formular / apel final la acțiune
? Prețuri și pachete
? Video de prezentare
## Funcționalități
Formular de lead-uri cu notificare pe email
Integrare Meta Pixel și Google Ads
? Conectare la CRM
? Variantă pentru test A/B
## Design și performanță
Design personalizat, orientat spre conversie
Adaptare pentru telefon și tabletă
Încărcare rapidă
## Livrare
Copywriting pe structura agreată
14 zile de suport după lansare$$
where name = 'Landing page' and includes is null;

update public.services_catalog set includes = $$## Pagini
Acasă
Catalog de produse, cu filtre și căutare
Pagină de produs
Coș de cumpărături
Checkout
Cont de client
Despre noi și Contact
Pagini legale (termeni, retur, ANPC, GDPR)
? Blog
## Funcționalități
Plăți cu cardul online
Integrare curierat și generare AWB
Facturare automată
Cupoane și reduceri
Emailuri automate pentru comenzi
Panou de administrare comenzi și stocuri
? Feed Google Shopping și Facebook
? Recenzii de produs
? Produse cu variante (mărime, culoare)
? Versiune în limba engleză
## Produse
Import inițial (până la 100 de produse)
? Import extins (peste 100 de produse)
## SEO și performanță
SEO tehnic pentru categorii și produse
Google Analytics 4 cu urmărire comenzi
Optimizarea vitezei de încărcare
Certificat SSL (https)
## Livrare
Comandă de test completă înainte de lansare
Instruire pentru administrarea magazinului
30 de zile de suport după lansare$$
where name = 'Magazin online' and includes is null;

update public.services_catalog set includes = $$## Module
Autentificare (email și parolă, resetare parolă)
Dashboard cu statistici
Gestionarea utilizatorilor și a rolurilor
Abonamente și plăți online (Stripe)
Panou de administrare
? Autentificare cu Google
? Notificări pe email
? API pentru integrări externe
? Aplicație instalabilă pe telefon (PWA)
? Versiune în limba engleză
## Tehnic
Bază de date și arhitectură scalabilă
Mediu de test și mediu de producție
Copii de siguranță automate
Cod sursă predat într-un depozit Git
## Design
Interfață personalizată (UI/UX)
Adaptare pentru telefon și tabletă
## Livrare
Documentație tehnică și de utilizare
30 de zile de suport după lansare$$
where name = 'Platformă SaaS – MVP' and includes is null;

update public.services_catalog set includes = $$## Module
Lead-uri și surse de proveniență
Clienți și istoric interacțiuni
Oferte cu PDF și link online
Proiecte și task-uri
Rapoarte
? Contracte cu semnare electronică
? Facturare și încasări
? Fișiere și documente
? Calendar
? Portal pentru clienți
## Integrări
Formularele de pe website
? SmartBill / Oblio / FGO
? Email
? WhatsApp
? Google Calendar
## Automatizări
Notificări și task-uri automate
Remindere pentru follow-up
## Livrare
Configurare pe procesele firmei
? Migrarea datelor existente
Instruire online (2 ore)
30 de zile de suport după lansare$$
where name = 'CRM personalizat' and includes is null;

update public.services_catalog set includes = $$## Livrabile
10 imagini finale, în rezoluție înaltă
Format pătrat (1:1) și vertical (4:5)
## Tipuri de imagini
Fundal alb / neutru, pentru magazin online
Imagini lifestyle, în context de utilizare
? Bannere pentru website
? Formate pentru reclame (Meta, Google)
## Revizii
2 runde de revizii$$
where name = 'Fotografie produse AI (10 imagini)' and includes is null;

update public.services_catalog set includes = $$## Livrabile
Clip video de 15–30 de secunde
Format vertical (9:16)
? Format orizontal (16:9)
? Format pătrat (1:1)
## Conținut
Muzică licențiată
Text pe ecran și apel la acțiune
? Voce off generată cu AI
? Subtitrări
## Revizii
2 runde de revizii$$
where name = 'Video produs AI' and includes is null;

update public.services_catalog set includes = $$## Montaj
Montaj dinamic, adaptat platformei
Subtitrări animate
Muzică licențiată
Corecție de culoare
Format vertical (9:16)
? Motion graphics
? Copertă / thumbnail
? Versiune 1:1 sau 16:9
## Revizii
2 runde de revizii$$
where name = 'Editare Reels / TikTok' and includes is null;

update public.services_catalog set includes = $$## Platforme
Facebook
Instagram
? TikTok
? LinkedIn
## Conținut lunar
12 postări (foto / carusel)
4 Reels
Copywriting și hashtag-uri
? Stories (8 / lună)
? Ședință foto / video lunară
## Administrare
Strategie și calendar editorial lunar
Programarea postărilor
? Moderarea comunității (zile lucrătoare)
? Administrarea campaniilor plătite
## Raportare
Raport lunar cu rezultate și recomandări$$
where name = 'Administrare social media' and includes is null;

update public.services_catalog set includes = $$## Audit și optimizare
Audit tehnic SEO complet
Optimizarea vitezei de încărcare
Titluri și descrieri meta
Sitemap și robots.txt
Date structurate (Schema.org)
Google Search Console
? Cercetare de cuvinte cheie
? 3 articole optimizate SEO
## Raportare
Raport cu modificările făcute și recomandări$$
where name = 'SEO tehnic' and includes is null;

update public.services_catalog set includes = $$## Inclus lunar
Actualizarea platformei, temelor și modulelor
Backup săptămânal
Monitorizarea disponibilității și securității
Reînnoirea certificatului SSL
2 ore de modificări pe lună
Răspuns în cel mult 2 zile lucrătoare
? Raport lunar
? Găzduire administrată$$
where name = 'Mentenanță & suport' and includes is null;
