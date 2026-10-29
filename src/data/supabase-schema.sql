-- HURR secure storefront foundation. Apply with `supabase db push`.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);
create table if not exists public.products (
  id text primary key, name text not null, name_ar text not null, slug text unique not null,
  tagline text not null default '', description text not null default '', story text not null default '',
  category text not null check (category in ('men','women','unisex','private_collection','offers')),
  price numeric(10,2) not null check (price >= 0), original_price numeric(10,2) check (original_price >= price),
  discount_percentage integer not null default 0 check (discount_percentage between 0 and 100),
  stock integer not null default 0 check (stock >= 0), images jsonb not null default '[]', bottle_style text,
  rating numeric(3,2) not null default 0, reviews_count integer not null default 0,
  is_bestseller boolean not null default false, is_new boolean not null default false, is_featured boolean not null default false,
  volume text not null default '', concentration text not null default '', longevity text not null default '', sillage text not null default '',
  notes jsonb not null default '{"top":[],"heart":[],"base":[]}', scent_family text not null default '', scent_family_ar text not null default '',
  occasion text not null default '', season text not null default '', status text not null default 'active' check (status in ('active','draft','out_of_stock')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.coupons (
  code text primary key, discount_type text not null check (discount_type in ('percentage','fixed')),
  value numeric(10,2) not null check (value > 0), min_order_amount numeric(10,2) not null default 0 check (min_order_amount >= 0),
  is_active boolean not null default true, usage_count integer not null default 0, max_uses integer,
  expires_at timestamptz, description text not null default '', created_at timestamptz not null default now()
);
create table if not exists public.orders (
  id text primary key, tracking_token_hash text not null,
  customer_name text not null, customer_phone text not null, customer_email text,
  governorate text not null, city text not null, detailed_address text not null, notes text,
  payment_method text not null check (payment_method in ('cod','card','vodafone_cash','instapay')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','verified')),
  shipping_status text not null default 'new' check (shipping_status in ('new','processing','shipped','delivered','cancelled')),
  subtotal numeric(10,2) not null, shipping_fee numeric(10,2) not null, discount_amount numeric(10,2) not null default 0,
  coupon_code text references public.coupons(code) on update cascade on delete set null,
  total_amount numeric(10,2) not null, tracking_history jsonb not null default '[]', created_at timestamptz not null default now()
);
create table if not exists public.order_items (
  id bigint generated always as identity primary key, order_id text not null references public.orders(id) on delete cascade,
  product_id text not null, product_name text not null, product_image text not null default '', selected_size text not null default '',
  quantity integer not null check (quantity > 0), unit_price numeric(10,2) not null check (unit_price >= 0),
  total_price numeric(10,2) generated always as (quantity * unit_price) stored
);
create table if not exists public.shipping_rates (
  governorate text primary key, fee numeric(10,2) not null check (fee>=0), active boolean not null default true
);
insert into public.shipping_rates(governorate,fee) values
('القاهرة',45),('الجيزة',45),('الإسكندرية',55),('القليوبية',55),('الشرقية',60),('الدقهلية (المنصورة)',60),('الغربية (طنطا)',60),('المنوفية',60),('البحيرة',65),('كفر الشيخ',65),('دمياط',65),('بورسعيد',65),('الإسماعيلية',65),('السويس',65),('الفيوم',70),('بني سويف',70),('المنيا',75),('أسيوط',75),('سوهاج',80),('قنا',80),('الأقصر',85),('أسوان',85),('البحر الأحمر (الغردقة)',90),('جنوب سيناء (شرم الشيخ)',95),('شمال سيناء',95),('مطروح والساحل الشمالي',90),('الوادي الجديد',100)
on conflict(governorate) do nothing;
create or replace function public.is_store_admin() returns boolean language sql stable security definer
set search_path=public,pg_temp as $$ select exists(select 1 from public.profiles p where p.user_id=auth.uid() and p.role='admin') $$;
revoke all on function public.is_store_admin() from public,anon;
grant execute on function public.is_store_admin() to authenticated;
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
revoke all on public.profiles,public.products,public.coupons,public.orders,public.order_items from anon, authenticated;
revoke all on public.shipping_rates from anon,authenticated;
grant select on public.shipping_rates to anon,authenticated;
grant insert,update,delete on public.shipping_rates to authenticated;
alter table public.shipping_rates enable row level security;
grant select on public.products to anon,authenticated;
grant select on public.coupons to anon,authenticated;
grant select,insert,update,delete on public.products,public.coupons,public.orders,public.order_items to authenticated;
grant select on public.profiles to authenticated;
-- Admin UI reads the signed-in user's role from this table. RLS alone is not enough:
-- the authenticated role also needs table-level SELECT permission.
grant select on public.admin_roles to authenticated;

create policy products_public_active on public.products for select to anon,authenticated using (status='active');
create policy products_admin_all on public.products for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
create policy profiles_self_read on public.profiles for select to authenticated using (user_id=auth.uid());
create policy profiles_admin_read on public.profiles for select to authenticated using (public.is_store_admin());
drop policy if exists shipping_rates_public_read on public.shipping_rates;
create policy shipping_rates_public_read on public.shipping_rates for select to anon,authenticated using (active = true);
drop policy if exists shipping_rates_admin_all on public.shipping_rates;
create policy shipping_rates_admin_all on public.shipping_rates for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
create policy coupons_admin_all on public.coupons for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
create policy coupons_public_active on public.coupons for select to anon,authenticated using (is_active and (expires_at is null or expires_at>now()) and (max_uses is null or usage_count<max_uses));
create policy orders_admin_all on public.orders for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());
create policy order_items_admin_all on public.order_items for all to authenticated using (public.is_store_admin()) with check (public.is_store_admin());

-- Only the service-role Edge Function may call this transaction. It ignores client prices,
-- locks inventory, calculates discounts/shipping and persists normalized order items.
create or replace function public.create_store_order(p_payload jsonb) returns jsonb
language plpgsql security definer set search_path=public,pg_temp as $$
declare r jsonb; it jsonb; p public.products%rowtype; n int; sub numeric(10,2):=0; disc numeric(10,2):=0;
 ship numeric(10,2); total numeric(10,2); c public.coupons%rowtype; oid text; tok text; code text;
begin
 if jsonb_typeof(p_payload->'items') <> 'array' or jsonb_array_length(p_payload->'items') not between 1 and 30 then raise exception 'Invalid items'; end if;
 if (select count(distinct value->>'productId') from jsonb_array_elements(p_payload->'items')) <> jsonb_array_length(p_payload->'items') then raise exception 'Duplicate products'; end if;
 for it in select value from jsonb_array_elements(p_payload->'items') loop
   n := (it->>'quantity')::int; if n<1 or n>50 then raise exception 'Invalid quantity'; end if;
   select * into p from public.products where id=(it->>'productId')::uuid and status='active' for update;
   if not found or p.stock<n then raise exception 'Product unavailable or insufficient stock'; end if;
   sub := sub + p.price*n;
 end loop;
 code := nullif(upper(trim(p_payload->>'couponCode')),'');
 if code is not null then
   select * into c from public.coupons where coupons.code=code and is_active and (expires_at is null or expires_at>now()) and (max_uses is null or usage_count<max_uses) for update;
   if not found or sub<c.min_order_amount then raise exception 'Coupon invalid or ineligible'; end if;
   disc := least(sub,case when c.discount_type='percentage' then sub*c.value/100 else c.value end);
 end if;
 select fee into ship from public.shipping_rates where governorate=p_payload->>'governorate' and active;
 if ship is null then raise exception 'Unsupported delivery area'; end if;
 if sub-disc>=1000 then ship:=0; end if;
 total := sub-disc+ship; oid := 'HURR-EG-'||upper(substr(encode(gen_random_bytes(5),'hex'),1,8)); tok := encode(gen_random_bytes(24),'hex');
 insert into public.orders(id,tracking_token_hash,customer_name,customer_phone,customer_email,governorate,city,detailed_address,notes,payment_method,subtotal,shipping_fee,discount_amount,coupon_code,total_amount)
 values(oid,encode(digest(tok,'sha256'),'hex'),p_payload->>'customerName',p_payload->>'customerPhone',nullif(p_payload->>'customerEmail',''),p_payload->>'governorate',p_payload->>'city',p_payload->>'detailedAddress',nullif(p_payload->>'notes',''),p_payload->>'paymentMethod',sub,ship,disc,code,total);
 for it in select value from jsonb_array_elements(p_payload->'items') loop
   n := (it->>'quantity')::int; select * into p from public.products where id=(it->>'productId')::uuid for update;
   update public.products set stock=stock-n,status=case when stock-n=0 then 'out_of_stock' else status end where id=p.id;
   insert into public.order_items(order_id,product_id,product_name,product_image,selected_size,quantity,unit_price)
   values(oid,p.id,p.name_ar,coalesce(p.images->>0,''),coalesce(it->>'selectedSize',''),n,p.price);
 end loop;
 if code is not null then update public.coupons set usage_count=usage_count+1 where coupons.code=code; end if;
 return jsonb_build_object('id',oid,'trackingToken',tok,'subtotal',sub,'shippingFee',ship,'discountAmount',disc,'totalAmount',total,
   'items',(select coalesce(jsonb_agg(jsonb_build_object('productId',i.product_id,'productName',i.product_name,'productImage',i.product_image,'quantity',i.quantity,'unitPrice',i.unit_price,'totalPrice',i.total_price,'selectedSize',i.selected_size)),'[]'::jsonb) from public.order_items i where i.order_id=oid));
end $$;
revoke all on function public.create_store_order(jsonb) from public,anon,authenticated;
grant execute on function public.create_store_order(jsonb) to service_role;

-- The Edge Function validates a one-time secret token and returns only status/date/item
-- summaries. No customer name, address, email, or phone is returned to tracking callers.
create or replace function public.track_store_order(p_id text,p_token text) returns jsonb
language sql security definer set search_path=public,pg_temp as $$
 select case when o.id is null then null else jsonb_build_object('id',o.id,'shippingStatus',o.shipping_status,'paymentStatus',o.payment_status,'paymentMethod',o.payment_method,'subtotal',o.subtotal,'shippingFee',o.shipping_fee,'discountAmount',o.discount_amount,'totalAmount',o.total_amount,'createdAt',o.created_at,'trackingHistory',o.tracking_history,'items',coalesce((select jsonb_agg(jsonb_build_object('productName',i.product_name,'quantity',i.quantity,'unitPrice',i.unit_price,'totalPrice',i.total_price,'selectedSize',i.selected_size)) from public.order_items i where i.order_id=o.id),'[]'::jsonb)) end
 from public.orders o where o.id=p_id and o.tracking_token_hash=encode(digest(p_token,'sha256'),'hex')
$$;
revoke all on function public.track_store_order(text,text) from public,anon,authenticated;
grant execute on function public.track_store_order(text,text) to service_role;

create or replace function public.refresh_order_tracking() returns trigger language plpgsql as $$
begin
  new.tracking_history := jsonb_build_array(
    jsonb_build_object('status','new','label','تم استلام الطلب','date',to_char(new.created_at at time zone 'Africa/Cairo','YYYY-MM-DD HH24:MI'),'description','تم تسجيل طلبك بنجاح','completed',true),
    jsonb_build_object('status','processing','label','قيد التجهيز','date','','description','يتم تجهيز طلبك بعناية','completed',new.shipping_status in ('processing','shipped','delivered')),
    jsonb_build_object('status','shipped','label','خرج للشحن','date','','description','طلبك في طريقه إليك','completed',new.shipping_status in ('shipped','delivered')),
    jsonb_build_object('status','delivered','label','تم التسليم','date','','description','تم تسليم الطلب','completed',new.shipping_status='delivered')
  );
  return new;
end $$;
drop trigger if exists orders_tracking_history on public.orders;
create trigger orders_tracking_history before insert or update of shipping_status on public.orders for each row execute function public.refresh_order_tracking();


-- Let each signed-in user read only their own admin role.
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'admin_roles'
      and policyname = 'Users can read own admin role'
  ) then
    create policy "Users can read own admin role"
      on public.admin_roles for select to authenticated
      using (user_id = (select auth.uid()));
  end if;
end $$;
