-- Apply in Supabase SQL editor after review. Never expose service_role in browser code.
create extension if not exists pgcrypto;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.admin_users a where a.user_id = (select auth.uid()))
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(), name_ar text not null check (length(name_ar) between 1 and 100),
  active boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), category_id uuid references public.categories(id),
  name_ar text not null check (length(name_ar) between 1 and 120), description_ar text not null default '' check (length(description_ar)<=2000),
  price numeric(10,2) not null check (price > 0), stock integer not null default 0 check (stock>=0),
  image_url text, published boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id) on delete cascade,
  title_ar text not null check(length(title_ar) between 1 and 120), description_ar text not null default '' check(length(description_ar)<=1000),
  offer_price numeric(10,2) not null check(offer_price>0), starts_at timestamptz not null, ends_at timestamptz not null,
  published boolean not null default false check(ends_at>starts_at), created_at timestamptz not null default now()
);
create or replace view public.public_products with (security_invoker=true) as
select p.id,p.name_ar,p.description_ar,p.price,p.created_at,c.name_ar as category_name
from public.products p left join public.categories c on c.id=p.category_id
where p.published=true and p.stock>0 and (c.id is null or c.active=true);
create or replace view public.public_offers with (security_invoker=true) as
select o.id,o.title_ar,o.description_ar,o.offer_price,p.name_ar as product_name,o.created_at
from public.offers o join public.products p on p.id=o.product_id
where o.published=true and p.published=true and p.stock>0 and o.starts_at<=now() and o.ends_at>now();
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(), reference text not null unique default ('HR-'||upper(substr(gen_random_uuid()::text,1,10))),
  customer_name text not null check(length(customer_name) between 2 and 120), phone text not null check(length(phone) between 8 and 20),
  address text not null check(length(address) between 8 and 500), governorate text not null check(length(governorate) between 2 and 100),
  status text not null default 'pending' check(status in ('pending','confirmed','shipped','delivered','cancelled')),
  total numeric(10,2) not null check(total>0), created_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id), product_name text not null, unit_price numeric(10,2) not null check(unit_price>0), quantity integer not null check(quantity between 1 and 20)
);
alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.offers enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
create policy "public read active categories" on public.categories for select to anon, authenticated using (active=true);
create policy "public read published products" on public.products for select to anon, authenticated using (published=true and stock>0);
create policy "public read published offers" on public.offers for select to anon, authenticated using (published=true and starts_at<=now() and ends_at>now());
create policy "admin list own membership" on public.admin_users for select to authenticated using (user_id=(select auth.uid()));
create policy "admin manage categories" on public.categories for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin manage products" on public.products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin manage offers" on public.offers for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin read orders" on public.orders for select to authenticated using ((select public.is_admin()));
create policy "admin update orders" on public.orders for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin read order items" on public.order_items for select to authenticated using ((select public.is_admin()));
grant select on public.public_products to anon, authenticated;
grant select on public.public_offers to anon, authenticated;
grant select on public.categories,public.products to anon;
grant select on public.offers to anon;
grant select on public.admin_users to authenticated;
grant select,insert,update,delete on public.categories,public.products,public.offers to authenticated;
grant select,update on public.orders to authenticated;
grant select on public.order_items to authenticated;

-- Safe single-transaction order creation: accepts identifiers/quantities only and recalculates totals.
create or replace function public.place_order(order_input jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_order uuid; v_total numeric(10,2):=0; v_item jsonb; v_product public.products%rowtype; v_qty integer;
  v_name text:=btrim(order_input->>'customer_name'); v_phone text:=btrim(order_input->>'phone');
  v_address text:=btrim(order_input->>'address'); v_gov text:=btrim(order_input->>'governorate'); v_count integer:=0; v_ref text;
begin
  if length(v_name) not between 2 and 120 or length(v_phone) not between 8 and 20 or length(v_address) not between 8 and 500 or length(v_gov) not between 2 and 100 then raise exception 'invalid customer data'; end if;
  if jsonb_typeof(order_input->'items') <> 'array' or jsonb_array_length(order_input->'items') not between 1 and 30 then raise exception 'invalid items'; end if;
  insert into public.orders(customer_name,phone,address,governorate,total) values(v_name,v_phone,v_address,v_gov,1) returning id,reference into v_order,v_ref;
  for v_item in select value from jsonb_array_elements(order_input->'items') loop
    v_qty:=(v_item->>'quantity')::integer;
    if v_qty not between 1 and 20 then raise exception 'invalid quantity'; end if;
    select * into v_product from public.products where id=(v_item->>'productId')::uuid and published=true for update;
    if not found or v_product.stock<v_qty then raise exception 'product unavailable'; end if;
    update public.products set stock=stock-v_qty where id=v_product.id;
    insert into public.order_items(order_id,product_id,product_name,unit_price,quantity) values(v_order,v_product.id,v_product.name_ar,v_product.price,v_qty);
    v_total:=v_total+v_product.price*v_qty; v_count:=v_count+1;
  end loop;
  if v_count=0 then raise exception 'empty order'; end if;
  update public.orders set total=v_total where id=v_order;
  return jsonb_build_object('reference',v_ref);
end $$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
