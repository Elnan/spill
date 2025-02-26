import React, { useState, useEffect, useContext } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  setDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { notteknekteneApp } from "../../firebase/firebase-config-notteknektene.js";
import { TaskContext } from "../../context/TaskContext";
import { deleteAllSubmissions, finalizeSeason } from "../../firebase/admin";
import styles from "./WeeklyTask.module.css";

const WeeklyTask = () => {
  const { roundNumber, seasonNumber, setRoundNumber, setSeasonNumber } =
    useContext(TaskContext);
  const [taskName, setTaskName] = useState("");
  const [hint, setHint] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [activeHint, setActiveHint] = useState(null);
  const [activeImageUrl, setActiveImageUrl] = useState(null);
  const [tempRound, setTempRound] = useState(roundNumber);
  const [tempSeason, setTempSeason] = useState(seasonNumber);
  const [deadline, setDeadline] = useState("");
  const [isActive, setIsActive] = useState(false);

  const db = getFirestore(notteknekteneApp);
  const storage = getStorage(notteknekteneApp);

  useEffect(() => {
    const fetchCurrentRound = async () => {
      const roundDocRef = doc(db, "Rounds", "currentRound");
      const roundDoc = await getDoc(roundDocRef);
      if (roundDoc.exists()) {
        const roundData = roundDoc.data();
        setRoundNumber(roundData.roundNumber);
        setSeasonNumber(roundData.seasonNumber);
        setTempRound(roundData.roundNumber);
        setTempSeason(roundData.seasonNumber);
      }
    };

    fetchCurrentRound();
  }, [db, setRoundNumber, setSeasonNumber]);

  useEffect(() => {
    const fetchActiveTask = async () => {
      const taskDocRef = doc(db, "WeeklyTask", "activeTask");
      const taskDoc = await getDoc(taskDocRef);

      if (taskDoc.exists()) {
        setActiveTask(taskDoc.data().taskName);
        setActiveHint(taskDoc.data().hint);
        setActiveImageUrl(taskDoc.data().fileUrl);
        setIsActive(taskDoc.data().active);
      }
    };

    fetchActiveTask();
  }, [db]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!taskName || !file || !hint) {
      alert("Please fill in all fields and select a file.");
      return;
    }

    setUploading(true);

    try {
      const storageRef = ref(
        storage,
        `WeeklyTask/${seasonNumber}/${roundNumber}/${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Archive the current active task
      const activeTaskDocRef = doc(db, "WeeklyTask", "activeTask");
      const activeTaskDoc = await getDoc(activeTaskDocRef);
      if (activeTaskDoc.exists()) {
        const archivedTaskRef = doc(
          db,
          `TaskArchive/season_${seasonNumber}/round_${roundNumber}/task`
        );
        await setDoc(archivedTaskRef, activeTaskDoc.data());
        await updateDoc(archivedTaskRef, { season: seasonNumber });
      }

      // Set the new active task
      await setDoc(activeTaskDocRef, {
        taskName,
        hint,
        fileUrl: url,
        roundNumber,
        season: seasonNumber,
        timestamp: new Date(),
        active: false,
      });

      // Increment the round number
      const newRoundNumber = roundNumber + 1;
      const roundDocRef = doc(db, "Rounds", "currentRound");
      await updateDoc(roundDocRef, { roundNumber: newRoundNumber });
      setRoundNumber(newRoundNumber);

      localStorage.setItem("latestWeeklyTaskImage", url);

      alert("Upload successful!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const endSeason = async () => {
    const confirmation = window.confirm(
      `Det er spilt ${roundNumber} runder denne sesongen. Er du sikker på at du vil avslutte sesongen?`
    );
    if (!confirmation) return;

    await finalizeSeason(seasonNumber, roundNumber);
    setRoundNumber(0);
    setSeasonNumber(seasonNumber + 1);
  };

  const startTask = async () => {
    if (!deadline) {
      alert("Please set a deadline.");
      return;
    }

    const activeTaskDocRef = doc(db, "WeeklyTask", "activeTask");
    await updateDoc(activeTaskDocRef, { active: true, deadline });
    setIsActive(true);

    // Delete all submissions from the "submissions" collection
    await deleteAllSubmissions();

    alert("Task started successfully!");
  };

  const endTask = async () => {
    const activeTaskDocRef = doc(db, "WeeklyTask", "activeTask");
    await updateDoc(activeTaskDocRef, { active: false });
    setIsActive(false);

    alert("Task ended successfully!");
  };

  const handleUpdateRound = async () => {
    const roundDocRef = doc(db, "Rounds", "currentRound");
    await updateDoc(roundDocRef, {
      roundNumber: tempRound,
    });
    setRoundNumber(tempRound);
  };

  const handleUpdateSeason = async () => {
    const roundDocRef = doc(db, "Rounds", "currentRound");
    await updateDoc(roundDocRef, {
      seasonNumber: tempSeason,
    });
    setSeasonNumber(tempSeason);
  };

  return (
    <div className={styles.weeklyTaskContainer}>
      <h1>Weekly Task</h1>
      <div className={styles.cardContainer}>
        <div className={`${styles.card} ${styles.previewCard}`}>
          <h3>Active Task Preview</h3>
          {activeTask && (
            <>
              <p>
                <strong>Task:</strong> {activeTask}
              </p>
              <p>
                <strong>Hint:</strong> {activeHint}
              </p>
              {activeImageUrl && (
                <img
                  src={activeImageUrl}
                  alt="Image that previews the active Task"
                  className={styles.activeTaskImage}
                />
              )}
            </>
          )}
        </div>
        <div className={styles.smallCards}>
          <div className={styles.card}>
            <h3>Current Round: {roundNumber}</h3>
            <label>
              Round Number:
              <input
                type="number"
                value={tempRound}
                onChange={(e) => setTempRound(Number(e.target.value))}
              />
            </label>
            <button onClick={handleUpdateRound}>Update Round</button>
          </div>
          <div className={styles.card}>
            <h3>Current Season: {seasonNumber}</h3>
            <label>
              Season Number:
              <input
                type="number"
                value={tempSeason}
                onChange={(e) => setTempSeason(Number(e.target.value))}
              />
            </label>
            <button onClick={handleUpdateSeason}>Update Season</button>
          </div>
          <div className={styles.xsmallContainer}>
            <div className={`${styles.xsmallCard} ${styles.card}`}>
              <h3>Task Status</h3>
              <div
                className={`${styles.slider} ${
                  isActive ? styles.active : styles.inactive
                }`}
              ></div>
              <span>{isActive ? "Active" : "Inactive"}</span>
            </div>
            <div className={`${styles.xsmallCard} ${styles.card}`}>
              <h3>End Season</h3>
              <button onClick={endSeason}>End Season</button>
            </div>
          </div>
        </div>
        <div className={styles.card}>
          <h3>Set New Task</h3>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Task Name"
            required
          />
          <textarea
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            placeholder="Hint"
            required
          />
          <input type="file" onChange={handleFileChange} required />
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>
        <div className={styles.card}>
          <h3>Set Task Deadline</h3>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
          <button onClick={startTask}>Start Task</button>
          <button onClick={endTask}>End Task</button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyTask;
