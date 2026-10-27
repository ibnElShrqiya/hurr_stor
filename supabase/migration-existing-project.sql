-- ترحيل متجر حُرّ إلى قاعدة Supabase الحالية. نفّذه مرة واحدة من SQL Editor.
-- لا يحذف أي جدول قائم ولا يحتاج مفتاح service_role في الواجهة.
create extension if not exists pgcrypto;

-- توافق المنتجات مع أعمدة قاعدة المشروع الموجودة بالفعل.
alter table public.products add column if not exists english_name text;
alter table public.products add column if not exists category_id text;
alter table public.products add column if not exists category_name text;
alter table public.products add column if not exists short_description text not null default '';
alter table public.products add column if not exists original_price numeric(10,2);
alter table public.products add column if not exists featured boolean not null default false;
alter table public.products alter column id set default gen_random_uuid();
update public.products set original_price=price where original_price is null;

create table if not exists public.categories (
 id text primary key, name text not null check(length(name) between 1 and 100),
 active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.offers (
 id uuid primary key default gen_random_uuid(), title text not null,
 description text not null default '', product_id uuid references public.products(id) on delete cascade,
 start_date date, end_date date, is_active boolean not null default true,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.shipping_rates (
 governorate text primary key, rate numeric(10,2) not null default 0 check(rate>=0),
 active boolean not null default true, updated_at timestamptz not null default now()
);
create table if not exists public.store_settings (
 id text primary key, settings jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);

-- تطبيع أعمدة الكوبونات مع الإبقاء على الجدول الحالي.
alter table public.coupons add column if not exists code text;
alter table public.coupons add column if not exists discount_type text not null default 'percent';
alter table public.coupons add column if not exists discount_value numeric(10,2) not null default 0;
alter table public.coupons add column if not exists min_order numeric(10,2) not null default 0;
alter table public.coupons add column if not exists max_uses integer not null default 0;
alter table public.coupons add column if not exists used_count integer not null default 0;
alter table public.coupons add column if not exists start_date date;
alter table public.coupons add column if not exists end_date date;
alter table public.coupons add column if not exists is_active boolean not null default false;
alter table public.coupons add column if not exists combine_offers boolean not null default false;
alter table public.coupons add column if not exists created_at timestamptz not null default now();
create unique index if not exists coupons_code_upper_unique on public.coupons (upper(code)) where code is not null;

-- صلاحية المدير الحالية تستخدم admin_roles و is_hurr_admin() الموجودة في مشروعك.
alter table public.categories enable row level security;
alter table public.offers enable row level security;
alter table public.shipping_rates enable row level security;
alter table public.store_settings enable row level security;
alter table public.coupons enable row level security;

drop policy if exists "Public can view active categories" on public.categories;
drop policy if exists "Admins manage categories" on public.categories;
create policy "Public can view active categories" on public.categories for select to anon, authenticated using (active = true or (select public.is_hurr_admin()));
create policy "Admins manage categories" on public.categories for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));

drop policy if exists "Public can view active offers" on public.offers;
drop policy if exists "Admins manage offers" on public.offers;
create policy "Public can view active offers" on public.offers for select to anon, authenticated using (is_active = true and (start_date is null or start_date <= current_date) and (end_date is null or end_date >= current_date));
create policy "Admins manage offers" on public.offers for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));

drop policy if exists "Public can view active shipping rates" on public.shipping_rates;
drop policy if exists "Admins manage shipping rates" on public.shipping_rates;
create policy "Public can view active shipping rates" on public.shipping_rates for select to anon, authenticated using (active = true);
create policy "Admins manage shipping rates" on public.shipping_rates for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));

drop policy if exists "Public can read store settings" on public.store_settings;
drop policy if exists "Admins manage store settings" on public.store_settings;
create policy "Public can read store settings" on public.store_settings for select to anon, authenticated using (id = 'store');
create policy "Admins manage store settings" on public.store_settings for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));

drop policy if exists "Public can view active coupons" on public.coupons;
drop policy if exists "Admins manage coupons" on public.coupons;
create policy "Public can view active coupons" on public.coupons for select to anon, authenticated using (is_active = true);
create policy "Admins manage coupons" on public.coupons for all to authenticated using ((select public.is_hurr_admin())) with check ((select public.is_hurr_admin()));

grant select on public.categories, public.offers, public.shipping_rates, public.store_settings, public.coupons to anon, authenticated;
grant insert, update, delete on public.categories, public.offers, public.shipping_rates, public.store_settings, public.coupons to authenticated;
grant select, insert, update, delete on public.products to authenticated;
grant select on public.products to anon;

-- أضف الأقسام الافتراضية فقط إذا كانت غير موجودة.
insert into public.categories(id,name,active) values
 ('men','عطور الرجال',true),('women','عطور النساء',true),('unisex','عطور للجنسين',true)
on conflict (id) do nothing;

-- إنشاء الطلب بشكل آمن في قاعدة البيانات: يعاد حساب الأسعار ويخصم المخزون ذريًا.
-- يفترض مخطط orders/order_items الظاهر في SUPABASE-SETUP.md / schema.sql.
create or replace function public.place_order(order_input jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
 v_order uuid; v_ref text; v_total numeric(10,2):=0; v_shipping numeric(10,2):=0;
 v_item jsonb; v_product public.products%rowtype; v_qty integer;
 v_name text:=btrim(order_input->>'name'); v_phone text:=btrim(order_input->>'phone');
 v_address text:=btrim(concat_ws(', ',nullif(btrim(order_input->>'city'),''),nullif(btrim(order_input->>'address'),'')));
 v_gov text:=btrim(order_input->>'governorate');
begin
 if length(v_name) not between 2 and 120 or length(v_phone) not between 8 and 20 or length(v_address) not between 8 and 500 or length(v_gov) not between 2 and 100 then raise exception 'بيانات العميل غير مكتملة'; end if;
 if jsonb_typeof(order_input->'items') <> 'array' or jsonb_array_length(order_input->'items') not between 1 and 30 then raise exception 'السلة فارغة أو غير صالحة'; end if;
 select rate into v_shipping from public.shipping_rates where governorate=v_gov and active=true;
 if v_shipping is null then raise exception 'لا يوجد سعر شحن متاح للمحافظة المختارة'; end if;
 insert into public.orders(customer_name,phone,address,governorate,total) values(v_name,v_phone,v_address,v_gov,1) returning id,reference into v_order,v_ref;
 for v_item in select value from jsonb_array_elements(order_input->'items') loop
   v_qty:=(v_item->>'quantity')::integer;
   if v_qty not between 1 and 20 then raise exception 'كمية المنتج غير صالحة'; end if;
   select * into v_product from public.products where id=(v_item->>'productId')::uuid and is_active=true for update;
   if not found or v_product.stock<v_qty then raise exception 'أحد المنتجات غير متاح بالكمية المطلوبة'; end if;
   update public.products set stock=stock-v_qty, updated_at=now() where id=v_product.id;
   insert into public.order_items(order_id,product_id,product_name,unit_price,quantity) values(v_order,v_product.id,v_product.name,v_product.price,v_qty);
   v_total:=v_total+v_product.price*v_qty;
 end loop;
 v_total:=v_total+v_shipping;
 update public.orders set total=v_total where id=v_order;
 return jsonb_build_object('id',v_order,'reference',v_ref,'total',v_total,'customer_name',v_name,'governorate',v_gov,'status','pending');
end $$;
revoke all on function public.place_order(jsonb) from public;
grant execute on function public.place_order(jsonb) to anon, authenticated;
