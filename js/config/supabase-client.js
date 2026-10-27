// إعدادات Supabase العامة للمتصفح. استخدم Publishable key أو anon key فقط.
// لا تضع service_role أو secret key في هذا الملف أو في أي ملف يرسل للمتصفح.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const SUPABASE_URL = 'https://axbumspgqeauqtjrqezu.supabase.co';
// استبدل القيمة بالمفتاح العام من Supabase > Project Settings > API Keys.
const SUPABASE_PUBLISHABLE_KEY = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE';

if (!SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY.startsWith('PASTE_')) {
  console.error('إعداد Supabase ناقص: ضع Publishable/anon key في js/config/supabase-client.js.');
}
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
