-- MAVA Studio · semnături electronice desenate pentru ambele părți ale contractului
-- Rulează după 0002_i18n.sql (Supabase → SQL Editor). Poate fi rulată de mai multe ori.

-- Semnătura clientului (imagine PNG, data URL) – numele, data și IP-ul există deja.
alter table public.contracts add column if not exists client_signature text;

-- Semnătura prestatorului (MAVA Studio).
alter table public.contracts add column if not exists provider_signed_at timestamptz;
alter table public.contracts add column if not exists provider_signed_by text;
alter table public.contracts add column if not exists provider_signed_ip text;
alter table public.contracts add column if not exists provider_signature text;

-- Când a fost trimisă copia finală, semnată de ambele părți.
alter table public.contracts add column if not exists signed_copy_sent_at timestamptz;

-- Semnătura salvată a fiecărui utilizator CRM, refolosită la următoarele contracte.
alter table public.profiles add column if not exists signature text;
