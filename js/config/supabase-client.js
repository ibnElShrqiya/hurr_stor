// إعدادات Supabase العامة للمتجر. استخدم Publishable key أو anon key فقط هنا.
// لا تضع service_role أو secret key في كود المتصفح.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://axbumspgqeauqtjrqezu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'PASTE_YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY_HERE';

if (!SUPABASE_PUBLISHABLE_KEY || SUPABASE_PUBLISHABLE_KEY.includes('PASTE_')) {
  console.warn('Supabase: ضع المفتاح العام للمشروع في js/config/supabase-client.js.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
