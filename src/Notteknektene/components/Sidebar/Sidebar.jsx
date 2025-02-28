import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { doSignOut } from "../../firebase/auth";
import { FaHome, FaTasks, FaListOl, FaClipboardList } from "react-icons/fa";
import { SiGoogletasks } from "react-icons/si";
import styles from "./Sidebar.module.css";

const Sidebar = () => {
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
    <div className={styles.sidebar}>
      <ul className={styles.sidebarList}>
        <li>
          <NavLink
            to="/nk"
            end
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <FaHome className={styles.icon} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/nk/oppgave"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <SiGoogletasks className={styles.icon} /> Oppgave
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/nk/tabell"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <FaListOl className={styles.icon} /> Tabell
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/nk/regler"
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ""}`
            }
          >
            <FaClipboardList className={styles.icon} /> Regler
          </NavLink>
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

export default Sidebar;
