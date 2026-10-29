/**
 * Șablonul de contract MAVA Studio.
 *
 * Structură:
 *  - CONTRACT_BODY: contractul-cadru, valabil pentru orice serviciu.
 *  - CONTRACT_ANNEXES: condiții specifice pe tip de serviciu. Se adaugă automat doar pentru
 *    categoriile de servicii prezente în ofertă.
 *  - CONTRACT_DPA: acordul de prelucrare a datelor (GDPR art. 28), adăugat doar pentru serviciile
 *    în care Prestatorul prelucrează date personale în numele Beneficiarului.
 *
 * Toate textele pot fi modificate din CRM → Setări → Contract (setarea „contract_template”).
 * Câmpurile lăsate goale acolo folosesc textele de mai jos.
 *
 * Variabile: {{numar}} {{data}} {{prestator}} {{beneficiar}} {{reprezentant}} {{oferta}} {{servicii}}
 * {{valoare}} {{tva}} {{plata}} {{termen}} {{cont_bancar}} {{email_prestator}} {{email_beneficiar}} {{anexe}}
 * Blocuri condiționale: {{#abonament}}…{{/abonament}} (există servicii lunare) și {{#proiect}}…{{/proiect}}
 * (există servicii cu plată unică).
 */

export type ContractTemplate = {
  body?: string;
  dpa?: string;
  annexes?: Partial<Record<AnnexKey, string>>;
};

export const ANNEX_KEYS = ["website", "ecommerce", "saas", "crm", "ai", "video", "social", "mentenanta"] as const;
export type AnnexKey = (typeof ANNEX_KEYS)[number];

export const ANNEX_LABELS: Record<AnnexKey, string> = {
  website: "Dezvoltare website",
  ecommerce: "Magazin online",
  saas: "Platformă SaaS / aplicație web",
  crm: "CRM și automatizări",
  ai: "Foto și video de produs cu AI",
  video: "Editare video",
  social: "Administrare social media",
  mentenanta: "Mentenanță și suport",
};

/** Serviciile la care Prestatorul prelucrează, de regulă, date personale în numele Beneficiarului. */
export const DPA_CATEGORIES: AnnexKey[] = ["website", "ecommerce", "saas", "crm", "social", "mentenanta"];

export const CONTRACT_VARIABLES: [string, string][] = [
  ["{{numar}}", "numărul contractului"],
  ["{{data}}", "data contractului"],
  ["{{prestator}}", "datele firmei tale (din Setări → Firmă)"],
  ["{{beneficiar}}", "datele clientului"],
  ["{{reprezentant}}", "„, reprezentată prin …” (persoana de contact a clientului)"],
  ["{{oferta}}", "numărul ofertei acceptate"],
  ["{{servicii}}", "lista serviciilor din ofertă"],
  ["{{valoare}}", "valoarea totală, cu TVA"],
  ["{{tva}}", "cota TVA"],
  ["{{plata}}", "modalitatea de plată din ofertă"],
  ["{{termen}}", "termenul de livrare din ofertă"],
  ["{{cont_bancar}}", "IBAN și banca"],
  ["{{email_prestator}}", "emailul firmei"],
  ["{{email_beneficiar}}", "emailul clientului"],
  ["{{anexe}}", "lista anexelor incluse automat"],
  ["{{#abonament}} … {{/abonament}}", "text afișat doar dacă oferta are servicii lunare"],
  ["{{#proiect}} … {{/proiect}}", "text afișat doar dacă oferta are servicii cu plată unică"],
];

/* ───────────────────────── Contractul-cadru ───────────────────────── */

