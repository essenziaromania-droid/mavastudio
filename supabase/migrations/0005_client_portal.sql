-- MAVA Studio · Portalul clienților
-- Rulează după 0004_service_includes.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

-- Linkul personal al fiecărui client: /portal/{portal_token}. Se poate regenera din CRM (cel vechi nu mai merge).
alter table public.clients add column if not exists portal_token uuid not null default gen_random_uuid();
alter table public.clients add column if not exists portal_last_seen timestamptz;
create unique index if not exists clients_portal_token_idx on public.clients(portal_token);

-- Ce fișiere vede clientul și ce a decis asupra lor.
alter table public.files add column if not exists visible_to_client boolean not null default false;
alter table public.files add column if not exists review_status text;
alter table public.files add column if not exists review_note text;
alter table public.files add column if not exists reviewed_at timestamptz;
do $$ begin
  alter table public.files add constraint files_review_status_check check (review_status is null or review_status in ('in_asteptare','aprobat','modificari'));
exception when duplicate_object then null; end $$;

-- Contractele semnate, livrabilele și facturile sunt vizibile clientului implicit.
update public.files set visible_to_client = true where folder in ('02 Contract', '09 Livrabile', '10 Facturi') and visible_to_client = false;

-- Comentariile pe fișiere (clientul din portal și echipa din CRM). La video, timecode = secunda din clip.
create table if not exists public.file_comments (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references public.files(id) on delete cascade,
  author_type text not null check (author_type in ('client','echipa')),
  author_name text,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  timecode numeric(10,2),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists file_comments_file_idx on public.file_comments(file_id, created_at);
alter table public.file_comments enable row level security;
drop policy if exists "file comments staff" on public.file_comments;
create policy "file comments staff" on public.file_comments for all using (public.is_staff()) with check (public.is_staff());
