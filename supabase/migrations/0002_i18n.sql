-- MAVA Studio · versiunea în engleză a site-ului
-- Rulează după 0001_init.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

-- Limba în care a fost trimis formularul (ro / en). Răspunsul automat pleacă în aceeași limbă.
alter table public.leads add column if not exists language text not null default 'ro';
do $$ begin
  alter table public.leads add constraint leads_language_check check (language in ('ro','en'));
exception when duplicate_object then null; end $$;

-- Traducerile în engleză pentru articole și proiecte, completate din CRM → Website.
-- Format: { "en": { "title": "...", "excerpt": "...", "content": "...", ... } }
alter table public.blog_posts add column if not exists translations jsonb not null default '{}'::jsonb;
alter table public.portfolio_projects add column if not exists translations jsonb not null default '{}'::jsonb;
