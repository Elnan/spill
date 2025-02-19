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
  const { roundNumber } = useContext(TaskContext);
  const { seasonNumber } = useContext(TaskContext);

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

    fetchSubmissions();
    fetchParticipants();
  }, []);

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

  const calculatePoints = (submission) => {
    if (submission.status === "correct") {
      if (submission.usedHint) {
        return 3;
      } else {
        return 7;
      }
    }
    return 0;
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
      const roundTableRef = doc(notteknekteneDb, `RoundTable/${user.name}`);
      batch.set(roundTableRef, {
        name: user.name,
        openedAt: "",
        submittedAt: "",
        hintUsed: false,
        timeSpent: "",
        points: 0,
      });
    }

    // Oppdater submissions og RoundTable med riktig informasjon

    for (const submission of submissions) {
      const points = calculatePoints(submission);
      const submissionRef = doc(
        notteknekteneDb,
        `submissions/${submission.id}`
      );
      batch.update(submissionRef, {
        points,
        accepted: submission.status === "correct",
      });

      const roundTableRef = doc(notteknekteneDb, `RoundTable/${submission.id}`);
      batch.set(roundTableRef, {
        name: submission.id,
        openedAt: submission.openedAt
          ? submission.openedAt.toDate().toLocaleString()
          : "",
        submittedAt: submission.submittedAt
          ? submission.submittedAt.toDate().toLocaleString()
          : "",
        hintUsed: submission.usedHint,
        timeSpent: submission.timeSpent,
        points: points,
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
