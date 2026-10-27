import { APP_CONFIG } from '../config/app-config.js';
const key = name => `${APP_CONFIG.storagePrefix}:${name}`;
export const storage = {
 get(name,fallback){try{const raw=localStorage.getItem(key(name));return raw===null?structuredClone(fallback):JSON.parse(raw)}catch{return structuredClone(fallback)}},
 set(name,value){localStorage.setItem(key(name),JSON.stringify(value));},
 remove(name){localStorage.removeItem(key(name));},
 reset(){Object.keys(localStorage).filter(k=>k.startsWith(APP_CONFIG.storagePrefix+':')).forEach(k=>localStorage.removeItem(k));}
};
