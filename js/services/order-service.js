import { supabase } from '../config/supabase-client.js';
import { cartService } from './cart-service.js';
import { shippingService } from './shipping-service.js';
import { couponService } from './coupon-service.js';
export const orderService = {
  list: async () => {
    const { data, error } = await supabase.from('orders').select('*').order('createdAt', { ascending: false });
    if (error) throw new Error(`Supabase (orders): ${error.message}`);
    return data || [];
  },
  get: async id => {
    const { data, error } = await supabase.from('orders').select('*').eq('id', String(id)).maybeSingle();
    if (error) throw new Error(`Supabase (orders): ${error.message}`);
    return data;
  },
  saveStatus: async (id, status) => {
    const { error } = await supabase.from('orders').update({ status, updatedAt: new Date().toISOString() }).eq('id', String(id));
    if (error) throw new Error(`Supabase (orders): ${error.message}`);
  },
  create: async form => {
    const lines = await cartService.details();
    if (!lines.length) throw new Error('السلة فارغة');
    const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
    const shipping = await shippingService.rate(form.governorate);
    if (shipping === null) throw new Error('لا يوجد سعر شحن متاح للمحافظة المختارة');
    let discount = 0, coupon = null;
    if (form.coupon) {
      const result = await couponService.validate(form.coupon, subtotal);
      if (!result.valid) throw new Error(result.message);
      coupon = result.coupon; discount = result.discount;
    }
    const id = `HR-${Date.now().toString(36).toUpperCase()}`;
    const order = { id, name: String(form.name || '').trim(), phone: String(form.phone || '').trim(), governorate: String(form.governorate || ''), city: String(form.city || '').trim(), address: String(form.address || '').trim(), notes: String(form.notes || '').trim(), items: lines.map(l => ({ productId: l.productId, name: l.product.name, quantity: l.quantity, unitPrice: Number(l.product.currentPrice) || 0 })), subtotal, shipping, discount, coupon: coupon?.code || '', total: Math.max(0, subtotal - discount + shipping), status: 'قيد المراجعة', createdAt: new Date().toISOString(), verificationRequired: true };
    const { error } = await supabase.from('orders').insert(order);
    if (error) throw new Error(`تعذر حفظ الطلب: ${error.message}`);
    cartService.clear(); return order;
  }
};
