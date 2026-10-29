-- HUR: repair admin role read permissions safely.
-- Run in Supabase SQL Editor. This does not change user roles or expose other users' role rows.
grant select on table public.admin_roles to authenticated;

alter table public.admin_roles enable row level security;

drop policy if exists "Users can read own admin role" on public.admin_roles;
create policy "Users can read own admin role"
  on public.admin_roles
  for select
  to authenticated
  using (user_id = (select auth.uid()));
