import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { config } from './config.js';
export const configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
export const supabase = configured ? createClient(config.supabaseUrl, config.supabaseAnonKey, {
  auth: { persistSession:true, autoRefreshToken:true, detectSessionInUrl:true }
}) : null;
