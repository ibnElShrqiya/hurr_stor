import { supabase } from '../config/supabase-client.js';

// اسماء الجداول مطابقة لأسماء المجموعات التي كان يستخدمها إصدار Firebase.
export const firestoreService = {
  async list(name, { wherePublished = false, sortField = null } = {}) {
    let request = supabase.from(name).select('*');
    if (wherePublished) request = request.eq('published', true);
    if (sortField) request = request.order(sortField, { ascending: false });
    const { data, error } = await request;
    if (error) throw new Error(`Supabase (${name}): ${error.message}`);
    return data || [];
  },
  async get(name, id) {
    const { data, error } = await supabase.from(name).select('*').eq('id', String(id)).maybeSingle();
    if (error) throw new Error(`Supabase (${name}): ${error.message}`);
    return data;
  },
  async save(name, item, idField = 'id') {
    const id = String(item[idField] || `${name.slice(0, 3).toUpperCase()}${Date.now()}`);
    const data = { ...item, [idField]: id, updatedAt: new Date().toISOString() };
    const { data: saved, error } = await supabase.from(name).upsert(data, { onConflict: idField }).select().single();
    if (error) throw new Error(`Supabase (${name}): ${error.message}`);
    return saved;
  },
  async remove(name, id) {
    const { error } = await supabase.from(name).delete().eq('id', String(id));
    if (error) throw new Error(`Supabase (${name}): ${error.message}`);
  }
};
