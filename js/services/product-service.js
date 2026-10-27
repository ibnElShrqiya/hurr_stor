import { auth, db } from '../config/firebase-client.js';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
const productsRef = collection(db, 'products');
export const productService = {
  async list({ includeUnpublished = false } = {}) {
    const q = includeUnpublished ? productsRef : query(productsRef, where('published', '==', true));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async get(id) {
    const snap = await getDoc(doc(db, 'products', String(id)));
    if (snap.exists()) return { id: snap.id, ...snap.data() };
    return null;
  },
  async save(product) {
    if (!auth.currentUser) throw new Error('سجّل الدخول بحساب المدير أولاً.');
    const id = String(product.id || `P${Date.now()}`);
    const data = { ...product, id, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, 'products', id), data, { merge: true });
    return data;
  },
  async remove(id) {
    if (!auth.currentUser) throw new Error('سجّل الدخول بحساب المدير أولاً.');
    await deleteDoc(doc(db, 'products', String(id)));
  },
  async updateStock(id, stock) {
    const p = await this.get(id);
    if (!p) throw new Error('المنتج غير موجود');
    return this.save({ ...p, stock: Math.max(0, Number(stock) || 0) });
  },
  async reset() { throw new Error('إعادة الضبط غير متاحة مع قاعدة بيانات المتجر.'); }
};