export const CONTRACT_BODY = `# Contract de prestări servicii nr. {{numar}}

Încheiat astăzi, {{data}}, între:

1. {{prestator}}, în calitate de **Prestator**, și
2. {{beneficiar}}{{reprezentant}}, în calitate de **Beneficiar**,

denumite împreună „Părțile” și individual „Partea”.

## Art. 1. Definiții

În prezentul contract, termenii de mai jos au următorul înțeles:

- **Servicii** – serviciile descrise la Art. 2 și în anexele contractului;
- **Livrabile** – rezultatele concrete ale Serviciilor predate Beneficiarului (website, aplicație, fișiere grafice, materiale video, conținut, documentație etc.);
- **Materialele Beneficiarului** – texte, imagini, logo-uri, filmări, date, accesuri și orice alte informații puse la dispoziție de Beneficiar;
- **Etapă** – o parte distinctă a proiectului, cu livrabile proprii, conform ofertei;
- **Recepție** – acceptarea unui Livrabil de către Beneficiar, conform Art. 9;
- **Cerere de modificare** – orice solicitare a Beneficiarului care depășește obiectul contractului sau modifică cerințe deja aprobate;
- **Zile lucrătoare** – zilele de luni până vineri, cu excepția sărbătorilor legale din România.

## Art. 2. Obiectul contractului

**2.1.** Prestatorul se obligă să presteze pentru Beneficiar următoarele Servicii:

{{servicii}}

**2.2.** Detaliile tehnice și condițiile specifice fiecărui serviciu sunt prevăzute în anexele contractului, care fac parte integrantă din acesta: {{anexe}}.

**2.3.** Oferta nr. {{oferta}}, acceptată de Beneficiar, face parte integrantă din contract. În caz de neconcordanță, prevalează contractul, apoi anexele, apoi oferta.

**2.4.** Orice serviciu care nu este menționat expres în contract, în anexe sau în ofertă nu este inclus și poate fi ofertat separat.

## Art. 3. Durata contractului

**3.1.** Contractul intră în vigoare la data semnării de către ambele Părți.

{{#proiect}}**3.2.** Pentru serviciile cu plată unică, contractul este valabil până la îndeplinirea integrală a obligațiilor Părților, inclusiv a perioadei de garanție prevăzute la Art. 10.

{{/proiect}}{{#abonament}}**3.3.** Pentru serviciile lunare (abonament), contractul se încheie pentru o perioadă minimă de 3 (trei) luni și se prelungește automat cu câte o lună, dacă niciuna dintre Părți nu îl denunță conform Art. 16.4.

{{/abonament}}## Art. 4. Prețul și condițiile de plată

**4.1.** Valoarea totală a contractului este de **{{valoare}}**, TVA {{tva}} inclus, conform ofertei.

{{#abonament}}**4.2.** Pentru serviciile lunare, valoarea indicată în ofertă este lunară. Facturarea se face la începutul fiecărei luni de servicii, pentru luna în curs.

{{/abonament}}**4.3.** Modalitatea de plată: {{plata}}.

**4.4.** Plata se face prin transfer bancar, în termen de 5 (cinci) zile lucrătoare de la emiterea facturii{{cont_bancar}}. Data plății este data la care suma intră în contul Prestatorului.

**4.5.** Prețul nu include, dacă nu este prevăzut expres în ofertă: domenii, găzduire, servere și servicii cloud, licențe software și teme, abonamente la platforme terțe, imagini, fonturi sau muzică din biblioteci cu plată, comisioane ale procesatorilor de plăți și bugetele de promovare plătită. Aceste costuri sunt suportate de Beneficiar, de regulă direct către furnizori, iar conturile se deschid pe numele Beneficiarului.

**4.6.** Pentru întârzierea la plată, Beneficiarul datorează penalități de 0,1% pe zi de întârziere din suma neachitată, fără ca totalul penalităților să depășească suma restantă.

**4.7.** Dacă o factură nu este achitată în termen de 10 (zece) zile lucrătoare de la scadență, Prestatorul poate suspenda prestarea Serviciilor, după o notificare prealabilă transmisă pe email. Termenele de realizare se prelungesc corespunzător perioadei de suspendare.

**4.8.** Sumele încasate pentru Servicii deja prestate sau pentru Etapa în curs de desfășurare nu se restituie.

## Art. 5. Termene de realizare

**5.1.** Termenul de realizare: {{termen}}.

**5.2.** Termenele încep să curgă de la data la care sunt îndeplinite cumulativ următoarele condiții: contractul este semnat, avansul (dacă este prevăzut) este încasat, iar Prestatorul a primit Materialele Beneficiarului necesare începerii lucrului.

**5.3.** Termenele se prelungesc automat cu perioada în care Beneficiarul întârzie furnizarea materialelor, a accesurilor, a feedback-ului sau a plăților, precum și cu durata Cererilor de modificare aprobate.

**5.4.** Prestatorul va informa Beneficiarul, în cel mai scurt timp, despre orice situație care ar putea afecta termenele convenite.

## Art. 6. Obligațiile Prestatorului

Prestatorul se obligă:

- să presteze Serviciile cu profesionalism, conform bunelor practici din domeniu, ofertei și anexelor;
- să desemneze o persoană de contact și să informeze periodic Beneficiarul despre stadiul proiectului;
- să respecte termenele convenite, în condițiile Art. 5;
- să nu folosească Materialele Beneficiarului în alte scopuri decât executarea contractului;
- să predea Livrabilele și accesurile prevăzute în contract, după îndeplinirea condițiilor de plată;
- să păstreze confidențialitatea informațiilor primite, conform Art. 12.

## Art. 7. Obligațiile Beneficiarului

Beneficiarul se obligă:

- să furnizeze la timp Materialele Beneficiarului, complete și corecte, precum și accesurile necesare;
- să garanteze că deține drepturile necesare asupra Materialelor Beneficiarului (texte, imagini, logo-uri, mărci, filmări, date) și că utilizarea lor de către Prestator nu încalcă drepturile unor terți;
- să desemneze o persoană de contact cu drept de decizie pentru aprobări;
- să transmită feedback și aprobări în termen de 5 (cinci) zile lucrătoare de la fiecare livrare, într-un singur set de observații consolidate;
- să achite la termen contravaloarea Serviciilor și costurile prevăzute la Art. 4.5;
- să verifice și să își asume conținutul publicat (texte, prețuri, informații despre produse, mențiuni legale).

## Art. 8. Revizii și Cereri de modificare

**8.1.** Pentru fiecare Livrabil sunt incluse două runde de revizii, dacă oferta sau anexele nu prevăd altfel. O rundă de revizii reprezintă un set unic și consolidat de observații.

**8.2.** Reviziile se referă la ajustări ale Livrabilului în limitele cerințelor aprobate. Schimbarea cerințelor, a structurii sau a direcției vizuale deja aprobate, precum și funcționalitățile noi constituie Cereri de modificare.

**8.3.** Cererile de modificare se estimează separat, ca preț și termen, și se execută doar după aprobarea scrisă a Beneficiarului, inclusiv prin email.

## Art. 9. Livrare și recepție

**9.1.** Prestatorul notifică Beneficiarul, prin email sau prin platforma de proiect, la finalizarea fiecărui Livrabil sau a fiecărei Etape.

**9.2.** Beneficiarul are la dispoziție 5 (cinci) zile lucrătoare pentru verificare. În acest termen, poate accepta Livrabilul sau poate transmite în scris neconformitățile constatate față de cerințele aprobate.

**9.3.** Livrabilul se consideră acceptat dacă Beneficiarul nu transmite observații în termenul de la Art. 9.2 sau dacă începe să îl utilizeze în mod curent (de exemplu, publică website-ul, folosește aplicația sau distribuie materialele).

**9.4.** Neconformitățile minore, care nu împiedică utilizarea Livrabilului, nu pot justifica refuzul recepției sau amânarea plăților. Acestea se remediază în cadrul garanției.

## Art. 10. Garanție

**10.1.** Pentru Livrabilele de tip software (website-uri, magazine online, aplicații, CRM), Prestatorul remediază gratuit, timp de 30 (treizeci) de zile de la recepție, defectele de funcționare cauzate de activitatea sa.

**10.2.** Garanția nu acoperă: modificări făcute de Beneficiar sau de terți; actualizări ale platformelor, serviciilor sau API-urilor terțe, ale browserelor sau ale sistemelor de operare apărute după recepție; problemele de găzduire neadministrată de Prestator; utilizarea necorespunzătoare; funcționalități noi.

**10.3.** După expirarea garanției, intervențiile se fac în baza unui contract de mentenanță sau se ofertează separat.

## Art. 11. Drepturi de proprietate intelectuală

**11.1.** Sub condiția plății integrale a prețului, Prestatorul cesionează Beneficiarului, în mod exclusiv, drepturile patrimoniale de autor asupra Livrabilelor finale create special pentru Beneficiar, conform Legii nr. 8/1996 privind dreptul de autor și drepturile conexe. Cesiunea cuprinde dreptul de reproducere, distribuire, adaptare, traducere, comunicare publică și punere la dispoziția publicului, inclusiv online, pe orice suport. Cesiunea este valabilă pe teritoriul întregii lumi, pe durata maximă de protecție prevăzută de lege. Prețul cesiunii este inclus în valoarea contractului.

**11.2.** Până la plata integrală, drepturile rămân la Prestator, iar Beneficiarul are doar un drept de utilizare provizoriu, în scopul verificării Livrabilelor.

**11.3.** Nu fac obiectul cesiunii și rămân în proprietatea Prestatorului sau a titularilor lor:

- componentele preexistente ale Prestatorului (cod, biblioteci, module, șabloane și instrumente proprii, dezvoltate independent de acest contract). Pentru acestea, Beneficiarul primește o licență neexclusivă, perpetuă și gratuită, limitată la utilizarea în cadrul Livrabilelor;
- componentele open-source și componentele terților (teme, pluginuri, fonturi, imagini, muzică, servicii cloud), care rămân supuse licențelor proprii;
- fișierele de lucru și materialele intermediare (fișiere sursă de design, proiecte de editare video, filmări brute, variante nealese), care se predau doar dacă oferta prevede expres acest lucru.

**11.4.** Pentru conținutul generat cu ajutorul instrumentelor de inteligență artificială, Prestatorul transmite Beneficiarului toate drepturile pe care le deține asupra acestuia. Beneficiarul ia la cunoștință că, potrivit legislației aplicabile, un astfel de conținut poate să nu beneficieze integral de protecție prin drept de autor.

**11.5.** Beneficiarul păstrează toate drepturile asupra Materialelor Beneficiarului.

**11.6.** Prestatorul poate menționa numele Beneficiarului și poate prezenta Livrabilele publice în portofoliul și materialele sale de prezentare, cu excepția cazului în care Beneficiarul se opune în scris. Datele confidențiale nu vor fi prezentate în niciun caz.

## Art. 12. Confidențialitate

**12.1.** Părțile se obligă să păstreze confidențialitatea informațiilor primite în legătură cu contractul (informații comerciale, tehnice, financiare, date de acces, strategii) și să nu le divulge terților fără acordul scris al celeilalte Părți.

**12.2.** Nu sunt confidențiale informațiile care sunt publice, care erau deja cunoscute de Partea care le primește sau care trebuie dezvăluite în baza legii ori la cererea unei autorități.

**12.3.** Obligația de confidențialitate se aplică pe durata contractului și 3 (trei) ani după încetarea acestuia. Pentru datele de acces (parole, chei API), obligația este nelimitată în timp.

## Art. 13. Protecția datelor cu caracter personal

**13.1.** Fiecare Parte prelucrează datele personale ale reprezentanților și persoanelor de contact ale celeilalte Părți în calitate de operator, exclusiv pentru încheierea și executarea contractului, cu respectarea Regulamentului (UE) 2016/679 (GDPR).

**13.2.** În măsura în care, pentru executarea Serviciilor, Prestatorul prelucrează date personale în numele Beneficiarului (de exemplu, date ale clienților sau vizitatorilor acestuia), Beneficiarul are calitatea de operator, iar Prestatorul pe cea de persoană împuternicită. Această prelucrare este reglementată prin Anexa privind prelucrarea datelor, atunci când este inclusă în contract.

**13.3.** Beneficiarul răspunde de legalitatea datelor pe care le colectează și le pune la dispoziția Prestatorului, precum și de informarea persoanelor vizate (politica de confidențialitate, politica de cookies, consimțăminte).

## Art. 14. Răspundere

**14.1.** Partea care nu își execută obligațiile sau le execută necorespunzător răspunde pentru prejudiciul direct și dovedit cauzat celeilalte Părți.

**14.2.** Răspunderea totală a Prestatorului în legătură cu contractul este limitată la valoarea sumelor efectiv încasate de acesta în baza contractului în ultimele 12 luni. Prestatorul nu răspunde pentru prejudicii indirecte, precum beneficiul nerealizat, pierderea de date care nu au fost salvate de Beneficiar, pierderea de clienți sau de reputație. Limitările nu se aplică în caz de intenție sau culpă gravă.

**14.3.** Prestatorul se obligă să depună toate diligențele pentru atingerea obiectivelor Beneficiarului, dar nu garantează rezultate comerciale precum vânzări, număr de clienți, poziții în motoarele de căutare, reach sau număr de urmăritori. Acestea depind și de factori care nu se află sub controlul său.

**14.4.** Prestatorul nu răspunde pentru întreruperi, modificări sau restricții ale serviciilor terților (găzduire, platforme sociale, procesatori de plăți, API-uri, magazine de aplicații), nici pentru conținutul furnizat sau aprobat de Beneficiar.

## Art. 15. Forța majoră

**15.1.** Forța majoră, astfel cum este definită de art. 1351 din Codul civil, exonerează de răspundere Partea care o invocă, pe durata acesteia.

**15.2.** Partea care invocă forța majoră o notifică celeilalte Părți în termen de 5 (cinci) zile lucrătoare de la apariție și ia toate măsurile pentru limitarea efectelor.

**15.3.** Dacă forța majoră durează mai mult de 30 (treizeci) de zile, oricare Parte poate denunța contractul printr-o notificare scrisă, fără daune-interese. Serviciile prestate până la acea dată se plătesc.

## Art. 16. Încetarea contractului

**16.1.** Contractul încetează prin îndeplinirea obligațiilor, prin acordul Părților, prin reziliere sau prin denunțare unilaterală, în condițiile de mai jos.

**16.2.** Dacă una dintre Părți nu își execută obligațiile esențiale și nu remediază situația în 15 (cincisprezece) zile de la primirea unei notificări scrise, cealaltă Parte poate rezilia contractul printr-o nouă notificare, fără intervenția instanței.

**16.3.** Beneficiarul poate denunța unilateral contractul cu un preaviz de 15 (cincisprezece) zile. În acest caz, Beneficiarul achită Serviciile prestate până la data încetării, inclusiv Etapa aflată în desfășurare, iar avansul nu se restituie.

{{#abonament}}**16.4.** Serviciile lunare pot fi denunțate de oricare Parte, după perioada minimă de la Art. 3.3, cu un preaviz scris de 30 (treizeci) de zile. Luna în curs se facturează integral.

{{/abonament}}**16.5.** La încetarea contractului, Prestatorul predă Livrabilele finalizate și achitate, iar Părțile își restituie accesurile și informațiile confidențiale.

## Art. 17. Colaboratori și subcontractare

Prestatorul poate colabora cu specialiști sau subcontractanți pentru executarea Serviciilor, cu respectarea obligațiilor de confidențialitate și de protecție a datelor. Prestatorul rămâne răspunzător față de Beneficiar pentru activitatea acestora.

## Art. 18. Comunicări

**18.1.** Comunicările dintre Părți se fac în scris, prin email, la adresele {{email_prestator}} (Prestator) și {{email_beneficiar}} (Beneficiar), sau la alte adrese comunicate ulterior.

**18.2.** Aprobările, feedback-ul și Cererile de modificare transmise prin email sau prin platforma de proiect a Prestatorului sunt valabile între Părți.

## Art. 19. Legea aplicabilă și litigii

**19.1.** Contractul este guvernat de legea română.

**19.2.** Părțile vor încerca să soluționeze amiabil orice neînțelegere, în termen de 30 (treizeci) de zile de la notificarea acesteia. În caz contrar, litigiul va fi soluționat de instanțele competente de la sediul Prestatorului.

## Art. 20. Dispoziții finale

**20.1.** Contractul, împreună cu anexele și oferta, reprezintă acordul integral al Părților și înlocuiește orice înțelegere anterioară privind același obiect.

**20.2.** Modificarea contractului se face prin act adițional semnat de ambele Părți, inclusiv în formă electronică.

**20.3.** Dacă o clauză este declarată nulă, celelalte clauze rămân valabile, iar Părțile vor înlocui clauza nulă cu una valabilă, cât mai apropiată de intenția inițială.

**20.4.** Contractul poate fi semnat electronic. Părțile convin ca semnătura electronică aplicată prin platforma Prestatorului, împreună cu datele de identificare înregistrate la semnare (nume, dată, oră, adresă IP), să aibă între ele aceeași valoare ca semnătura olografă, conform Regulamentului (UE) nr. 910/2014 (eIDAS) și Legii nr. 455/2001.

**20.5.** Contractul a fost încheiat astăzi, {{data}}, în format electronic, câte un exemplar fiind disponibil fiecărei Părți.
`;

