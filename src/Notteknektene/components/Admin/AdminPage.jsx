import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminSidebar from "../Sidebar/AdminSidebar.jsx";
import Participants from "./Participants.jsx";
import WeeklyTask from "./WeeklyTask.jsx";
import Submissions from "./Submissions.jsx";
import { useAuth } from "../../context/authContext/index.jsx";
import styles from "./AdminPage.module.css";

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      if (currentUser.email === "Olavelnan@gmail.com") {
        setIsAdmin(true);
      } else {
        navigate("/"); // Redirect non-admin users to the home page
      }
    } else {
      navigate("/login"); // Redirect unauthenticated users to the login page
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <div>Access Denied</div>; // Denies access to non-admin users
  }

  return (
    <div className="adminPage">
      <AdminSidebar />
      <main className="adminMain">
        <Routes>
          <Route path="participants" element={<Participants />} />
          <Route path="weekly-task" element={<WeeklyTask />} />
          <Route path="submissions" element={<Submissions />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;
