import { SAMPLE_CATEGORIES } from '../data/categories.js';
import { supabase } from '../config/supabase-client.js';
import { productService } from './product-service.js';
const map=r=>({id:r.id,name:r.name,active:r.active});
export const categoryService={
 async list(){const {data,error}=await supabase.from('categories').select('*').order('name');if(error)throw new Error(`تعذر تحميل الأقسام: ${error.message}`);return data?.length?data.map(map):SAMPLE_CATEGORIES;},
 async save(c){const row={name:c.name,active:Boolean(c.active),updated_at:new Date().toISOString()};const q=c.id&&!String(c.id).startsWith('CAT')?supabase.from('categories').update(row).eq('id',c.id):supabase.from('categories').insert(row);const {data,error}=await q.select('*').single();if(error)throw new Error(`تعذر حفظ القسم: ${error.message}`);return map(data);},
 async remove(id){const used=(await productService.list({includeUnpublished:true})).some(p=>p.categoryId===id);if(used)throw Error('لا يمكن حذف قسم مرتبط بمنتجات؛ انقل المنتجات أولاً.');const {error}=await supabase.from('categories').delete().eq('id',id);if(error)throw new Error(`تعذر حذف القسم: ${error.message}`);}
};
