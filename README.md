# متجر حُرّ | HURR

متجر عربي متعدد الصفحات مبني بـ HTML وCSS وJavaScript، يستخدم Supabase للمصادقة والبيانات.

## البدء
1. افتح `js/config/supabase-client.js` وضع المفتاح العام Publishable/anon لمشروع Supabase.
2. نفّذ `supabase/migration-existing-project.sql` من SQL Editor بعد مراجعة السكربت.
3. تأكد أن مستخدم المدير موجود في `public.admin_roles` وأن `user_id` يطابق UUID حساب Auth و`role` يساوي `admin`.
4. ارفع الملفات إلى الاستضافة وشغّل الموقع عبر خادم HTTP/HTTPS (وليس فتح ملفات HTML مباشرة).

## الأمان
لا تضع مفاتيح `service_role` أو `secret` في ملفات المتصفح. سياسات RLS هي طبقة الحماية الفعلية؛ لا تعتمد على إخفاء صفحات لوحة الإدارة وحده.
