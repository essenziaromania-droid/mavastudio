-- MAVA Studio · Mesaje centralizate (emailurile cu clienții și lead-urile, în CRM)
-- Rulează după 0008_google_calendar.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  direction text not null check (direction in ('in','out')),
  source text not null default 'imap' check (source in ('imap','crm')),
  folder text,
  message_id text,
  in_reply_to text,
  from_email text,
  from_name text,
  to_emails text[] not null default '{}',
  cc_emails text[] not null default '{}',
  subject text,
  body_text text,
  attachment_names text[] not null default '{}',
  sent_at timestamptz not null default now(),
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists messages_message_id_idx on public.messages(message_id) where message_id is not null;
create index if not exists messages_client_idx on public.messages(client_id, sent_at desc);
create index if not exists messages_lead_idx on public.messages(lead_id, sent_at desc);
create index if not exists messages_sent_idx on public.messages(sent_at desc);

alter table public.messages enable row level security;
drop policy if exists "messages" on public.messages;
create policy "messages" on public.messages for all using (public.has_module('mesaje')) with check (public.has_module('mesaje'));

-- Acces implicit pentru Project Manager (administratorul are acces la tot).
insert into public.role_permissions (role, module) values ('project_manager', 'mesaje') on conflict do nothing;
