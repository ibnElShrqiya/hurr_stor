# إصلاح خطأ uuid = text في create-order

الخطأ `operator does not exist: uuid = text` كان بسبب مقارنة عمود `products.id` (نوعه UUID) بالنص المستخرج من JSON مباشرة. تم تعديل استعلامات إنشاء الطلب لتستخدم `(it->>'productId')::uuid`.

## التطبيق على Supabase الحالي
1. افتح `supabase/migrations/202610280002_coupon_usage_and_invoice_fix.sql`.
2. انسخ محتوى الملف كاملًا إلى Supabase Dashboard → SQL Editor → New query ثم Run. هذا يعيد تعريف `create_store_order` بالتصحيح. خذ نسخة احتياطية قبل التنفيذ.
3. بعد نجاح SQL، لا يلزم نشر `create-order` مجددًا بسبب هذا التعديل وحده؛ الدالة تستدعي RPC `create_store_order` المخزنة في قاعدة البيانات. (إذا عدّلت ملفات Edge Function لاحقًا، انشرها من CLI.)
4. جرّب طلبًا اختباريًا، ثم تحقق من الفاتورة ومخزون المنتج واستخدام الكوبون.

إذا كانت قيم `productId` المرسلة ليست UUID صالحة، فسيظهر خطأ صيغة UUID؛ يجب حينها التأكد أن الواجهة ترسل `products.id` الحقيقي لكل منتج.
