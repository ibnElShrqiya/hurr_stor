import { firestoreService } from './firestore-service.js';
const defaults={brandDescription:'علامة عربية فاخرة تنطلق من العطر وتمتد إلى أسلوب الحياة.',phone:'',email:'',whatsappNumber:'',instagram:'',facebook:'',shippingPolicy:'تُراجع تكلفة التوصيل حسب المحافظة قبل تأكيد الطلب.',returnPolicy:'أضف سياسة الاسترجاع المعتمدة قبل الإطلاق.'};
export const settingsService={get:async()=>({...defaults,...(await firestoreService.get('settings','store')||{})}),save:async s=>firestoreService.save('settings',{...defaults,...s,id:'store'},'id')};