/* ───────────────────────── Anexe pe tip de serviciu ───────────────────────── */

export const CONTRACT_ANNEXES: Record<AnnexKey, string> = {
  website: `### Condiții specifice – Dezvoltare website

**1. Conținutul livrat.** Website-ul se realizează conform structurii (paginile și secțiunile) din ofertă și celei aprobate în etapa de planificare. Paginile sau funcționalitățile suplimentare constituie Cereri de modificare.

**2. Compatibilitate.** Website-ul va funcționa corect în ultimele două versiuni stabile ale browserelor Chrome, Safari, Firefox și Edge, pe desktop, tabletă și telefon. Versiunile mai vechi sau browserele mai puțin folosite nu sunt incluse.

**3. Conținut.** Textele, imaginile, logo-ul și celelalte materiale sunt furnizate de Beneficiar. Dacă oferta include copywriting sau imagini, Beneficiarul aprobă conținutul înainte de publicare. Imaginile stoc se folosesc conform licențelor lor.

**4. SEO.** Sunt incluse optimizările tehnice de bază: structură, viteză, meta-date, sitemap, date structurate și adaptarea pentru mobil. Prestatorul nu garantează poziții în Google sau un anumit volum de trafic.

**5. Domeniu și găzduire.** Domeniul și găzduirea se înregistrează pe numele și în contul Beneficiarului. Dacă Prestatorul le administrează temporar, acestea se transferă Beneficiarului la cerere, după plata integrală.

**6. Mențiuni legale.** Prestatorul poate integra modele de politică de confidențialitate, politică de cookies și termeni și condiții. Conținutul juridic al acestor documente și conformitatea lor cu activitatea Beneficiarului rămân în responsabilitatea Beneficiarului.

**7. Predare.** După plata integrală, Prestatorul predă accesurile de administrare și, la cerere, o copie a fișierelor website-ului și a bazei de date.

**8. Mentenanța** (actualizări, backup, monitorizare, modificări de conținut) nu este inclusă după perioada de garanție și se contractează separat.`,

  ecommerce: `### Condiții specifice – Magazin online

Pe lângă condițiile pentru dezvoltarea de website, se aplică următoarele:

**1. Produse.** Beneficiarul furnizează lista de produse, cu denumiri, descrieri, prețuri, variante, stocuri și imagini, într-un format agreat (de regulă un fișier Excel/CSV). Importul inițial este inclus în limita numărului de produse din ofertă. Încărcarea manuală sau prelucrarea conținutului peste această limită se ofertează separat.

**2. Integrări.** Integrarea cu procesatorul de plăți, firmele de curierat și programul de facturare se face pe conturile Beneficiarului. Contractele cu acești furnizori, comisioanele și aprobarea conturilor sunt în responsabilitatea Beneficiarului.

**3. Obligații legale ale comerciantului.** Beneficiarul este vânzătorul și răspunde de respectarea legislației privind comerțul online și protecția consumatorilor (inclusiv OUG nr. 34/2014): informațiile obligatorii despre firmă, prețuri, livrare și retur, dreptul de retragere, link-urile ANPC/SAL/SOL, facturarea și declarațiile fiscale.

**4. Testare.** Înainte de lansare, Părțile efectuează împreună cel puțin o comandă de test completă (plată, email, factură, AWB). Lansarea se face după confirmarea Beneficiarului.

**5. Securitatea plăților.** Datele cardurilor sunt procesate exclusiv de procesatorul de plăți și nu sunt stocate pe website.`,

  saas: `### Condiții specifice – Platformă SaaS / aplicație web

**1. Specificații.** Funcționalitățile se stabilesc în ofertă și în documentul de cerințe (specificații funcționale) aprobat de Beneficiar la începutul proiectului. Ce nu se regăsește în aceste documente constituie Cerere de modificare.

**2. Dezvoltare pe etape.** Platforma se dezvoltă iterativ. Fiecare etapă se livrează pe un mediu de test, unde Beneficiarul o verifică și o recepționează conform Art. 9 din contract.

**3. Infrastructură.** Serverele, bazele de date, serviciile cloud, domeniile și serviciile terțe (email, plăți, stocare) se deschid pe numele Beneficiarului, care suportă costurile acestora. Dacă Prestatorul le administrează temporar, acestea se transferă la cerere.

**4. Cod sursă.** După plata integrală, Prestatorul predă codul sursă într-un depozit Git aflat în proprietatea Beneficiarului, împreună cu instrucțiunile de instalare. Componentele preexistente și open-source se predau conform Art. 11 din contract.

**5. Securitate.** Prestatorul aplică bunele practici de securitate (autentificare, criptarea conexiunilor, controlul accesului, protecția datelor). Niciun sistem informatic nu poate fi garantat ca fiind lipsit complet de vulnerabilități. Testele de penetrare și auditurile de securitate realizate de terți nu sunt incluse.

**6. Funcționare și suport.** Garanția se aplică conform Art. 10. Disponibilitatea garantată (SLA), monitorizarea permanentă, actualizările și dezvoltarea ulterioară se contractează separat, printr-un abonament de mentenanță.

**7. Date.** Beneficiarul este operatorul datelor introduse în platformă de utilizatorii săi. Prestatorul le prelucrează doar conform Anexei privind prelucrarea datelor.`,

  crm: `### Condiții specifice – CRM și automatizări

**1. Analiză.** Proiectul începe cu analiza proceselor Beneficiarului (vânzări, ofertare, proiecte, facturare). Configurarea se face conform fluxurilor aprobate în urma acestei analize.

**2. Migrarea datelor.** Dacă oferta include migrarea datelor existente, Beneficiarul le furnizează într-un format structurat (Excel/CSV sau export din sistemul vechi). Curățarea datelor incomplete sau duplicate nu este inclusă, dacă nu este prevăzută în ofertă.

**3. Integrări.** Integrările cu servicii terțe (de exemplu programe de facturare, email, calendar, WhatsApp) folosesc API-urile publice ale acestora și conturile Beneficiarului. Prestatorul nu răspunde pentru limitările, costurile sau modificările ulterioare ale acestor API-uri. Adaptarea la astfel de modificări după perioada de garanție se face în cadrul mentenanței.

**4. Instruire.** Este inclusă o sesiune online de instruire a utilizatorilor, de până la 2 ore, și documentația de utilizare de bază.

**5. Accesuri.** Beneficiarul administrează conturile utilizatorilor săi și răspunde de păstrarea în siguranță a parolelor și de dezactivarea accesului persoanelor care nu mai lucrează pentru el.

**6. Date.** Beneficiarul este operatorul datelor din CRM. Prestatorul le prelucrează doar conform Anexei privind prelucrarea datelor.`,

  ai: `### Condiții specifice – Foto și video de produs cu AI

**1. Materiale de pornire.** Beneficiarul furnizează fotografii clare ale produselor, din unghiurile solicitate, și indicații de stil (brand book, exemple, culori). Calitatea rezultatelor depinde de calitatea acestor materiale.

**2. Livrabile.** Numărul de imagini și clipuri, formatele și rezoluțiile sunt cele din ofertă. Pentru fiecare livrabil sunt incluse două runde de revizii. Variantele intermediare nealese nu se predau.

**3. Natura conținutului.** Materialele sunt create cu instrumente de inteligență artificială și pot conține fundaluri, decoruri și persoane generate, care nu reprezintă persoane reale. Prestatorul nu folosește mărci, logo-uri sau persoane reale ale terților fără acordul acestora.

**4. Fidelitatea produsului.** Beneficiarul verifică și aprobă că produsul este reprezentat corect (formă, culoare, ambalaj, etichetă) și că materialele nu induc consumatorii în eroare cu privire la caracteristicile produsului. Răspunderea pentru afirmațiile comerciale asociate materialelor revine Beneficiarului.

**5. Drepturi.** Drepturile asupra materialelor se transmit conform Art. 11.4 din contract. Utilizarea materialelor se face cu respectarea termenilor platformelor pe care sunt publicate.`,

  video: `### Condiții specifice – Editare video

**1. Materiale.** Beneficiarul furnizează filmările, fotografiile, logo-urile și celelalte resurse necesare, la o calitate potrivită pentru publicare. Beneficiarul garantează că are drepturile asupra acestora și acordul persoanelor care apar în filmări.

**2. Livrabile.** Numărul de clipuri, durata, formatele (de exemplu 9:16, 1:1, 16:9) și elementele incluse (subtitrări, motion graphics, color correction) sunt cele din ofertă.

**3. Revizii.** Pentru fiecare clip sunt incluse două runde de revizii. Schimbarea conceptului, a scenariului sau a materialelor după începerea montajului constituie Cerere de modificare.

**4. Muzică și elemente grafice.** Muzica și elementele stoc provin din biblioteci licențiate. Licența acoperă utilizarea în clipul livrat, pe canalele Beneficiarului. Folosirea muzicii separat de clip sau în reclame TV/radio poate necesita licențe suplimentare.

**5. Fișiere predate.** Se predau fișierele video finale, exportate. Proiectul de editare și filmările brute prelucrate nu se predau, dacă oferta nu prevede altfel.

**6. Păstrarea materialelor.** Prestatorul păstrează materialele proiectului timp de 90 de zile de la livrare. După această perioadă, ele pot fi șterse.`,

  social: `### Condiții specifice – Administrare social media

**1. Platforme și volum.** Platformele administrate și numărul lunar de postări, Reels și stories sunt cele din ofertă. Postările nefolosite într-o lună nu se reportează.

**2. Calendar editorial.** Prestatorul propune lunar calendarul editorial, cu cel puțin 5 zile lucrătoare înainte de începutul lunii. Beneficiarul îl aprobă sau transmite observații în 3 zile lucrătoare. Conținutul nu se publică fără aprobare. Lipsa unui răspuns poate duce la amânarea publicărilor, fără ca aceasta să reducă prețul lunar.

**3. Conturi.** Paginile și conturile de social media rămân în proprietatea Beneficiarului. Beneficiarul acordă Prestatorului acces prin roluri de administrator/editor, fără a-i transmite parola personală, și poate retrage accesul oricând.

**4. Promovare plătită.** Bugetul de promovare se plătește direct de Beneficiar către platforme, cu cardul acestuia, și nu este inclus în prețul serviciilor. Administrarea campaniilor este inclusă doar dacă este prevăzută în ofertă.

**5. Comunitate.** Dacă oferta include moderarea comunității, aceasta se face în zilele lucrătoare, între orele 9:00 și 18:00. Situațiile de criză, reclamațiile și întrebările legate de comenzi sau de aspecte juridice se transmit Beneficiarului, care stabilește răspunsul.

**6. Conținut și responsabilitate.** Beneficiarul confirmă corectitudinea informațiilor despre produse, prețuri, promoții și concursuri. Regulamentele concursurilor și respectarea regulilor platformelor pentru acestea sunt în responsabilitatea Beneficiarului.

**7. Platforme terțe.** Prestatorul nu răspunde pentru modificările de algoritm, scăderile de reach, restricțiile sau blocările impuse de platforme, în afara situațiilor cauzate de încălcarea de către el a regulilor acestora.

**8. Raportare.** Prestatorul transmite lunar un raport cu principalii indicatori și recomandări pentru luna următoare.`,

  mentenanta: `### Condiții specifice – Mentenanță și suport

**1. Ce include.** Abonamentul lunar de mentenanță include, conform ofertei: actualizarea platformei, temelor și modulelor, backup periodic, monitorizarea disponibilității și securității, precum și numărul de ore lunare de modificări prevăzut în ofertă.

**2. Ore de modificări.** Orele de modificări nefolosite nu se reportează în luna următoare. Lucrările care depășesc orele incluse se facturează la tariful orar din ofertă, după acordul Beneficiarului.

**3. Timp de răspuns.** Solicitările se transmit prin email sau prin platforma de proiect. Prestatorul confirmă primirea și începe analiza în cel mult 2 zile lucrătoare. Pentru incidentele critice (website sau aplicație nefuncțională), timpul de răspuns este de cel mult 8 ore lucrătoare.

**4. Nu sunt incluse.** Funcționalitățile noi, redesign-ul, modificările majore de structură, costurile de găzduire și licențe, precum și remedierea problemelor cauzate de intervențiile terților sau de atacurile informatice care nu se datorează culpei Prestatorului.

**5. Backup.** Prestatorul păstrează copiile de siguranță conform ofertei. Beneficiarul poate solicita oricând o copie completă a datelor sale.`,
};

