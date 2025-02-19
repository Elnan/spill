import React, { useEffect, useState } from "react";
import useUsers from "../hooks/useUsers";
import { updateUserParticipation } from "../../firebase/notteknektene-firebase-utils";
import { useAuth } from "../../context/authContext";
import styles from "./Participants.module.css";

const Participants = () => {
  const { users, loading } = useUsers();
  const { currentUser } = useAuth();
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const filteredUsers = users.filter(
      (user) => user.email !== "olavelnan@gmail.com"
    );
    setParticipants(filteredUsers);
  }, [users]);

  const handleToggleParticipation = (userId) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === userId
          ? { ...participant, Participating: !participant.Participating }
          : participant
      )
    );
  };

  const handleSaveChanges = async () => {
    try {
      for (const participant of participants) {
        await updateUserParticipation(
          participant.id,
          participant.Participating
        );
      }
      alert("Participants updated successfully.");
    } catch (error) {
      console.error("Error updating participants:", error);
      alert("Error updating participants.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.participantsContainer}>
      <h1>Participants</h1>
      <ul className={styles.participantsList}>
        {participants.map((participant) => (
          <li key={participant.id}>
            <span>{participant.displayName || participant.email}</span>
            <button
              onClick={() => handleToggleParticipation(participant.id)}
              className={participant.Participating ? styles.participating : ""}
            >
              {participant.Participating
                ? "Participating"
                : "Not Participating"}
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default Participants;
