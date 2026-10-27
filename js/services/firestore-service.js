import { db } from '../config/firebase-client.js';
import { collection, getDocs, getDoc, doc, setDoc, deleteDoc, query, where, orderBy } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

export const firestoreService = {
  async list(name, { wherePublished = false, sortField = null } = {}) {
    let q = collection(db, name);
    if (wherePublished) q = query(q, where('published', '==', true));
    if (sortField) q = query(q, orderBy(sortField, 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  },
  async get(name, id) {
    const snap = await getDoc(doc(db, name, String(id)));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  },
  async save(name, item, idField = 'id') {
    const id = String(item[idField] || `${name.slice(0, 3).toUpperCase()}${Date.now()}`);
    const data = { ...item, [idField]: id, updatedAt: new Date().toISOString() };
    await setDoc(doc(db, name, id), data, { merge: true });
    return data;
  },
  async remove(name, id) { await deleteDoc(doc(db, name, String(id))); }
};
