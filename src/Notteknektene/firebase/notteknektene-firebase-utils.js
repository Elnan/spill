import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { notteknekteneApp } from "./firebase-config-notteknektene.js";

const notteknekteneDb = getFirestore(notteknekteneApp);

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = doc(notteknekteneDb, "users", userAuth.uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userRef, {
        displayName,
        email,
        createdAt,
        Participating: false,
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }

  return userRef;
};

export const updateUserParticipation = async (userId, participating) => {
  const userRef = doc(notteknekteneDb, "users", userId);
  await updateDoc(userRef, {
    Participating: participating,
  });
};

export const updateUserName = async (userId, newName) => {
  const userRef = doc(notteknekteneDb, "users", userId);
  await updateDoc(userRef, {
    displayName: newName,
  });
};

export const deleteUser = async (userId) => {
  const userRef = doc(notteknekteneDb, "users", userId);
  await deleteDoc(userRef);
};

export const getCurrentRound = async () => {
  const roundDocRef = doc(notteknekteneDb, "Rounds", "currentRound");
  const roundDoc = await getDoc(roundDocRef);
  if (roundDoc.exists()) {
    return roundDoc.data().roundNumber;
  } else {
    await setDoc(roundDocRef, { roundNumber: 1 });
    return 1;
  }
};

// Function to get all participants from Firebase
export const getParticipants = async () => {
  const usersCollection = collection(notteknekteneDb, "users");
  const usersSnapshot = await getDocs(usersCollection);
  const participantsList = usersSnapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((user) => user.participating === true);
  return participantsList;
};

export const getParticipatingUsers = async () => {
  const usersCollection = collection(notteknekteneDb, "users");
  const q = query(usersCollection, where("Participating", "==", true));
  const usersSnapshot = await getDocs(q);
  return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Function to get all submissions from Firebase
export const getSubmissions = async () => {
  const usersCollection = collection(notteknekteneDb, "users");
  const usersSnapshot = await getDocs(usersCollection);
  const submissionsList = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    const userSubmissionsCollection = collection(
      notteknekteneDb,
      `submissions/${userId}/userSubmissions`
    );
    const userSubmissionsSnapshot = await getDocs(userSubmissionsCollection);
    userSubmissionsSnapshot.docs.forEach((submissionDoc) => {
      submissionsList.push({
        id: submissionDoc.id,
        userId: userId,
        ...submissionDoc.data(),
      });
    });
  }

  return submissionsList;
};

export const getSubmissionsForRound = async (roundNumber) => {
  const submissionsCollection = collection(
    notteknekteneDb,
    `submissions/${roundNumber}/userSubmissions`
  );
  const q = query(submissionsCollection);
  const submissionsSnapshot = await getDocs(q);
  return submissionsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
