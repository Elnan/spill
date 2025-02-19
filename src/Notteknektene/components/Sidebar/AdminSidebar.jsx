import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../firebase/auth";
import styles from "./AdminSidebar.module.css";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await doSignOut();
      navigate("/auth/login");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className={styles.adminSidebar}>
      <ul className={styles.adminSidebarList}>
        <li>
          <Link to="/nk/admin/participants">Participants</Link>
        </li>
        <li>
          <Link to="/nk/admin/weekly-task">Weekly Task</Link>
        </li>
        <li>
          <Link to="/nk/admin/submissions">Submissions</Link>
        </li>
      </ul>

      <hr className={styles.adminSidebarDivider} />

      <ul className={styles.adminSidebarList}>
        <li>
          <Link to="/nk">Notteknektene Home</Link>
        </li>
        <li>
          <Link to="/nk/oppgave">Ukens Oppgave</Link>
        </li>
        <li>
          <Link to="/nk/tabell">Tabell</Link>
        </li>
        <li>
          <Link to="/nk/stats">Stats</Link>
        </li>
      </ul>

      {currentUser && (
        <div className={styles.userInfo}>
          <img
            src={currentUser.photoURL || "/defaultAvatar.webp"}
            alt={currentUser.displayName || currentUser.email}
            className={styles.userPhoto}
          />
          <p>{currentUser.displayName || currentUser.email}</p>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logg ut
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
