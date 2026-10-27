import { supabase } from '../config/supabase-client.js';
import { firestoreService } from './firestore-service.js';
export const productService = {
  async list({ includeUnpublished = false } = {}) {
    return firestoreService.list('products', { wherePublished: !includeUnpublished });
  },
  async get(id) { return firestoreService.get('products', String(id)); },
  async save(product) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('سجّل الدخول بحساب المدير أولاً.');
    return firestoreService.save('products', { ...product, id: String(product.id || `P${Date.now()}`) });
  },
  async remove(id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('سجّل الدخول بحساب المدير أولاً.');
    return firestoreService.remove('products', String(id));
  },
  async updateStock(id, stock) {
    const p = await this.get(id);
    if (!p) throw new Error('المنتج غير موجود');
    return this.save({ ...p, stock: Math.max(0, Number(stock) || 0) });
  },
  async reset() { throw new Error('إعادة الضبط غير متاحة.'); }
};
