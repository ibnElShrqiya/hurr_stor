-- HURR coupon compatibility and one-time-use enforcement.
-- Apply this migration in Supabase SQL Editor after backing up production.

ALTER TABLE public.coupons
  ADD COLUMN IF NOT EXISTS discount_percent numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount_type text NOT NULL DEFAULT 'percentage',
  ADD COLUMN IF NOT EXISTS value numeric(10,2) NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS min_order_amount numeric(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usage_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_uses integer,
  ADD COLUMN IF NOT EXISTS description text NOT NULL DEFAULT '';

-- Preserve coupons created by the older compact schema (discount_percent).
-- The legacy column stays populated because older deployments may enforce NOT NULL on it.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='coupons' AND column_name='discount_percent'
  ) THEN
    EXECUTE 'UPDATE public.coupons SET value = discount_percent, discount_type = ''percentage'' WHERE discount_percent > 0 AND (value IS NULL OR value = 1)';
  END IF;
END $$;

UPDATE public.coupons SET usage_count = 0 WHERE usage_count IS NULL;
UPDATE public.coupons SET min_order_amount = 0 WHERE min_order_amount IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='coupons_discount_type_check' AND conrelid='public.coupons'::regclass) THEN
    ALTER TABLE public.coupons ADD CONSTRAINT coupons_discount_type_check CHECK (discount_type IN ('percentage','fixed'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='coupons_value_positive_check' AND conrelid='public.coupons'::regclass) THEN
    ALTER TABLE public.coupons ADD CONSTRAINT coupons_value_positive_check CHECK (value > 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='coupons_max_uses_positive_check' AND conrelid='public.coupons'::regclass) THEN
    ALTER TABLE public.coupons ADD CONSTRAINT coupons_max_uses_positive_check CHECK (max_uses IS NULL OR max_uses > 0);
  END IF;
END $$;

-- Locking the coupon row and incrementing usage_count inside the same transaction
-- makes max_uses=1 safe even when two customers submit simultaneously.
CREATE OR REPLACE FUNCTION public.create_store_order(p_payload jsonb) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path=public,pg_temp AS $$
DECLARE
  it jsonb; p public.products%rowtype; n int;
  sub numeric(10,2):=0; disc numeric(10,2):=0; ship numeric(10,2); total numeric(10,2);
  c public.coupons%rowtype; oid text; tok text; code text;
BEGIN
  IF jsonb_typeof(p_payload->'items') <> 'array' OR jsonb_array_length(p_payload->'items') NOT BETWEEN 1 AND 30 THEN
    RAISE EXCEPTION 'Invalid items';
  END IF;
  IF (SELECT count(DISTINCT value->>'productId') FROM jsonb_array_elements(p_payload->'items')) <> jsonb_array_length(p_payload->'items') THEN
    RAISE EXCEPTION 'Duplicate products';
  END IF;
  FOR it IN SELECT value FROM jsonb_array_elements(p_payload->'items') LOOP
    n := (it->>'quantity')::int;
    IF n < 1 OR n > 50 THEN RAISE EXCEPTION 'Invalid quantity'; END IF;
    SELECT * INTO p FROM public.products WHERE id=(it->>'productId')::uuid AND is_active=true FOR UPDATE;
    IF NOT FOUND OR p.stock<n THEN RAISE EXCEPTION 'Product unavailable or insufficient stock'; END IF;
    sub := sub + p.price*n;
  END LOOP;

  code := nullif(upper(trim(p_payload->>'couponCode')),'');
  IF code IS NOT NULL THEN
    SELECT * INTO c FROM public.coupons
      WHERE coupons.code=code AND is_active
        AND (expires_at IS NULL OR expires_at>now())
        AND (max_uses IS NULL OR usage_count<max_uses)
      FOR UPDATE;
    IF NOT FOUND OR sub<c.min_order_amount THEN RAISE EXCEPTION 'Coupon invalid, expired, exhausted, or ineligible'; END IF;
    IF c.discount_type='percentage' AND c.value>100 THEN RAISE EXCEPTION 'Invalid coupon percentage'; END IF;
    disc := least(sub, round(CASE WHEN c.discount_type='percentage' THEN sub*c.value/100 ELSE c.value END, 2));
  END IF;

  SELECT fee INTO ship FROM public.shipping_rates WHERE governorate=p_payload->>'governorate' AND active;
  IF ship IS NULL THEN RAISE EXCEPTION 'Unsupported delivery area'; END IF;
  IF sub-disc>=1000 THEN ship:=0; END IF;
  total := greatest(0,sub-disc+ship);
  oid := 'HURR-EG-'||upper(substr(encode(gen_random_bytes(5),'hex'),1,8));
  tok := encode(gen_random_bytes(24),'hex');

  INSERT INTO public.orders(id,tracking_token_hash,customer_name,customer_phone,customer_email,governorate,city,detailed_address,notes,payment_method,subtotal,shipping_fee,discount_amount,coupon_code,total_amount)
  VALUES(oid,encode(digest(tok,'sha256'),'hex'),p_payload->>'customerName',p_payload->>'customerPhone',nullif(p_payload->>'customerEmail',''),p_payload->>'governorate',p_payload->>'city',p_payload->>'detailedAddress',nullif(p_payload->>'notes',''),p_payload->>'paymentMethod',sub,ship,disc,code,total);

  FOR it IN SELECT value FROM jsonb_array_elements(p_payload->'items') LOOP
    n := (it->>'quantity')::int;
    SELECT * INTO p FROM public.products WHERE id=(it->>'productId')::uuid FOR UPDATE;
    UPDATE public.products SET stock=stock-n WHERE id=p.id;
    INSERT INTO public.order_items(order_id,product_id,product_name,product_image,selected_size,quantity,unit_price)
    VALUES(oid,p.id,p.name_ar,coalesce(p.images->>0,''),coalesce(it->>'selectedSize',''),n,p.price);
  END LOOP;

  IF code IS NOT NULL THEN
    UPDATE public.coupons SET usage_count=usage_count+1 WHERE coupons.code=code;
  END IF;

  RETURN jsonb_build_object(
    'id',oid,'trackingToken',tok,'subtotal',sub,'shippingFee',ship,
    'discountAmount',disc,'totalAmount',total,'couponCode',code,
    'items',(SELECT coalesce(jsonb_agg(jsonb_build_object('productId',i.product_id,'productName',i.product_name,'productImage',i.product_image,'quantity',i.quantity,'unitPrice',i.unit_price,'totalPrice',i.total_price,'selectedSize',i.selected_size)),'[]'::jsonb) FROM public.order_items i WHERE i.order_id=oid)
  );
END $$;

REVOKE ALL ON FUNCTION public.create_store_order(jsonb) FROM public,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.create_store_order(jsonb) TO service_role;
