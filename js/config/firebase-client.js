// إعدادات Firebase العامة لتطبيق الويب. لا تضع هنا مفاتيح خدمة إدارية أو أسرار خادمية.
import { initializeApp, getApps, getApp } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCKpBVrFUoT8f73R9fEdlYMOlJ4ZWLpTcQ',
  authDomain: 'hurr-stor.firebaseapp.com',
  projectId: 'hurr-stor',
  storageBucket: 'hurr-stor.firebasestorage.app',
  messagingSenderId: '665597694320',
  appId: '1:665597694320:web:9b6119c55dc6dc164b7fb5',
  measurementId: 'G-6RPQJ3STD1'
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
