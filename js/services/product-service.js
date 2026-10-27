import { SAMPLE_PRODUCTS } from '../data/products.js';
import { storage } from './storage-service.js';
const all=()=>storage.get('products',SAMPLE_PRODUCTS);
export const productService={
 async list({includeUnpublished=false}={}){return all().filter(p=>includeUnpublished||p.published)},
 async get(id){return all().find(p=>p.id===id)||null},
 async save(product){const items=all();const i=items.findIndex(p=>p.id===product.id);if(i>=0)items[i]={...items[i],...product};else items.unshift({...product,id:product.id||`P${Date.now()}`});storage.set('products',items);return product},
 async remove(id){storage.set('products',all().filter(p=>p.id!==id));},
 async updateStock(id,stock){const p=all().find(x=>x.id===id);if(!p)throw Error('المنتج غير موجود');p.stock=Math.max(0,Number(stock)||0);storage.set('products',all());return p},
 async reset(){storage.set('products',SAMPLE_PRODUCTS)}
};