/* ───────────────────────── Anexa GDPR (art. 28) ───────────────────────── */

export const CONTRACT_DPA = `### Acord privind prelucrarea datelor cu caracter personal (art. 28 GDPR)

**1. Obiect.** Prezenta anexă reglementează prelucrarea datelor cu caracter personal de către Prestator (persoana împuternicită), în numele Beneficiarului (operatorul), în scopul executării Serviciilor.

**2. Datele prelucrate.** Categoriile de persoane vizate pot include vizitatorii, clienții, potențialii clienți, utilizatorii și angajații Beneficiarului. Categoriile de date pot include date de identificare și contact, date despre comenzi, conținutul mesajelor transmise prin formulare și date tehnice (adresa IP, date de utilizare). Prestatorul nu prelucrează categorii speciale de date decât cu acordul scris al Beneficiarului.

**3. Durata.** Prelucrarea are loc pe durata contractului și, după încetarea acestuia, doar cât este necesar pentru returnarea sau ștergerea datelor.

**4. Obligațiile Prestatorului.** Prestatorul se obligă:

- să prelucreze datele numai pe baza instrucțiunilor documentate ale Beneficiarului, inclusiv cele din contract;
- să asigure confidențialitatea datelor și să le acorde acces doar persoanelor care au nevoie de ele și care s-au angajat să le păstreze confidențialitatea;
- să aplice măsuri tehnice și organizatorice adecvate de securitate, conform art. 32 GDPR (controlul accesului, conexiuni criptate, copii de siguranță, actualizări de securitate);
- să ajute Beneficiarul, în măsura posibilului, să răspundă cererilor persoanelor vizate și să își îndeplinească obligațiile privind securitatea, notificarea încălcărilor și evaluările de impact;
- să notifice Beneficiarul fără întârzieri nejustificate, în cel mult 48 de ore de la constatare, despre orice încălcare a securității datelor;
- la încetarea Serviciilor, să returneze sau să șteargă datele, la alegerea Beneficiarului, cu excepția cazului în care legea impune păstrarea lor;
- să pună la dispoziția Beneficiarului informațiile necesare pentru a demonstra respectarea acestor obligații.

**5. Sub-împuterniciți.** Beneficiarul autorizează în general Prestatorul să folosească furnizori de servicii necesari executării contractului (găzduire, servicii cloud, email, stocare). Prestatorul informează Beneficiarul, la cerere, despre lista acestora și despre orice înlocuire, iar Beneficiarul se poate opune pentru motive întemeiate. Prestatorul impune sub-împuterniciților aceleași obligații de protecție a datelor.

**6. Transferuri.** Dacă datele sunt transferate în afara Spațiului Economic European, transferul se face doar cu garanțiile prevăzute de GDPR (de exemplu, decizii de adecvare sau clauze contractuale standard).

**7. Responsabilitatea operatorului.** Beneficiarul răspunde de existența unui temei legal pentru prelucrare, de informarea persoanelor vizate și de legalitatea instrucțiunilor transmise Prestatorului.`;
