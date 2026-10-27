import { db } from '../config/firebase-client.js';
import { collection, getDocs, getDoc, doc, setDoc, query, orderBy, updateDoc } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';
import { cartService } from './cart-service.js';
import { productService } from './product-service.js';
import { shippingService } from './shipping-service.js';
import { couponService } from './coupon-service.js';
const ordersRef=collection(db,'orders');
export const orderService={
 list:async()=>{const snap=await getDocs(query(ordersRef,orderBy('createdAt','desc')));return snap.docs.map(d=>({id:d.id,...d.data()}));},
 get:async id=>{const snap=await getDoc(doc(db,'orders',String(id)));return snap.exists()?{id:snap.id,...snap.data()}:null;},
 saveStatus:async(id,status)=>updateDoc(doc(db,'orders',String(id)),{status,updatedAt:new Date().toISOString()}),
 create:async form=>{
  const lines=await cartService.details();if(!lines.length)throw Error('السلة فارغة');
  const subtotal=lines.reduce((s,l)=>s+l.lineTotal,0);const shipping=await shippingService.rate(form.governorate);if(shipping===null)throw Error('لا يوجد سعر شحن متاح للمحافظة المختارة');
  let discount=0,coupon=null;if(form.coupon){const result=await couponService.validate(form.coupon,subtotal);if(!result.valid)throw Error(result.message);coupon=result.coupon;discount=result.discount;}
  const id=`HR-${Date.now().toString(36).toUpperCase()}`;
  const order={id,name:String(form.name||'').trim(),phone:String(form.phone||'').trim(),governorate:String(form.governorate||''),city:String(form.city||'').trim(),address:String(form.address||'').trim(),notes:String(form.notes||'').trim(),items:lines.map(l=>({productId:l.productId,name:l.product.name,quantity:l.quantity,unitPrice:Number(l.product.currentPrice)||0})),subtotal,shipping,discount,coupon:coupon?.code||'',total:Math.max(0,subtotal-discount+shipping),status:'قيد المراجعة',createdAt:new Date().toISOString(),verificationRequired:true};
  // Public checkout is intentionally marked for manual verification: browser-only code cannot securely validate prices or reserve stock.
  await setDoc(doc(db,'orders',id),order);
  cartService.clear();return order;
 }
};
