import { SAMPLE_SHIPPING_RATES } from '../data/shipping-rates.js';
import { firestoreService } from './firestore-service.js';
const all=async()=>{const rows=await firestoreService.list('shipping');return rows.length?rows:SAMPLE_SHIPPING_RATES;};
export const shippingService={list:all,rate:async gov=>(await all()).find(x=>x.governorate===gov&&x.active)?.rate??null,save:async item=>firestoreService.save('shipping',item, 'governorate'),saveAll:async rows=>{for(const item of rows)await firestoreService.save('shipping',item,'governorate');}};
