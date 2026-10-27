import { SAMPLE_CATEGORIES } from '../data/categories.js';
import { firestoreService } from './firestore-service.js';
import { productService } from './product-service.js';
export const categoryService = {
  async list() { const rows = await firestoreService.list('categories'); return rows.length ? rows : SAMPLE_CATEGORIES; },
  async save(c) { return firestoreService.save('categories', c); },
  async remove(id) {
    const used = (await productService.list({ includeUnpublished: true })).some(p => p.categoryId === id);
    if (used) throw Error('لا يمكن حذف قسم مرتبط بمنتجات؛ انقل المنتجات أولاً.');
    return firestoreService.remove('categories', id);
  }
};
