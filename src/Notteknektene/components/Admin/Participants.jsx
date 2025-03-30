import React, { useEffect, useState } from "react";
import useUsers from "../hooks/useUsers";
import {
  updateUserParticipation,
  updateUserName,
  deleteUser,
} from "../../firebase/notteknektene-firebase-utils";
import { useAuth } from "../../context/authContext";
import styles from "./Participants.module.css";

const Participants = () => {
  const { users, loading } = useUsers();
  const { currentUser } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newName, setNewName] = useState("");

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

  const handleNameChange = (userId) => {
    setEditingUserId(userId);
    const user = participants.find((participant) => participant.id === userId);
    setNewName(user.name || "");
  };

  const handleSaveNameChange = async (userId) => {
    try {
      await updateUserName(userId, newName);
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.id === userId
            ? { ...participant, name: newName, displayName: newName }
            : participant
        )
      );
      setEditingUserId(null);
      alert("Name updated successfully.");
    } catch (error) {
      console.error("Error updating name:", error);
      alert("Error updating name.");
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewName("");
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
            {editingUserId === participant.id ? (
              <>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={styles.nameInput}
                />
                <div className={styles.buttonGroup}>
                  <button
                    onClick={() => handleSaveNameChange(participant.id)}
                    className={styles.saveButton}
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className={styles.cancelButton}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span>{participant.name || participant.email}</span>
                <button
                  onClick={() => handleNameChange(participant.id)}
                  className={styles.editButton}
                >
                  Edit
                </button>
              </>
            )}
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
