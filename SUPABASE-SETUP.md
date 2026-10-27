# إعداد Supabase لمتجر حُرّ

## 1. مفتاح الاتصال
- عنوان المشروع مضبوط في `js/config/supabase-client.js` على `https://axbumspgqeauqtjrqezu.supabase.co`.
- ضع المفتاح العام `Publishable key` أو `anon` فقط مكان `PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE`.
- لا تضع `service_role` أو `secret key` في الواجهة أو المستودع.

## 2. ترحيل قاعدة البيانات
من Supabase Dashboard افتح SQL Editor، ثم شغّل محتوى `supabase/migration-existing-project.sql`. السكربت يضيف الأعمدة والجداول اللازمة للواجهة ويحافظ على الجداول الحالية.

## 3. حساب المدير
يستخدم الموقع Supabase Auth و`public.admin_roles`. حساب المدير الحالي يجب أن يكون في `admin_roles` مع `user_id` مطابقًا تمامًا لمعرّف المستخدم في Authentication > Users و`role = 'admin'`. لا تسمح للزوار بتعديل هذا الجدول. دالة `public.is_hurr_admin()` وسياسات جدول المنتجات الحالية تُستخدم كما هي.

## 4. ملاحظات التشغيل
- جميع عمليات الإدارة تحتاج تسجيل الدخول وصلاحية المدير وسياسات RLS الصحيحة.
- اختبر تسجيل الدخول، إنشاء منتج، تعديله، نشره وإخفاءه من المتجر بعد تنفيذ الترحيل.
- لا تُعدّ الطلبات والدفع الإلكتروني جاهزين تجاريًا قبل اختبار مخطط `orders` و`order_items` وسياسات إنشاء الطلب والتحقق الخادمي من الأسعار والمخزون.
