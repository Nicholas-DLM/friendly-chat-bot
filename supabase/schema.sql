create extension if not exists pgcrypto;

create table if not exists public.establishments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  whatsapp text,
  logo text,
  address text,
  created_at timestamptz not null default now()
);

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  establishment_id uuid not null references public.establishments(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  promotional_price numeric(10,2),
  image text,
  available boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.establishments enable row level security;
alter table public.admins enable row level security;
alter table public.products enable row level security;

create or replace function public.is_establishment_admin(target_establishment uuid)
returns boolean language sql security definer set search_path = public
as $$ select exists (
  select 1 from public.admins
  where user_id = auth.uid() and establishment_id = target_establishment
); $$;

create policy "admins can read own membership" on public.admins
for select to authenticated using (user_id = auth.uid());

create policy "admins manage own establishment" on public.establishments
for all to authenticated using (public.is_establishment_admin(id))
with check (public.is_establishment_admin(id));

create policy "public can read available products" on public.products
for select to anon using (available = true);

create policy "admins manage own products" on public.products
for all to authenticated using (public.is_establishment_admin(establishment_id))
with check (public.is_establishment_admin(establishment_id));
