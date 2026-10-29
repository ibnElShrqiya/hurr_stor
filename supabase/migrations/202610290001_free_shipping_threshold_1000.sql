-- Apply this migration to update the live database order calculation to free shipping at EGP 1000.
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
