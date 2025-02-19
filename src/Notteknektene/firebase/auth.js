import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { notteknekteneAuth } from "./firebase-config-notteknektene.js";

const googleProvider = new GoogleAuthProvider();
const notteknekteneDb = getFirestore(notteknekteneAuth.app);

export const doSignInWithEmailAndPassword = async (email, password) => {
  return signInWithEmailAndPassword(notteknekteneAuth, email, password);
};

export const doSignInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(notteknekteneAuth, googleProvider);
    const userRef = doc(notteknekteneDb, "users", result.user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Add user details to Firestore only if the user does not exist
      await setDoc(userRef, {
        email: result.user.email,
        name: result.user.displayName,
        Participating: false,
      });
    }

    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  username
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      notteknekteneAuth,
      email,
      password
    );
    await updateProfile(userCredential.user, {
      displayName: username,
    });
    // Add user details to Firestore
    await setDoc(doc(notteknekteneDb, "users", userCredential.user.uid), {
      email: userCredential.user.email,
      name: username,
      Participating: false,
    });
    return userCredential;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const doSignOut = async () => {
  return notteknekteneAuth.signOut();
};

export const doPasswordReset = async (email) => {
  return sendPasswordResetEmail(notteknekteneAuth, email);
};

export const doPasswordUpdate = async (password) => {
  return updatePassword(notteknekteneAuth.currentUser, password);
};

export const doSendEmailVerification = async () => {
  return sendEmailVerification(notteknekteneAuth.currentUser, {
    url: `${window.location.origin}/signin`,
  });
};

export const doDeleteUser = async () => {
  return deleteUser(notteknekteneAuth.currentUser);
};
