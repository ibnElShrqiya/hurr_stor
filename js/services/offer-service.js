import { SAMPLE_OFFERS } from '../data/offers.js';
import { firestoreService } from './firestore-service.js';
export const offerService = {
 async list({activeOnly=false}={}) { const rows=await firestoreService.list('offers'); const data=rows.length?rows:SAMPLE_OFFERS; const today=new Date().toISOString().slice(0,10); return data.filter(o=>!activeOnly||(o.active&&(!o.startDate||o.startDate<=today)&&(!o.endDate||o.endDate>=today))); },
 save: async o=>firestoreService.save('offers',o), remove: async id=>firestoreService.remove('offers',id)
};
