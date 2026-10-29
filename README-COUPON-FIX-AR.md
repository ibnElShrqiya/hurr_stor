# إصلاح الكوبونات في متجر حُرّ

## سبب الخطأ الأخير

الجدول الحالي يفرض قيمة غير فارغة في `discount_percent`، بينما نموذج الإدارة كان يرسل الحقول الجديدة (`discount_type` و`value`) فقط. تم تعديل نموذج الحفظ ليملأ `discount_percent` أيضًا، مع إبقاء `value` و`discount_type` مصدر الحقيقة للحساب.

## مهم قبل النشر

1. خذ نسخة احتياطية من قاعدة بيانات Supabase.
2. افتح `supabase/migrations/202610280002_coupon_usage_and_invoice_fix.sql` وانسخ الملف كاملًا إلى Supabase SQL Editor ثم نفّذه مرة واحدة. لا تنفذ أسطرًا متفرقة فقط؛ الترحيل يضيف الأعمدة الحديثة المطلوبة (`discount_type`, `value`, `min_order_amount`, `usage_count`, `max_uses`, `description`) ويحافظ على العمود القديم `discount_percent`.
3. انشر دالة `supabase/functions/create-order/index.ts` بعد التأكد أن محتواها متوافق مع دالة قاعدة البيانات `create_store_order` المعرفة في الترحيل. إذا تستخدم Supabase CLI من جذر المشروع: `supabase functions deploy create-order`.
4. ابنِ الواجهة وانشرها: `npm install` ثم `npm run lint` ثم `npm run build`.
5. اختبر بكوبون جديد بحد استخدام `1`: تحقق من الخصم في الفاتورة، ومن `orders.discount_amount` و`orders.total_amount`، ثم تأكد أن استخدام الكوبون مرة ثانية يُرفض.

## ما الذي تغيّر في هذه النسخة؟

- إضافة `discount_percent` إلى بيانات الإدخال، لتلبية قيد `NOT NULL` في قواعد البيانات القديمة.
- تعديل الترحيل ليضيف `discount_percent` أيضًا في القواعد الجديدة التي لا تحتوي عليه، مع إبقاء الحقول الحديثة اللازمة لحساب الخصم وحد الاستخدام.

لم يتم الاتصال بقاعدة البيانات الحية أو نشر الملفات من هنا. يجب تنفيذ الترحيل ونشر الوظيفة والواجهة في مشروعك، ثم إجراء اختبار طلب فعلي.
