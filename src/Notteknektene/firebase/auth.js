import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  updatePassword,
  sendEmailVerification,
  deleteUser,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { notteknekteneAuth } from "./firebase-config-notteknektene.js";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});
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
        displayName: result.user.displayName, // Set displayName
        Participating: false,
      });
    } else {
      // Update displayName if it is not set
      if (!userDoc.data().displayName) {
        await updateProfile(result.user, {
          displayName: result.user.displayName,
        });
        await setDoc(userRef, {
          ...userDoc.data(),
          displayName: result.user.displayName,
        });
      }
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
      displayName: username, // Set displayName
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
