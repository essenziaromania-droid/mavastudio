-- MAVA Studio · Sincronizare cu Google Calendar
-- Rulează după 0007_google_drive.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

-- Ce eveniment din Google corespunde cărui element din CRM și ce versiune a fost trimisă ultima dată.
-- RLS activ și FĂRĂ politici: tabel intern, folosit doar de serverul aplicației.
create table if not exists public.calendar_sync (
  event_id text primary key,
  source text not null,
  hash text not null,
  updated_at timestamptz not null default now()
);
alter table public.calendar_sync enable row level security;
