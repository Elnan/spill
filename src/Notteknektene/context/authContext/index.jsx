import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { notteknekteneAuth } from "../../firebase/firebase-config-notteknektene.js";
import { createUserProfileDocument } from "../../firebase/notteknektene-firebase-utils";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(notteknekteneAuth, async (user) => {
      if (user) {
        await createUserProfileDocument(user);
        const userDoc = await getDoc(
          doc(getFirestore(notteknekteneAuth.app), "users", user.uid)
        );
        setCurrentUser({ ...user, ...userDoc.data() });
        setUserLoggedIn(true);
        setIsAdmin(user.email === "olavelnan@gmail.com");
      } else {
        setCurrentUser(null);
        setUserLoggedIn(false);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function logout() {
    await signOut(notteknekteneAuth);
    setCurrentUser(null);
    setUserLoggedIn(false);
    setIsAdmin(false);
  }

  const value = {
    currentUser,
    userLoggedIn,
    isAdmin,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
