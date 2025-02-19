import React, { createContext, useState, useEffect } from "react";
import { getFirestore, doc, updateDoc, getDoc } from "firebase/firestore";
import { notteknekteneApp } from "../firebase/firebase-config-notteknektene";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [taskImageUrl, setTaskImageUrl] = useState("");
  const [roundNumber, setRoundNumber] = useState(1);
  const [seasonNumber, setSeasonNumber] = useState(1);
  const [roundData, setRoundData] = useState([]);

  useEffect(() => {
    const fetchCurrentRoundAndSeason = async () => {
      const db = getFirestore(notteknekteneApp);
      const roundDocRef = doc(db, "Rounds", "currentRound");
      const roundDoc = await getDoc(roundDocRef);

      if (roundDoc.exists()) {
        setRoundNumber(roundDoc.data().roundNumber);
        setSeasonNumber(roundDoc.data().seasonNumber || 1);
      }
    };

    fetchCurrentRoundAndSeason();
  }, []);

  const incrementRound = () => {
    const db = getFirestore(notteknekteneApp);
    const roundDocRef = doc(db, "Rounds", "currentRound");

    setRoundNumber((prevRound) => {
      const newRound = prevRound + 1;
      updateDoc(roundDocRef, { roundNumber: newRound });
      return newRound;
    });
  };

  const resetRound = async () => {
    const db = getFirestore(notteknekteneApp);
    const roundDocRef = doc(db, "Rounds", "currentRound");

    setRoundNumber(1);
    await updateDoc(roundDocRef, { roundNumber: 1 });
  };

  return (
    <TaskContext.Provider
      value={{
        taskImageUrl,
        roundNumber,
        setRoundNumber,
        seasonNumber,
        setSeasonNumber,
        roundData,
        setRoundData,
        incrementRound,
        resetRound,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
