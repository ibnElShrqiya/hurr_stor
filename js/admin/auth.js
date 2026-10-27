import { notify } from '../components/notifications.js';
import { supabase } from '../config/supabase-client.js';

async function hasAdminRole(user) {
  if (!user) return false;
  const { data, error } = await supabase.from('admin_roles').select('role').eq('user_id', user.id).maybeSingle();
  if (error) throw new Error(`تعذر التحقق من صلاحية المدير: ${error.message}`);
  return data?.role === 'admin';
}
export const adminAuth = {
  isLoggedIn: async () => { const { data } = await supabase.auth.getUser(); return Boolean(data.user); },
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message === 'Invalid login credentials' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' : error.message);
    try {
      if (!(await hasAdminRole(data.user))) {
        await supabase.auth.signOut();
        throw new Error('الحساب غير مخوّل للإدارة. تأكد من وجود سجل في admin_roles بنفس user_id وقيمة role = admin.');
      }
    } catch (e) { if (!String(e.message).includes('غير مخوّل')) await supabase.auth.signOut(); throw e; }
    return true;
  },
  logout: async () => { await supabase.auth.signOut(); location.href = 'index.html'; },
  guard: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) { location.replace('index.html'); return false; }
    try { if (await hasAdminRole(data.user)) return true; } catch (e) { console.error(e); }
    await supabase.auth.signOut(); location.replace('index.html'); return false;
  }
};
export function bindLogin() {
  document.querySelector('#admin-login-form')?.addEventListener('submit', async e => {
    e.preventDefault(); const form=e.currentTarget, data=new FormData(form), button=form.querySelector('button[type="submit"],button:not([type])');
    if(button) button.disabled=true;
    try { await adminAuth.login(String(data.get('email')).trim(), String(data.get('password'))); location.href='dashboard.html'; }
    catch(error) { notify(error.message || 'تعذر تسجيل الدخول. راجع إعدادات Supabase Auth وRLS.', 'error'); }
    finally { if(button) button.disabled=false; }
  });
}
