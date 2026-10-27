import { supabase } from '../config/supabase-client.js';
import { productService } from './product-service.js';
const map = r => ({ id: r.id, name: r.name, active: r.active });
export const categoryService = {
  async list() {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw new Error(`تعذر تحميل الأقسام: ${error.message}`);
    return (data || []).map(map);
  },
  async save(category) {
    const row = {
      name: category.name,
      active: Boolean(category.active),
      updated_at: new Date().toISOString()
    };
    const query = category.id
      ? supabase.from('categories').update(row).eq('id', category.id)
      : supabase.from('categories').insert({ ...row, id: crypto.randomUUID() });
    const { data, error } = await query.select('*').single();
    if (error) throw new Error(`تعذر حفظ القسم: ${error.message}`);
    return map(data);
  },
  async remove(id) {
    const used = (await productService.list({ includeUnpublished: true })).some(p => p.categoryId === id);
    if (used) throw Error('لا يمكن حذف قسم مرتبط بمنتجات؛ انقل المنتجات أولاً.');
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(`تعذر حذف القسم: ${error.message}`);
  }
};
