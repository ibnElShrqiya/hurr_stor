-- Safe repair for the HURR project's missing public.categories table.
-- Confirm public.is_hurr_admin() exists before running this script.
-- No existing tables or data are dropped or rewritten.

create table if not exists public.categories (
  id text primary key,
  name text not null check (char_length(name) between 1 and 100),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.categories enable row level security;

drop policy if exists "Public can view active categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
create policy "Public can view active categories"
  on public.categories for select to anon, authenticated
  using (active = true or (select public.is_hurr_admin()));
create policy "Admins manage categories"
  on public.categories for all to authenticated
  using ((select public.is_hurr_admin()))
  with check ((select public.is_hurr_admin()));

grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

insert into public.categories (id, name, active) values
  ('men', 'عطور الرجال', true),
  ('women', 'عطور النساء', true),
  ('unisex', 'عطور للجنسين', true)
on conflict (id) do nothing;

-- Ask PostgREST (Supabase Data API) to refresh its schema cache.
notify pgrst, 'reload schema';
