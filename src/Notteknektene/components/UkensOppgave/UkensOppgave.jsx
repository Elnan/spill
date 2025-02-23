import React, { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../../context/authContext";
import { notteknekteneApp } from "../../firebase/firebase-config-notteknektene.js";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import styles from "./UkensOppgave.module.css";

const UkensOppgave = () => {
  const [taskImageUrl, setTaskImageUrl] = useState(null);
  const [timer, setTimer] = useState("");
  const [answer, setAnswer] = useState("");
  const [taskOpen, setTaskOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [status, setStatus] = useState(null);
  const [task, setTask] = useState(null);
  const [hint, setHint] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [deadline, setDeadline] = useState(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [openedAt, setOpenedAt] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showTimer, setShowTimer] = useState(true);
  const [isTimerLoaded, setIsTimerLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { currentUser } = useAuth();
  const db = getFirestore(notteknekteneApp);

  useEffect(() => {
    const fetchTask = async () => {
      const taskDocRef = doc(db, "WeeklyTask", "activeTask");
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        setTask(taskData.taskName);
        setHint(taskData.hint);
        setTaskImageUrl(taskData.fileUrl);
        setIsActive(taskData.active);
        setDeadline(taskData.deadline);

        // Check if the deadline has passed
        if (taskData.deadline && new Date(taskData.deadline) < new Date()) {
          setIsActive(false);
          await updateDoc(taskDocRef, { active: false });
        }
      }
    };

    const fetchUserSubmission = async () => {
      if (currentUser) {
        const submissionRef = doc(db, `submissions/${currentUser.displayName}`);
        const submissionDoc = await getDoc(submissionRef);

        if (submissionDoc.exists()) {
          const submissionData = submissionDoc.data();
          setTaskOpen(true);
          setHintUsed(submissionData.usedHint);
          setShowHint(submissionData.usedHint);
          setOpenedAt(submissionData.openedAt.toDate());
          if (submissionData.status === "submitted") {
            setSubmitted(true);
            setConfirmationMessage("Du har svart på ukens oppgave");
          }
        }
      }
    };

    const loadData = async () => {
      await fetchTask();
      await fetchUserSubmission();
      // await timer();
      setIsLoading(false);
    };

    loadData();
  }, [db, currentUser, currentRound]);

  useEffect(() => {
    if (deadline) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const countDownDate = new Date(deadline).getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimer("EXPIRED");
          setIsActive(false);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimer(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
        setIsTimerLoaded(true); // Sett isTimerLoaded til true når timeren er lastet inn
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deadline]);

  const handleOpenTask = async () => {
    if (!currentUser) {
      console.error("User is not logged in");
      return;
    }

    try {
      const submissionRef = doc(db, `submissions/${currentUser.displayName}`);

      const docSnap = await getDoc(submissionRef);
      if (!docSnap.exists()) {
        console.log("Document does not exist, creating a new one.");
        await setDoc(submissionRef, {
          userId: currentUser.uid,
          openedAt: serverTimestamp(),
          timeSpent: 0,
          usedHint: false,
          accepted: null,
          points: 0,
        });
      } else {
        console.log("Document exists, updating the openedAt timestamp.");
        await updateDoc(submissionRef, {
          openedAt: serverTimestamp(),
        });
      }

      setTaskOpen(true);
      setOpenedAt(new Date());
    } catch (error) {
      console.error("Error opening task:", error);
    }
  };

  const handleUseHint = async () => {
    if (!currentUser) {
      console.error("User is not logged in");
      return;
    }

    try {
      const submissionRef = doc(db, `submissions/${currentUser.displayName}`);

      await updateDoc(submissionRef, {
        usedHint: true,
      });

      setHintUsed(true);
      setShowHint(true);
    } catch (error) {
      console.error("Error using hint:", error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentUser) {
      console.error("User is not logged in");
      return;
    }

    try {
      const submissionRef = doc(db, `submissions/${currentUser.displayName}`);

      const docSnap = await getDoc(submissionRef);
      const submissionData = docSnap.data();

      const submittedAt = new Date();
      const timeSpent = (submittedAt - openedAt) / 1000; // Time spent in seconds

      await updateDoc(submissionRef, {
        answer,
        submittedAt: serverTimestamp(),
        status: "submitted",
        usedHint: hintUsed,
        accepted: false,
        points: 0,
        timeSpent,
      });

      setSubmitted(true);
      setStatus("submitted");
      setTaskOpen(false);
      setConfirmationMessage("Svaret ditt er sendt inn!");
    } catch (error) {
      console.error("Error submitting answer:", error);
    }
  };

  if (isLoading) {
    return null;
  }

  if (!isActive) {
    return <div className={styles.taskInactive}>Oppgaven er ikke aktiv.</div>;
  }

  return (
    <div className={styles.container}>
      <div
        className={`${styles.timerContainer} ${showTimer ? "" : styles.timerClosed}`}
      >
        <span className={styles.timer}>{timer}</span>
        <button
          className={showTimer ? styles.closeButton : styles.openButton}
          onClick={() => setShowTimer(!showTimer)}
        >
          {showTimer ? "Lukk" : "Timer"}
        </button>
      </div>
      <div className={styles.taskContainer}>
        <h1 className={styles.title}>Ukens Oppgave</h1>
        <div className={styles.taskCard}>
          {submitted ? (
            <div className={styles.submissionMessage}>
              <IoCheckmarkCircleOutline size={48} color="green" />
              <p>Du har svart på ukens oppgave</p>
            </div>
          ) : !taskOpen ? (
            <button className={styles.taskButton} onClick={handleOpenTask}>
              Open Task
            </button>
          ) : (
            <>
              {taskImageUrl ? (
                <img
                  src={taskImageUrl}
                  alt="Task"
                  className={`${styles.taskImage} ${
                    isFullscreen ? styles.fullscreen : ""
                  }`}
                  onClick={() => setIsFullscreen(!isFullscreen)}
                />
              ) : (
                <p>No task image available</p>
              )}
              <p>
                <strong>Oppgavenavn:</strong> {task}
              </p>

              {showHint && (
                <p>
                  <strong>Hint:</strong> {hint}
                </p>
              )}
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Skriv svaret ditt her..."
                className={styles.answerInput}
              />
              <div className={styles.buttonContainer}>
                <button
                  className={styles.submitButton}
                  onClick={handleSubmitAnswer}
                  disabled={submitted}
                >
                  {submitted ? "Answer Submitted" : "Submit Answer"}
                </button>
                <button
                  className={styles.hintButton}
                  onClick={handleUseHint}
                  disabled={hintUsed}
                >
                  {hintUsed ? "Hint brukt" : "Bruk hint"}
                </button>
              </div>
              {submitted && <p>Status: {status}</p>}
              {confirmationMessage && (
                <p className={styles.confirmationMessage}>
                  {confirmationMessage}
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UkensOppgave;
