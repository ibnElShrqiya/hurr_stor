import { GOVERNORATES } from './governorates.js';
export const SAMPLE_SHIPPING_RATES = GOVERNORATES.map((name,i)=>({governorate:name,rate: i<3?65:(i<15?75:95),active:true}));
