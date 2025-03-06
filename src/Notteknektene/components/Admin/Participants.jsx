import React, { useEffect, useState } from "react";
import useUsers from "../hooks/useUsers";
import { updateUserParticipation, updateUserName, deleteUser } from "../../firebase/notteknektene-firebase-utils";
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

  const handleNameChange = (userId, newName) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) =>
        participant.id === userId
          ? { ...participant, displayName: newName }
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
        await updateUserName(participant.id, participant.displayName);
      }
      alert("Participants updated successfully.");
    } catch (error) {
      console.error("Error updating participants:", error);
      alert("Error updating participants.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setParticipants((prevParticipants) =>
        prevParticipants.filter((participant) => participant.id !== userId)
      );
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user.");
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
            <input
              type="text"
              value={participant.displayName || ""}
              onChange={(e) => handleNameChange(participant.id, e.target.value)}
              className={styles.nameInput}
            />
            <span>{participant.email}</span>
            <button
              onClick={() => handleToggleParticipation(participant.id)}
              className={participant.Participating ? styles.participating : ""}
            >
              {participant.Participating
                ? "Participating"
                : "Not Participating"}
            </button>
            <button
              onClick={() => handleDeleteUser(participant.id)}
              className={styles.deleteButton}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleSaveChanges}>Save Changes</button>
    </div>
  );
};

export default Participants;
