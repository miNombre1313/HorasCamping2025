// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// (Opcional) import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCKyFJ8C5VPY77r8FURuojEN6hd_x9CQyY",
  authDomain: "horascamping2025.firebaseapp.com",
  projectId: "horascamping2025",
  storageBucket: "horascamping2025.appspot.com", // <- REVISADO, antes tenía .app en lugar de .appspot.com
  messagingSenderId: "86910353141",
  appId: "1:86910353141:web:aceb6eed619658494b4fbc",
  measurementId: "G-RP8911LRTE"
};

const app = initializeApp(firebaseConfig);

// Exportaciones con nombre (recomendadas)
export const db = getFirestore(app);
export const auth = getAuth(app);
// export const analytics = getAnalytics(app); // si lo usas

// ✅ Exportación por defecto para compatibilidad con archivos antiguos
export default db;

