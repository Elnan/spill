import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration for Notteknektene
const notteknekteneConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase for Notteknektene
const notteknekteneApp = initializeApp(notteknekteneConfig, "notteknektene");
const notteknekteneAuth = getAuth(notteknekteneApp);
const notteknekteneDb = getFirestore(notteknekteneApp);
const notteknekteneStorage = getStorage(notteknekteneApp);

export {
  notteknekteneApp,
  notteknekteneAuth,
  notteknekteneDb,
  notteknekteneStorage,
};
