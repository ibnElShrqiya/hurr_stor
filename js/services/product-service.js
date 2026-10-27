import { db, auth } from '../config/firebase-client.js';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, where } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const productsRef = collection(db, 'products');
const isAdmin = () => Boolean(auth.currentUser);
async function cloudAll(includeUnpublished = false) {
  const q = includeUnpublished && isAdmin() ? productsRef : query(productsRef, where('published', '==', true));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}
export const productService = {
  async list({ includeUnpublished = false } = {}) {
    try { return await cloudAll(includeUnpublished); }
    catch (error) {
      console.error('Firestore products read failed:', error);
      throw error;
    }
  },
  async get(id) {
    try {
      const snap = await getDoc(doc(db, 'products', String(id)));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (error) { console.error('Firestore product read failed:', error); throw error; }
    return null;
  },
  async save(product) {
    if (!auth.currentUser) throw new Error('سجّل الدخول بحساب مدير معتمد قبل تعديل المنتجات.');
    const id = String(product.id || `P${Date.now()}`);
    await setDoc(doc(db, 'products', id), { ...product, id, updatedAt: new Date().toISOString() }, { merge: true });
    return { ...product, id };
  },
  async remove(id) {
    if (!auth.currentUser) throw new Error('يجب تسجيل الدخول كمدير لحذف المنتجات.');
    await deleteDoc(doc(db, 'products', String(id)));
  },
  async updateStock(id, stock) {
    const p = await this.get(id);
    if (!p) throw new Error('المنتج غير موجود');
    return this.save({ ...p, stock: Math.max(0, Number(stock) || 0) });
  },
  async reset() { throw new Error('إعادة الضبط المحلية لا تُستخدم مع قاعدة بيانات المتجر.'); }
};
