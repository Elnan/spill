import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext/index.jsx";
import { TaskProvider } from "./context/TaskContext.jsx";
import Notteknektene from "./components/home/Notteknektene.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminSidebar from "./components/Sidebar/AdminSidebar.jsx";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import Participants from "./components/Admin/Participants.jsx";
import WeeklyTask from "./components/Admin/WeeklyTask.jsx";
import Submissions from "./components/Admin/Submissions.jsx";
import AdminPage from "./components/Admin/AdminPage.jsx";
import UkensOppgave from "./components/UkensOppgave/UkensOppgave.jsx";
import Tabell from "./components/Tabell/Tabell.jsx";
import Rules from "./components/Rules/Rules.jsx";
import styles from "./NotteknekteneStyles.module.css";

const NotteknekteneRoutes = () => {
  const { isAdmin } = useAuth();

  return (
    <TaskProvider>
      <div className={styles.notteknekteneContainer}>
        {isAdmin ? <AdminSidebar /> : <Sidebar />}
        <div className={styles.mainContent}>
          <Routes>
            {/* Protected route for Notteknektene */}
            <Route
              path="*"
              element={
                <ProtectedRoute>
                  <Notteknektene />
                </ProtectedRoute>
              }
            />
            <Route path="oppgave" element={<UkensOppgave />} />
            <Route path="tabell" element={<Tabell />} />
            <Route path="regler" element={<Rules />} />
            {/* Admin Routes */}
            <Route
              path="admin/*"
              element={
                isAdmin ? (
                  <Routes>
                    <Route path="participants" element={<Participants />} />
                    <Route path="weekly-task" element={<WeeklyTask />} />
                    <Route path="submissions" element={<Submissions />} />
                    <Route path="admin-page" element={<AdminPage />} />
                  </Routes>
                ) : (
                  <Navigate to="/" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </TaskProvider>
  );
};

export default NotteknekteneRoutes;
