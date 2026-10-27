import { notify } from '../components/notifications.js';
import { auth } from '../config/firebase-client.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';

export const adminAuth = {
  isLoggedIn: () => Boolean(auth.currentUser),
  login: async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdTokenResult(true);
    if (token.claims.admin !== true) {
      await signOut(auth);
      throw new Error('هذا الحساب غير مخوّل لإدارة المتجر.');
    }
    return true;
  },
  logout: async () => { await signOut(auth); location.href = 'index.html'; },
  guard: () => new Promise(resolve => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      unsubscribe();
      if (!user) { location.replace('index.html'); resolve(false); return; }
      try {
        const token = await user.getIdTokenResult();
        if (token.claims.admin === true) resolve(true);
        else { await signOut(auth); location.replace('index.html'); resolve(false); }
      } catch { location.replace('index.html'); resolve(false); }
    });
  })
};
export function bindLogin() {
  document.querySelector('#admin-login-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const button = form.querySelector('button[type="submit"],button:not([type])');
    if (button) button.disabled = true;
    try {
      await adminAuth.login(String(data.get('email')).trim(), String(data.get('password')));
      location.href = 'dashboard.html';
    } catch (error) {
      notify(error?.code === 'auth/invalid-credential' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : (error.message || 'تعذر تسجيل الدخول.'), 'error');
    } finally { if (button) button.disabled = false; }
  });
}
