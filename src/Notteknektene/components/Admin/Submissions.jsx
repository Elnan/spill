import React, { useState, useEffect, useContext } from "react";
import { getDocs, collection, doc, writeBatch } from "firebase/firestore";
import { notteknekteneDb } from "../../firebase/firebase-config-notteknektene";
import { formatTimeSpent } from "../../utils";
import { TaskContext } from "../../context/TaskContext";
import { updateScores } from "../../firebase/admin";
import styles from "./Submissions.module.css";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [participants, setParticipants] = useState([]);
  const { roundNumber, seasonNumber } = useContext(TaskContext);

  useEffect(() => {
    const fetchSubmissions = async () => {
      const submissionsCollection = collection(notteknekteneDb, "submissions");
      const submissionsSnapshot = await getDocs(submissionsCollection);
      const submissionsList = submissionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(submissionsList);
    };

    const fetchParticipants = async () => {
      const usersCollection = collection(notteknekteneDb, "users");
      const usersSnapshot = await getDocs(usersCollection);

      const participantsList = usersSnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.Participating === true);
      setParticipants(participantsList);
    };

    fetchSubmissions();
    fetchParticipants();
  }, []);

  const calculatePoints = (submission, isFastest) => {
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

  const handleStatusChange = (id, status) => {
    const updated = submissions.map((submission) =>
      submission.id === id
        ? {
            ...submission,
            status,
            accepted: status === "correct",
            points: calculatePoints({ ...submission, status }),
          }
        : submission
    );
    setSubmissions(updated);
  };

  const handleUpdateScores = async () => {
    const batch = writeBatch(notteknekteneDb);

    // Oppdater RoundTable med alle brukere som har participating: true
    for (const user of participants) {
      const userName = user.name || user.displayName;
      const roundTableRef = doc(notteknekteneDb, `RoundTable/${userName}`);
      batch.set(roundTableRef, {
        name: userName,
        openedAt: "",
        submittedAt: "",
        hintUsed: false,
        timeSpent: "",
        points: 0,
        isFastest: false,
      });
    }

    // Finn den raskeste korrekte innsendingen
    const correctSubmissions = submissions.filter(
      (sub) => sub.status === "correct"
    );
    const fastestSubmission = correctSubmissions.reduce((fastest, current) => {
      return !fastest || current.timeSpent < fastest.timeSpent
        ? current
        : fastest;
    }, null);

    // Oppdater submissions og RoundTable med riktig informasjon
    for (const submission of submissions) {
      const isFastest = submission.id === fastestSubmission?.id;
      const points = calculatePoints(submission, isFastest);
      const userName = submission.name || submission.displayName; // Bruk `name` hvis tilgjengelig
      const submissionRef = doc(notteknekteneDb, `submissions/${userName}`);
      batch.update(submissionRef, {
        points,
        accepted: submission.status === "correct",
      });

      const roundTableRef = doc(notteknekteneDb, `RoundTable/${userName}`);
      batch.set(roundTableRef, {
        name: userName,
        openedAt: submission.openedAt
          ? submission.openedAt.toDate().toLocaleString()
          : "",
        submittedAt: submission.submittedAt
          ? submission.submittedAt.toDate().toLocaleString()
          : "",
        hintUsed: submission.usedHint,
        timeSpent: submission.timeSpent,
        points: points,
        isFastest: isFastest,
      });
    }

    await batch.commit();

    alert("Scores updated successfully!");

    // Update total scores table
    await updateScores(submissions, participants, roundNumber, seasonNumber);
  };

  return (
    <div className={styles.submissionsContainer}>
      <h1>Submissions</h1>
      <table className={styles.submissionsTable}>
        <thead>
          <tr>
            <th>Participant</th>
            <th>Answer</th>
            <th>Used Hint</th>
            <th>Time Opened</th>
            <th>Time Submitted</th>
            <th>Time Used</th>
            <th>Status</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.id}</td>
              <td>{submission.answer}</td>
              <td>{submission.usedHint ? "Yes" : "No"}</td>
              <td>
                {submission.openedAt
                  ? submission.openedAt.toDate().toLocaleString()
                  : ""}
              </td>
              <td>
                {submission.submittedAt
                  ? submission.submittedAt.toDate().toLocaleString()
                  : ""}
              </td>
              <td>{formatTimeSpent(submission.timeSpent)}</td>
              <td>
                <select
                  value={submission.status}
                  onChange={(e) =>
                    handleStatusChange(submission.id, e.target.value)
                  }
                >
                  <option value="pending">Pending</option>
                  <option value="correct">Correct</option>
                  <option value="incorrect">Incorrect</option>
                </select>
              </td>
              <td>{submission.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className={styles.updateScoresButton}
        onClick={handleUpdateScores}
      >
        Update Scores
      </button>
    </div>
  );
};

export default Submissions;
