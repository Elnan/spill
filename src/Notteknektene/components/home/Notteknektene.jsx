import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/authContext";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { notteknekteneApp } from "../../firebase/firebase-config-notteknektene.js";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import styles from "./Notteknektene.module.css";
import { getUserRank } from "../../utils.js";
import { doSignOut } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";

const Notteknektene = () => {
  const { currentUser } = useAuth();
  const [roundNumber, setRoundNumber] = useState(1);
  const [season, setSeason] = useState(1);
  const [taskStatus, setTaskStatus] = useState("Inactive");
  const [totalRank, setTotalRank] = useState(null);
  const [lastRoundRank, setLastRoundRank] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [timer, setTimer] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentRound = async () => {
      const db = getFirestore(notteknekteneApp);
      const roundDocRef = doc(db, "Rounds", "currentRound");
      const roundDoc = await getDoc(roundDocRef);

      if (roundDoc.exists()) {
        setRoundNumber(roundDoc.data().roundNumber);
        setSeason(roundDoc.data().seasonNumber);
      } else {
        setRoundNumber(1);
        setSeason(1);
      }
    };

    const fetchTaskStatus = async () => {
      const db = getFirestore(notteknekteneApp);
      const taskDocRef = doc(db, "WeeklyTask", "activeTask");
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        setTaskStatus(taskDoc.data().active ? "Active" : "Inactive");
        setDeadline(taskDoc.data().deadline);
      } else {
        setTaskStatus("Inactive");
      }
    };

    const fetchUserRankings = async () => {
      if (currentUser) {
        const db = getFirestore(notteknekteneApp);
        const userDocRef = doc(db, "Rankings", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setTotalRank(userDoc.data().totalRank);
          setLastRoundRank(userDoc.data().lastRoundRank);
        } else {
          setTotalRank(null);
          setLastRoundRank(null);
        }
      }
    };

    const fetchSubmissionStatus = async () => {
      if (currentUser) {
        const db = getFirestore(notteknekteneApp);
        const submissionRef = doc(db, `submissions/${currentUser.displayName}`);
        const submissionDoc = await getDoc(submissionRef);

        if (
          submissionDoc.exists() &&
          submissionDoc.data().status === "submitted"
        ) {
          setTaskStatus("Levert");
        }
      }
    };

    const fetchTotalScores = async () => {
      const db = getFirestore(notteknekteneApp);
      const totalScoresCollection = collection(db, "TotalScores");
      const totalScoresSnapshot = await getDocs(totalScoresCollection);
      const totalScoresList = totalScoresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      if (currentUser) {
        const userRank = getUserRank(totalScoresList, currentUser.displayName);
        setTotalRank(userRank);

        const lastRoundRank = getUserRank(
          totalScoresList,
          currentUser.displayName,
          roundNumber
        );
        setLastRoundRank(lastRoundRank);
      }
    };

    fetchCurrentRound();
    fetchTaskStatus();
    fetchUserRankings();
    fetchSubmissionStatus();
    fetchTotalScores();
  }, [currentUser]);

  useEffect(() => {
    if (deadline) {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const countDownDate = new Date(deadline).getTime();
        const distance = countDownDate - now;

        if (distance < 0) {
          clearInterval(interval);
          setTimer("EXPIRED");
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
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [deadline]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <FaHourglassHalf className={styles.activeIcon} />;
      case "Levert":
        return <FaCheckCircle className={styles.submittedIcon} />;
      default:
        return <FaTimesCircle className={styles.inactiveIcon} />;
    }
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className={styles.notteknekteneContent}>
      <WelcomeMessage
        currentUser={currentUser}
        roundNumber={roundNumber}
        season={season}
        totalRank={totalRank}
      />
      <div className={styles.infoCards}>
        <InfoCard
          title="Oppgavestatus"
          content={`${taskStatus}`}
          icon={getStatusIcon(taskStatus)}
        />
        <InfoCard title="Tid til Deadline" content={timer} />
        <InfoCard
          title="Forrige Runde"
          content={
            <span className={styles.roundRankNumber}>
              {lastRoundRank || "N/A"}.
            </span>
          }
        />
      </div>
      <button onClick={handleLogout} className={styles.logoutButtonMobile}>
        Logg ut
      </button>
    </div>
  );
};

const WelcomeMessage = ({ currentUser, roundNumber, season, totalRank }) => (
  <div className={styles.welcomeMessageContainer}>
    <h1 className={styles.welcomeMessage}>
      Agent {currentUser?.displayName || currentUser?.email}, du ligger på{" "}
      {totalRank !== null ? totalRank : "N/A"}. plass.
    </h1>
    <h2 className={styles.roundNumber}>
      Sesong: {season}, Runde: {roundNumber}
    </h2>
  </div>
);

const InfoCard = ({ title, content, icon }) => (
  <div className={styles.infoCard}>
    <h2>{title}</h2>
    <div className={styles.cardContent}>
      {icon}
      <p>{content}</p>
    </div>
  </div>
);

export default Notteknektene;
