import { SAMPLE_COUPONS } from '../data/coupons.js';
import { firestoreService } from './firestore-service.js';
const all = async()=>{const rows=await firestoreService.list('coupons');return rows.length?rows:SAMPLE_COUPONS;};
export const couponService = {
 list: all, save: async c=>firestoreService.save('coupons',c), remove: async id=>firestoreService.remove('coupons',id),
 validate: async(code,subtotal)=>{const coupons=await all();const c=coupons.find(x=>String(x.code).toUpperCase()===String(code).trim().toUpperCase());const today=new Date().toISOString().slice(0,10);if(!c||!c.active||(c.startDate&&today<c.startDate)||(c.endDate&&today>c.endDate)||(Number(c.used)||0)>=(Number(c.maxUses)||Infinity)||subtotal<(Number(c.minOrder)||0))return {valid:false,message:'الكوبون غير صالح أو لا تنطبق شروطه.'};return {valid:true,coupon:c,discount:c.type==='percent'?Math.round(subtotal*Number(c.value)/100):Math.min(subtotal,Number(c.value))};}
};
