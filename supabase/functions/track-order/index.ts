import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const { id, trackingToken } = await req.json();
    if (typeof id !== 'string' || typeof trackingToken !== 'string' || trackingToken.length < 32) throw new Error('بيانات التتبع غير صحيحة');
    const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } });
    const { data, error } = await db.rpc('track_store_order', { p_id: id, p_token: trackingToken });
    if (error) throw error;
    if (!data) return Response.json({ error: 'لم يتم العثور على الطلب' }, { status: 404, headers: cors });
    return Response.json(data, { headers: cors });
  } catch { return Response.json({ error: 'تعذر العثور على الطلب أو التحقق من رمز التتبع' }, { status: 404, headers: cors }); }
});
