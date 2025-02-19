import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const juleolConfig = {
  apiKey: "AIzaSyC2e_jn9lPI14Ft7K-EhvnSDSZAJIvBwKo",
  authDomain: "juleol-cfd39.firebaseapp.com",
  projectId: "juleol-cfd39",
  storageBucket: "juleol-cfd39.firebasestorage.app",
  messagingSenderId: "845097189837",
  appId: "1:845097189837:web:3f6c3e4d158cc5e09d8484",
};

const juleolApp = initializeApp(juleolConfig, "juleol");
const juleolAuth = getAuth(juleolApp);
const juleolDb = getFirestore(juleolApp);
const juleolStorage = getStorage(juleolApp);

export { juleolApp, juleolAuth, juleolDb, juleolStorage };
