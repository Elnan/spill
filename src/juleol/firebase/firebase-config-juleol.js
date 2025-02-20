import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration for Juleol
const juleolConfig = {
  apiKey: import.meta.env.VITE_JULEOL_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_JULEOL_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_JULEOL_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_JULEOL_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_JULEOL_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_JULEOL_FIREBASE_APP_ID,
};

// Initialize Firebase for Juleol
const juleolApp = initializeApp(juleolConfig, "juleol");
const juleolAuth = getAuth(juleolApp);
const juleolDb = getFirestore(juleolApp);
const juleolStorage = getStorage(juleolApp);

export { juleolApp, juleolAuth, juleolDb, juleolStorage };
