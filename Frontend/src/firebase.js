// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase - usar window.env o process.env según disponibilidad
// ⚠️ SINCRONIZADO CON BACKEND - Proyecto: runsolutions-financiero
const firebaseConfig = {
  apiKey: window.env?.REACT_APP_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBDK3sGMTZO5ha9EGPRfcHER_ZTOZe8ZqE",
  authDomain: window.env?.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "runsolutions-financiero.firebaseapp.com",
  projectId: window.env?.REACT_APP_FIREBASE_PROJECT_ID || process.env.REACT_APP_FIREBASE_PROJECT_ID || "runsolutions-financiero",
  storageBucket: window.env?.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "runsolutions-financiero.appspot.com",
  messagingSenderId: window.env?.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "376021084293",
  appId: window.env?.REACT_APP_FIREBASE_APP_ID || process.env.REACT_APP_FIREBASE_APP_ID || "1:376021084293:web:01ff897bf75192fc6721ec",
  measurementId: window.env?.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-REM9RBGG2Z",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
