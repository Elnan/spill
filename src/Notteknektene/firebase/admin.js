import { notteknekteneDb } from "./firebase-config-notteknektene";
import {
  collection,
  getDocs,
  doc,
  writeBatch,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// Function to calculate points for a submission
export const calculatePoints = (submission, isFastest) => {
  let points = 0;
  if (submission.status === "correct") {
    if (submission.usedHint) {
      points = 4;
    } else {
      points = 7;
    }
    if (isFastest) {
      points += 1; // Add bonus point for the fastest correct submission
    }
  }
  return points;
};

// Function to update scores in Firebase and RoundTable collection
export const updateScores = async (
  updatedSubmissions,
  participants,
  roundNumber,
  seasonNumber
) => {
  const batch = writeBatch(notteknekteneDb);

  const scoresMap = new Map();

  // Finn den raskeste korrekte innsendingen
  const correctSubmissions = updatedSubmissions.filter(
    (sub) => sub.status === "correct"
  );
  const fastestSubmission = correctSubmissions.reduce((fastest, current) => {
    return !fastest || current.timeSpent < fastest.timeSpent
      ? current
      : fastest;
  }, null);

  for (const participant of participants) {
    const participantName = participant.name;
    const submission = updatedSubmissions.find(
      (sub) => sub.userId === participant.id
    );
    const isFastest = submission && submission.id === fastestSubmission?.id;
    const points = submission ? calculatePoints(submission, isFastest) : 0;

    const totalScoresRef = doc(
      notteknekteneDb,
      `TotalScores/${participantName}`
    );
    const totalScoresDoc = await getDoc(totalScoresRef);

    let scores = [];
    if (totalScoresDoc.exists()) {
      scores = totalScoresDoc.data().scores;
    } else {
      scores = Array(roundNumber).fill(0); // Initialize scores array with zeros
    }

    // Add points for the new round
    scores[roundNumber - 1] = points;

    // Replace undefined values with zeros
    scores = scores.map((score) => (score === undefined ? 0 : score));

    scoresMap.set(participantName, scores);

    batch.set(totalScoresRef, {
      name: participantName,
      scores: scores,
    });

    if (submission) {
      // Archive submissions
      const archiveRef = doc(
        notteknekteneDb,
        `archivedSubmissions/season_${seasonNumber}/round_${roundNumber}/${submission.id}`
      );
      batch.set(archiveRef, submission);

      // Update submission with points and status
      const submissionRef = doc(
        notteknekteneDb,
        `submissions/${submission.id}`
      );
      const submissionDoc = await getDoc(submissionRef);
      if (submissionDoc.exists()) {
        batch.update(submissionRef, {
          points,
          accepted: submission.status === "correct",
          isFastest, // Mark if this is the fastest correct submission
        });
      } else {
        console.error(`No document to update: ${submissionRef.path}`);
        batch.set(submissionRef, submission);
      }
    }
  }

  await batch.commit();
  console.log("Total scores updated successfully!");
};

// Function to finalize the season
export const finalizeSeason = async (seasonNumber, roundNumber) => {
  const batch = writeBatch(notteknekteneDb);

  // Archive the current active task
  const activeTaskDocRef = doc(notteknekteneDb, "WeeklyTask", "activeTask");
  const activeTaskDoc = await getDoc(activeTaskDocRef);
  if (activeTaskDoc.exists()) {
    const archivedTaskRef = doc(
      notteknekteneDb,
      `TaskArchive/season_${seasonNumber}/round_${roundNumber}/task`
    );
    await setDoc(archivedTaskRef, activeTaskDoc.data());
  }

  // Archive TotalScores
  const totalScoresCollection = collection(notteknekteneDb, "TotalScores");
  const totalScoresSnapshot = await getDocs(totalScoresCollection);
  totalScoresSnapshot.docs.forEach((docSnapshot) => {
    const data = docSnapshot.data();
    const sum = data.scores.reduce((acc, score) => acc + score, 0);
    const archiveRef = doc(
      notteknekteneDb,
      `ArchivedTotalScores/season_${seasonNumber}/participants/${docSnapshot.id}`
    );
    batch.set(archiveRef, { ...data, sum });
  });

  // Clear RoundTable collection
  const roundTableCollection = collection(notteknekteneDb, "RoundTable");
  const roundTableSnapshot = await getDocs(roundTableCollection);
  roundTableSnapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  // Clear TotalScores collection
  totalScoresSnapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  // Clear submissions collection
  const submissionsCollection = collection(notteknekteneDb, "submissions");
  const submissionsSnapshot = await getDocs(submissionsCollection);
  submissionsSnapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  // Clear active task
  await deleteDoc(activeTaskDocRef);

  // Update season and round numbers
  const roundDocRef = doc(notteknekteneDb, "Rounds", "currentRound");
  await updateDoc(roundDocRef, {
    roundNumber: 0,
    seasonNumber: seasonNumber + 1,
  });

  await batch.commit();
  alert("Season ended successfully!");
};

// Function to clear RoundTable collection
export const clearRoundTable = async (currentRound) => {
  const roundTableCollection = collection(
    notteknekteneDb,
    `RoundTable/Runde${currentRound}/users`
  );
  const roundTableSnapshot = await getDocs(roundTableCollection);
  const batch = writeBatch(notteknekteneDb);
  roundTableSnapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });
  await batch.commit();
};

// Function to delete all submissions
export const deleteAllSubmissions = async () => {
  const submissionsCollection = collection(notteknekteneDb, "submissions");
  const submissionsSnapshot = await getDocs(submissionsCollection);
  const batch = writeBatch(notteknekteneDb);
  submissionsSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log("All submissions deleted successfully!");
};
