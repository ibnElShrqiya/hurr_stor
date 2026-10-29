import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Content-Type': 'application/json; charset=utf-8' };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return Response.json({ error: 'Method not allowed' }, { status: 405, headers: cors });
  try {
    const payload = await req.json();
    const required = ['customerName','customerPhone','governorate','city','detailedAddress','paymentMethod'];
    if (required.some((k) => typeof payload[k] !== 'string' || !payload[k].trim()) || !Array.isArray(payload.items)) throw new Error('بيانات الطلب غير مكتملة');
    if (payload.customerName.length > 120 || payload.city.length > 120 || payload.governorate.length > 120 || payload.detailedAddress.length > 600 || (payload.notes?.length ?? 0) > 500) throw new Error('بعض بيانات الطلب أطول من المسموح');
    if (!/^(010|011|012|015)\d{8}$/.test(payload.customerPhone.replace(/\s/g, ''))) throw new Error('رقم الهاتف غير صالح');
    if (payload.customerEmail != null && (typeof payload.customerEmail !== 'string' || payload.customerEmail.length > 254)) throw new Error('البريد الإلكتروني غير صالح');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[create-order] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY secret');
      return Response.json({ error: 'خدمة الطلبات غير مكتملة الإعداد على الخادم. يرجى التواصل مع إدارة المتجر.' }, { status: 500, headers: cors });
    }
    const db = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
    const { data, error } = await db.rpc('create_store_order', { p_payload: payload });
    if (error) {
      console.error('[create-order] Database RPC failed', { message: error.message, code: error.code, details: error.details, hint: error.hint });
      throw new Error(error.message || 'تعذر حفظ الطلب في قاعدة البيانات');
    }
    return Response.json(data, { headers: cors });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'تعذر إنشاء الطلب';
    console.error('[create-order] Request rejected', message);
    return Response.json({ error: message }, { status: 400, headers: cors });
  }
});
