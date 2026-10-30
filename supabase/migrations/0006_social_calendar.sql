-- MAVA Studio · Calendar social media (planificare postări + aprobare client din portal)
-- Rulează după 0005_client_portal.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  scheduled_at timestamptz not null,
  platforms text[] not null default '{}',
  format text not null default 'postare' check (format in ('postare','carusel','reel','story','video')),
  title text,
  caption text,
  hashtags text,
  internal_note text,
  status text not null default 'idee' check (status in ('idee','in_lucru','de_aprobat','aprobat','modificari','programat','publicat')),
  client_note text,
  reviewed_at timestamptz,
  published_url text,
  assignee_id uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists social_posts_client_date_idx on public.social_posts(client_id, scheduled_at);
create index if not exists social_posts_date_idx on public.social_posts(scheduled_at);

alter table public.social_posts enable row level security;
drop policy if exists "social posts" on public.social_posts;
create policy "social posts" on public.social_posts for all using (public.has_module('social')) with check (public.has_module('social'));

-- Imaginile / video-urile postării sunt fișiere obișnuite (folderul „08 Social Media”), legate de postare.
alter table public.files add column if not exists social_post_id uuid references public.social_posts(id) on delete set null;
create index if not exists files_social_post_idx on public.files(social_post_id);

-- Acces implicit la modul pentru Social Media Manager și Project Manager (administratorul are acces la tot).
insert into public.role_permissions (role, module) values ('social_media', 'social'), ('project_manager', 'social') on conflict do nothing;
