import { SAMPLE_SHIPPING_RATES } from '../data/shipping-rates.js';
import { supabase } from '../config/supabase-client.js';
const map=r=>({governorate:r.governorate,rate:Number(r.rate)||0,active:Boolean(r.active)});
const all=async()=>{const {data,error}=await supabase.from('shipping_rates').select('*').order('governorate');if(error)throw new Error(`تعذر تحميل أسعار الشحن: ${error.message}`);return data?.length?data.map(map):SAMPLE_SHIPPING_RATES;};
export const shippingService={list:all,rate:async gov=>(await all()).find(x=>x.governorate===gov&&x.active)?.rate??null,async save(item){const {data,error}=await supabase.from('shipping_rates').upsert({governorate:item.governorate,rate:Number(item.rate)||0,active:Boolean(item.active),updated_at:new Date().toISOString()},{onConflict:'governorate'}).select('*').single();if(error)throw new Error(`تعذر حفظ سعر الشحن: ${error.message}`);return map(data);},async saveAll(rows){for(const item of rows)await this.save(item);}};
