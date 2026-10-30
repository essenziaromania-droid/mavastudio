-- MAVA Studio · Integrare Google Drive
-- Rulează după 0006_social_calendar.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

-- Conexiunile cu servicii externe (cheia de acces Google). RLS activ și FĂRĂ politici:
-- nimeni din CRM nu poate citi tabelul; doar serverul aplicației (cheia service_role).
create table if not exists public.integrations (
  provider text primary key,
  account_email text,
  refresh_token text,
  data jsonb not null default '{}'::jsonb,
  connected_at timestamptz not null default now()
);
alter table public.integrations enable row level security;

-- Dosarul fiecărui client în Google Drive și subfolderele lui (01 Brief … 10 Facturi).
alter table public.clients add column if not exists drive_folder_id text;
alter table public.clients add column if not exists drive_folder_url text;
alter table public.clients add column if not exists drive_subfolders jsonb not null default '{}'::jsonb;

-- files.drive_file_id există deja (0001); adăugăm doar linkul de deschidere.
alter table public.files add column if not exists drive_url text;
