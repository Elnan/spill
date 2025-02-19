import React from "react";
import { Link } from "react-router-dom";
import styles from "./AdminNav.module.css";

const AdminNav = () => {
  return (
    <div className={styles.adminNav}>
      <ul>
        <li>
          <Link to="notteknektene/admin/participants">Manage Participants</Link>
        </li>
        <li>
          <Link to="notteknektene/admin/weekly-task">Set Weekly Task</Link>
        </li>
        <li>
          <Link to="notteknektene/admin/submissions">Review Submissions</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminNav;
