export const productNames = ['الصديق', 'الفاروق', 'حفيدات عائشة'];
export const money = value => new Intl.NumberFormat('ar-EG', { style:'currency', currency:'EGP', maximumFractionDigits:0 }).format(value);
export const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
