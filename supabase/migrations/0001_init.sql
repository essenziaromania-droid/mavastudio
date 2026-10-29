-- MAVA Studio — schema inițială (site public + CRM)
-- Rulează în Supabase: SQL Editor → lipește tot fișierul → Run.

create extension if not exists "pgcrypto";

-- ───────────────────────── ROLURI & PERMISIUNI ─────────────────────────

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  email text not null default '',
  phone text,
  role text not null default 'developer'
    check (role in ('admin','project_manager','developer','designer','video_editor','social_media','financiar')),
  status text not null default 'activ' check (status in ('activ','inactiv')),
  avatar_url text,
  hourly_cost numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.role_permissions (
  role text not null,
  module text not null,
  primary key (role, module)
);

-- Prima persoană înregistrată devine administrator; restul primesc rolul din invitație.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  is_first boolean;
begin
  select not exists(select 1 from public.profiles) into is_first;
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(coalesce(new.email,''), '@', 1)),
    case when is_first then 'admin' else coalesce(new.raw_user_meta_data->>'role', 'developer') end
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.my_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid() and status = 'activ'
$$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select public.my_role() is not null
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin'
$$;

create or replace function public.has_module(m text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.my_role() = 'admin'
      or exists (select 1 from public.role_permissions rp where rp.role = public.my_role() and rp.module = m)
$$;

-- ───────────────────────── SETĂRI & NUMEROTARE ─────────────────────────

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.doc_counters (
  prefix text not null,
  year int not null,
  value int not null default 0,
  primary key (prefix, year)
);

create or replace function public.next_doc_number(p_prefix text) returns text
language plpgsql security definer set search_path = public as $$
declare
  y int := extract(year from now());
  v int;
begin
  insert into public.doc_counters(prefix, year, value) values (p_prefix, y, 1)
  on conflict (prefix, year) do update set value = public.doc_counters.value + 1
  returning value into v;
  return p_prefix || '-' || y || '-' || lpad(v::text, 4, '0');
end $$;

-- ───────────────────────── LEAD-URI & CLIENȚI ─────────────────────────

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'company' check (type in ('company','person')),
  name text not null,
  cui text,
  reg_com text,
  address text,
  city text,
  county text,
  country text default 'România',
  email text,
  phone text,
  website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  contact_role text,
  iban text,
  source text,
  status text not null default 'prospect' check (status in ('lead','prospect','activ','inactiv')),
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  services text[] not null default '{}',
  budget text,
  deadline text,
  message text,
  source text not null default 'site'
    check (source in ('site','facebook','instagram','tiktok','google_ads','recomandare','manual','email','linkedin','altul')),
  utm jsonb not null default '{}'::jsonb,
  ip text,
  user_agent text,
  consent boolean not null default false,
  consent_at timestamptz,
  attachment_path text,
  status text not null default 'nou'
    check (status in ('nou','contactat','calificat','oferta','negociere','castigat','pierdut')),
  value_estimate numeric(12,2),
  lost_reason text,
  assigned_to uuid references public.profiles(id),
  client_id uuid references public.clients(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists leads_created_idx on public.leads(created_at desc);

-- ───────────────────────── CATALOG SERVICII ─────────────────────────

create table if not exists public.services_catalog (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('website','ecommerce','saas','crm','ai','video','social','mentenanta','altele')),
  name text not null,
  description text,
  unit text not null default 'proiect',
  price numeric(12,2) not null default 0,
  recurring boolean not null default false,
  active boolean not null default true,
  sort int not null default 0
);

-- ───────────────────────── OFERTE ─────────────────────────

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  number text unique not null default public.next_doc_number('OF'),
  client_id uuid references public.clients(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null default 'Ofertă servicii digitale',
  status text not null default 'draft'
    check (status in ('draft','trimisa','vizualizata','acceptata','modificari','respinsa','expirata')),
  discount_percent numeric(5,2) not null default 0,
  vat_rate numeric(5,2) not null default 21,
  subtotal numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  delivery_term text,
  payment_terms text default '50% avans, 30% versiune beta, 20% la lansare',
  conditions text,
  notes text,
  valid_until date default (now() + interval '30 days')::date,
  public_token uuid not null default gen_random_uuid(),
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  client_feedback text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  category text,
  name text not null,
  description text,
  quantity numeric(10,2) not null default 1,
  unit text not null default 'proiect',
  unit_price numeric(12,2) not null default 0,
  recurring boolean not null default false,
  sort int not null default 0
);

-- ───────────────────────── CONTRACTE ─────────────────────────

create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  number text unique not null default public.next_doc_number('CT'),
  client_id uuid references public.clients(id) on delete set null,
  offer_id uuid references public.offers(id) on delete set null,
  title text not null,
  status text not null default 'draft' check (status in ('draft','trimis','vizualizat','semnat','expirat','anulat')),
  value numeric(12,2) not null default 0,
  start_date date,
  end_date date,
  body text,
  public_token uuid not null default gen_random_uuid(),
  sent_at timestamptz,
  viewed_at timestamptz,
  signed_at timestamptz,
  signed_by_name text,
  signed_ip text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ───────────────────────── PROIECTE & TASK-URI ─────────────────────────

create table if not exists public.project_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  stages jsonb not null default '[]'::jsonb -- [{ "title": "Brief", "days": 2 }]
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_id uuid references public.clients(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  category text,
  status text not null default 'de_inceput' check (status in ('de_inceput','in_lucru','review','finalizat','anulat')),
  progress int not null default 0,
  value numeric(12,2) not null default 0,
  start_date date,
  deadline date,
  manager_id uuid references public.profiles(id),
  description text,
  drive_folder_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid references public.projects(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  primary key (project_id, profile_id)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  assignee_id uuid references public.profiles(id) on delete set null,
  priority text not null default 'medie' check (priority in ('scazuta','medie','ridicata','urgenta')),
  status text not null default 'de_facut' check (status in ('de_facut','in_lucru','review','finalizat')),
  deadline date,
  estimated_hours numeric(6,2),
  review_note text,
  sort int not null default 0,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index if not exists tasks_assignee_idx on public.tasks(assignee_id);
create index if not exists tasks_project_idx on public.tasks(project_id);

create table if not exists public.task_comments (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  author_id uuid references public.profiles(id),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  hours numeric(6,2) not null,
  work_date date not null default current_date,
  note text
);

-- ───────────────────────── CALENDAR ─────────────────────────

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'intalnire' check (type in ('intalnire','deadline','lansare','review','prezentare','altul')),
  start_at timestamptz not null,
  end_at timestamptz,
  all_day boolean not null default false,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  location text,
  description text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ───────────────────────── FINANCIAR ─────────────────────────

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  series text,
  number text,
  client_id uuid references public.clients(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  contract_id uuid references public.contracts(id) on delete set null,
  provider text not null default 'manual' check (provider in ('manual','smartbill','oblio','fgo')),
  external_id text,
  external_url text,
  issue_date date not null default current_date,
  due_date date,
  description text,
  service_category text,
  subtotal numeric(12,2) not null default 0,
  vat_amount numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  paid_amount numeric(12,2) not null default 0,
  status text not null default 'emisa' check (status in ('draft','emisa','trimisa','platita','partial','restanta','anulata')),
  created_at timestamptz not null default now()
);

create table if not exists public.payment_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  label text not null,
  percent numeric(5,2) not null default 0,
  amount numeric(12,2) not null default 0,
  due_date date,
  invoice_id uuid references public.invoices(id) on delete set null,
  status text not null default 'planificata' check (status in ('planificata','facturata','incasata')),
  sort int not null default 0
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid references public.invoices(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  amount numeric(12,2) not null,
  paid_at date not null default current_date,
  method text default 'transfer',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'altele'
    check (category in ('software','freelanceri','reclama','hosting','abonamente','salarii','echipamente','altele')),
  description text not null,
  supplier text,
  amount numeric(12,2) not null,
  expense_date date not null default current_date,
  project_id uuid references public.projects(id) on delete set null,
  recurring boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────────────────── FIȘIERE, ACTIVITATE, NOTIFICĂRI, AUDIT ─────────────────────────

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  folder text not null default '01 Brief',
  name text not null,
  path text not null,
  mime text,
  size bigint,
  drive_file_id text,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  type text not null default 'nota',
  title text not null,
  description text,
  actor_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index if not exists activities_client_idx on public.activities(client_id, created_at desc);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade, -- null = toți administratorii
  type text not null default 'info',
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  actor_id uuid references public.profiles(id),
  actor_name text,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb,
  created_at timestamptz not null default now()
);

-- ───────────────────────── CONȚINUT SITE (CMS) ─────────────────────────

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content text not null default '',
  cover_url text,
  category text,
  tags text[] not null default '{}',
  author_name text default 'Echipa MAVA Studio',
  status text not null default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client_name text,
  category text not null default 'website' check (category in ('website','saas','crm','ai','social','video')),
  subtitle text,
  summary text,
  cover_url text,
  gallery text[] not null default '{}',
  problem text,
  solution text,
  technologies text[] not null default '{}',
  features text[] not null default '{}',
  results text,
  metrics jsonb not null default '[]'::jsonb, -- [{ "value": "+320%", "label": "creștere vânzări" }]
  live_url text,
  featured boolean not null default false,
  published boolean not null default false,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- ───────────────────────── RLS ─────────────────────────

do $$
declare t text;
begin
  foreach t in array array[
    'profiles','role_permissions','settings','doc_counters','clients','leads','services_catalog','offers','offer_items',
    'contracts','project_templates','projects','project_members','tasks','task_comments','time_entries','events',
    'invoices','payment_milestones','payments','expenses','files','activities','notifications','audit_log',
    'blog_posts','portfolio_projects'
  ] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Membru al proiectului (pentru roluri care văd doar proiectele atribuite)
create or replace function public.is_project_member(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.projects pr where pr.id = p and pr.manager_id = auth.uid())
      or exists (select 1 from public.project_members pm where pm.project_id = p and pm.profile_id = auth.uid())
$$;

-- profiles
create policy "staff read profiles" on public.profiles for select using (public.is_staff());
create policy "self update profile" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = public.my_role());
create policy "admin manage profiles" on public.profiles for all using (public.has_module('angajati')) with check (public.has_module('angajati'));

create policy "staff read perms" on public.role_permissions for select using (public.is_staff());
create policy "admin perms" on public.role_permissions for all using (public.is_admin()) with check (public.is_admin());

create policy "staff read settings" on public.settings for select using (public.is_staff() and key <> 'invoicing');
create policy "finance read invoicing" on public.settings for select using (key = 'invoicing' and (public.has_module('financiar') or public.has_module('setari')));
create policy "admin settings" on public.settings for all using (public.has_module('setari')) with check (public.has_module('setari'));

-- module simple
create policy "leads" on public.leads for all using (public.has_module('leads')) with check (public.has_module('leads'));
create policy "clients read" on public.clients for select using (public.has_module('clienti') or public.has_module('proiecte'));
create policy "clients write" on public.clients for all using (public.has_module('clienti')) with check (public.has_module('clienti'));
create policy "catalog read" on public.services_catalog for select using (public.is_staff());
create policy "catalog write" on public.services_catalog for all using (public.has_module('setari')) with check (public.has_module('setari'));
create policy "offers" on public.offers for all using (public.has_module('oferte')) with check (public.has_module('oferte'));
create policy "offer items" on public.offer_items for all using (public.has_module('oferte')) with check (public.has_module('oferte'));
create policy "contracts" on public.contracts for all using (public.has_module('contracte')) with check (public.has_module('contracte'));
create policy "templates read" on public.project_templates for select using (public.is_staff());
create policy "templates write" on public.project_templates for all using (public.has_module('setari')) with check (public.has_module('setari'));

-- proiecte: toate (proiecte_toate) sau doar cele atribuite
create policy "projects read" on public.projects for select
  using (public.has_module('proiecte_toate') or (public.has_module('proiecte') and public.is_project_member(id)));
create policy "projects write" on public.projects for all
  using (public.has_module('proiecte_toate')) with check (public.has_module('proiecte_toate'));
create policy "members read" on public.project_members for select using (public.is_staff());
create policy "members write" on public.project_members for all using (public.has_module('proiecte_toate')) with check (public.has_module('proiecte_toate'));

create policy "tasks read" on public.tasks for select using (
  public.has_module('proiecte_toate') or assignee_id = auth.uid() or (project_id is not null and public.is_project_member(project_id))
);
create policy "tasks insert" on public.tasks for insert with check (public.has_module('taskuri'));
create policy "tasks update" on public.tasks for update using (
  public.has_module('proiecte_toate') or assignee_id = auth.uid()
);
create policy "tasks delete" on public.tasks for delete using (public.has_module('proiecte_toate'));

create policy "task comments" on public.task_comments for all using (public.is_staff()) with check (public.is_staff());
create policy "time own" on public.time_entries for all using (profile_id = auth.uid() or public.has_module('rapoarte'))
  with check (profile_id = auth.uid() or public.has_module('rapoarte'));

create policy "events" on public.events for all using (public.has_module('calendar')) with check (public.has_module('calendar'));

-- financiar
create policy "invoices" on public.invoices for all using (public.has_module('financiar')) with check (public.has_module('financiar'));
create policy "milestones" on public.payment_milestones for all using (public.has_module('financiar')) with check (public.has_module('financiar'));
create policy "payments" on public.payments for all using (public.has_module('financiar')) with check (public.has_module('financiar'));
create policy "expenses" on public.expenses for all using (public.has_module('financiar')) with check (public.has_module('financiar'));

create policy "files" on public.files for all using (public.has_module('fisiere')) with check (public.has_module('fisiere'));
create policy "activities" on public.activities for all using (public.is_staff()) with check (public.is_staff());
create policy "notifications own" on public.notifications for select using (user_id = auth.uid() or (user_id is null and public.is_admin()));
create policy "notifications update" on public.notifications for update using (user_id = auth.uid() or (user_id is null and public.is_admin()));
create policy "notifications insert" on public.notifications for insert with check (public.is_staff());
create policy "audit read" on public.audit_log for select using (public.is_admin());
create policy "audit insert" on public.audit_log for insert with check (public.is_staff());

-- CMS: public vede doar ce e publicat
create policy "blog public" on public.blog_posts for select using (status = 'published' or public.has_module('website'));
create policy "blog write" on public.blog_posts for all using (public.has_module('website')) with check (public.has_module('website'));
create policy "portfolio public" on public.portfolio_projects for select using (published or public.has_module('website'));
create policy "portfolio write" on public.portfolio_projects for all using (public.has_module('website')) with check (public.has_module('website'));

-- ───────────────────────── STORAGE ─────────────────────────

insert into storage.buckets (id, name, public) values ('public-media', 'public-media', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('crm-files', 'crm-files', false) on conflict do nothing;

create policy "media read" on storage.objects for select using (bucket_id = 'public-media');
create policy "media write" on storage.objects for insert with check (bucket_id = 'public-media' and public.has_module('website'));
create policy "media delete" on storage.objects for delete using (bucket_id = 'public-media' and public.has_module('website'));
create policy "crm files read" on storage.objects for select using (bucket_id = 'crm-files' and public.is_staff());
create policy "crm files write" on storage.objects for insert with check (bucket_id = 'crm-files' and public.is_staff());
create policy "crm files delete" on storage.objects for delete using (bucket_id = 'crm-files' and public.has_module('fisiere'));

-- ───────────────────────── DATE INIȚIALE ─────────────────────────

insert into public.role_permissions (role, module) values
  ('project_manager','dashboard'),('project_manager','leads'),('project_manager','clienti'),('project_manager','oferte'),
  ('project_manager','contracte'),('project_manager','proiecte'),('project_manager','proiecte_toate'),('project_manager','taskuri'),
  ('project_manager','calendar'),('project_manager','fisiere'),('project_manager','rapoarte'),('project_manager','website'),
  ('developer','dashboard'),('developer','proiecte'),('developer','taskuri'),('developer','calendar'),('developer','fisiere'),
  ('designer','dashboard'),('designer','proiecte'),('designer','taskuri'),('designer','calendar'),('designer','fisiere'),
  ('video_editor','dashboard'),('video_editor','proiecte'),('video_editor','taskuri'),('video_editor','calendar'),('video_editor','fisiere'),
  ('social_media','dashboard'),('social_media','proiecte'),('social_media','taskuri'),('social_media','calendar'),('social_media','fisiere'),('social_media','website'),
  ('financiar','dashboard'),('financiar','clienti'),('financiar','oferte'),('financiar','contracte'),('financiar','financiar'),('financiar','rapoarte')
on conflict do nothing;

insert into public.settings (key, value) values
  ('company', '{"name":"MAVA Studio","legal_name":"","cui":"","reg_com":"","address":"","iban":"","bank":"","email":"contact@mavastudio.ro","phone":"","vat_payer":true}'),
  ('site', '{"email":"contact@mavastudio.ro","phone":"","show_phone":false,"schedule":"Luni – Vineri: 09:00 – 18:00","show_stats":false,"stats":[{"value":"50+","label":"Proiecte livrate"},{"value":"98%","label":"Clienți mulțumiți"},{"value":"6","label":"Servicii principale"}],"socials":{"instagram":"","linkedin":"","youtube":"","tiktok":"","facebook":""}}'),
  ('invoicing', '{"provider":"manual","smartbill":{"email":"","token":"","cif":"","series":""},"oblio":{"email":"","secret":"","cif":"","series":""},"fgo":{"cui":"","key":"","series":""}}'),
  ('automations', '{"lead_new_notify":true,"lead_new_task":true,"lead_new_autoreply":true,"offer_accepted_contract":true,"contract_signed_project":true,"contract_signed_invoice":true,"invoice_paid_notify":true}')
on conflict (key) do nothing;

insert into public.project_templates (name, category, stages) values
  ('Website', 'website', '[{"title":"Brief","days":2},{"title":"Wireframe","days":3},{"title":"UI Design","days":5},{"title":"Development","days":10},{"title":"Content","days":3},{"title":"SEO","days":2},{"title":"Testing","days":2},{"title":"Launch","days":1}]'),
  ('Magazin online', 'ecommerce', '[{"title":"Brief","days":2},{"title":"Wireframe","days":3},{"title":"UI Design","days":6},{"title":"Development","days":14},{"title":"Import produse","days":3},{"title":"Integrare plăți & curierat","days":3},{"title":"SEO","days":2},{"title":"Testing","days":3},{"title":"Launch","days":1}]'),
  ('Platformă SaaS', 'saas', '[{"title":"Analiză","days":3},{"title":"Arhitectură","days":3},{"title":"UI","days":7},{"title":"Database","days":3},{"title":"Backend","days":14},{"title":"Frontend","days":14},{"title":"API","days":5},{"title":"Testing","days":4},{"title":"Deploy","days":1}]'),
  ('CRM & Automatizări', 'crm', '[{"title":"Analiză procese","days":3},{"title":"Design","days":5},{"title":"Configurare module","days":10},{"title":"Integrări","days":5},{"title":"Testare","days":3},{"title":"Training & lansare","days":2}]'),
  ('Foto & Video AI', 'ai', '[{"title":"Brief","days":1},{"title":"Materiale produs","days":2},{"title":"Generare vizualuri","days":3},{"title":"Review intern","days":1},{"title":"Revizie","days":2},{"title":"Livrare","days":1}]'),
  ('Editare video', 'video', '[{"title":"Brief","days":1},{"title":"Script","days":2},{"title":"Materiale","days":2},{"title":"Montaj","days":3},{"title":"Review","days":1},{"title":"Revizie","days":2},{"title":"Export","days":1}]'),
  ('Social Media (lunar)', 'social', '[{"title":"Strategie & calendar editorial","days":3},{"title":"Copywriting","days":4},{"title":"Design & Reels","days":6},{"title":"Review intern","days":2},{"title":"Aprobare client","days":2},{"title":"Programare postări","days":1},{"title":"Raport lunar","days":2}]')
on conflict do nothing;

insert into public.services_catalog (category, name, description, unit, price, recurring, sort) values
  ('website','Website de prezentare','Până la 5 pagini, design personalizat, responsive','proiect',4500,false,1),
  ('website','Website Business','Până la 12 pagini, blog, formulare, SEO de bază','proiect',8500,false,2),
  ('website','Landing page','Pagină optimizată pentru conversie','proiect',2500,false,3),
  ('ecommerce','Magazin online','eCommerce complet, plăți și curierat','proiect',12000,false,4),
  ('saas','Platformă SaaS – MVP','Autentificare, dashboard, roluri, abonamente','proiect',35000,false,5),
  ('crm','CRM personalizat','Module la alegere, integrări facturare','proiect',18000,false,6),
  ('ai','Fotografie produse AI (10 imagini)','Imagini de produs generate cu AI','pachet',1500,false,7),
  ('ai','Video produs AI','Clip video de produs 15–30 sec','buc',2000,false,8),
  ('video','Editare Reels / TikTok','Montaj, subtitrări, muzică','buc',350,false,9),
  ('social','Administrare social media','12 postări + 4 Reels / lună','lună',2500,true,10),
  ('altele','SEO tehnic','Audit și optimizare tehnică','proiect',1500,false,11),
  ('mentenanta','Mentenanță & suport','Actualizări, backup, monitorizare','lună',750,true,12)
on conflict do nothing;

-- Setările publice ale site-ului (contact, statistici, social) pot fi citite de oricine.
create policy "public site settings" on public.settings for select using (key = 'site');
create policy "website settings" on public.settings for all using (key = 'site' and public.has_module('website')) with check (key = 'site' and public.has_module('website'));
