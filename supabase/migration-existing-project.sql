-- HURR additive Supabase repair for the schema currently reported by the owner.
-- Run in Supabase SQL Editor. Adds missing columns/tables and policies; does not drop data.
begin;

-- Admin authorization: clients can read only their own role; policy checks run as function owner.
create table if not exists public.admin_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);
alter table public.admin_roles enable row level security;
revoke all on public.admin_roles from anon;
grant select on public.admin_roles to authenticated;
drop policy if exists "Users read own admin role" on public.admin_roles;
create policy "Users read own admin role" on public.admin_roles for select to authenticated using (user_id = (select auth.uid()));
create or replace function public.is_hurr_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_roles r where r.user_id = (select auth.uid()) and r.role = 'admin') $$;
revoke all on function public.is_hurr_admin() from public;
grant execute on function public.is_hurr_admin() to anon, authenticated;

-- Existing categories table has only id text. Keep its IDs and add fields used by the UI.
create table if not exists public.categories (
  id text primary key,
  name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.categories add column if not exists name text;
alter table public.categories add column if not exists active boolean not null default true;
alter table public.categories add column if not exists created_at timestamptz not null default now();
alter table public.categories add column if not exists updated_at timestamptz not null default now();
update public.categories set name = case id when 'men' then 'عطور الرجال' when 'women' then 'عطور النساء' when 'unisex' then 'عطور للجنسين' else 'قسم ' || id end where name is null or btrim(name) = '';
alter table public.categories alter column name set not null;

-- Product schema supplied by the owner uses category_id text and price numeric.
-- Add only optional storefront fields queried by this app. Keep all existing rows/values.
alter table public.products add column if not exists original_price numeric;
alter table public.products add column if not exists short_description text not null default '';
alter table public.products add column if not exists english_name text;
alter table public.products add column if not exists category_name text;
alter table public.products add column if not exists featured boolean not null default false;
update public.products set original_price = price where original_price is null;
alter table public.products alter column original_price set default 0;

create unique index if not exists categories_id_unique_idx on public.categories (id);

-- A text-to-text FK is valid for the reported schema; NOT VALID avoids rejecting legacy IDs.
do $$ begin
  if not exists (select 1 from pg_constraint where conrelid='public.products'::regclass and conname='products_category_id_fkey') then
    alter table public.products add constraint products_category_id_fkey foreign key (category_id) references public.categories(id) on update cascade on delete set null not valid;
  end if;
end $$;

alter table public.categories enable row level security;
drop policy if exists "Public can view active categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
create policy "Public can view active categories" on public.categories for select to anon, authenticated using (active or (select public.is_hurr_admin()));
create policy "Admins manage categories" on public.categories for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

-- Public product reads and admin writes follow the same role helper.
alter table public.products enable row level security;
drop policy if exists "Public can view active products" on public.products;
drop policy if exists "Admins manage products" on public.products;
create policy "Public can view active products" on public.products for select to anon, authenticated using (is_active or (select public.is_hurr_admin()));
create policy "Admins manage products" on public.products for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;

insert into public.categories (id, name, active) values ('men','عطور الرجال',true),('women','عطور النساء',true),('unisex','عطور للجنسين',true) on conflict (id) do nothing;
notify pgrst, 'reload schema';
commit;




