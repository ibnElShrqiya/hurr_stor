-- Run this once in the SQL editor to enable editable shipping rates from the admin page.
create table if not exists public.shipping_rates (
  governorate text primary key,
  fee numeric(10,2) not null check (fee >= 0),
  active boolean not null default true
);
insert into public.shipping_rates(governorate, fee) values
('القاهرة',45),('الجيزة',45),('الإسكندرية',55),('القليوبية',55),('الشرقية',60),('الدقهلية (المنصورة)',60),('الغربية (طنطا)',60),('المنوفية',60),('البحيرة',65),('كفر الشيخ',65),('دمياط',65),('بورسعيد',65),('الإسماعيلية',65),('السويس',65),('الفيوم',70),('بني سويف',70),('المنيا',75),('أسيوط',75),('سوهاج',80),('قنا',80),('الأقصر',85),('أسوان',85),('البحر الأحمر (الغردقة)',90),('جنوب سيناء (شرم الشيخ)',95),('شمال سيناء',95),('مطروح والساحل الشمالي',90),('الوادي الجديد',100)
on conflict (governorate) do nothing;
alter table public.shipping_rates enable row level security;
grant select on public.shipping_rates to anon, authenticated;
grant insert, update, delete on public.shipping_rates to authenticated;
drop policy if exists shipping_rates_public_read on public.shipping_rates;
create policy shipping_rates_public_read on public.shipping_rates for select to anon, authenticated using (active = true);
drop policy if exists shipping_rates_admin_all on public.shipping_rates;
create policy shipping_rates_admin_all on public.shipping_rates for all to authenticated using (exists (select 1 from public.admin_roles ar where ar.user_id = auth.uid() and ar.role = 'admin')) with check (exists (select 1 from public.admin_roles ar where ar.user_id = auth.uid() and ar.role = 'admin'));
