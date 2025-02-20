import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Index from "./Index.jsx";
import { AuthProvider } from "./Notteknektene/context/authContext";
import FallingSand from "./FallingSand/FallingSand.jsx";
import Juleol from "./juleol/components/jo/Juleol.jsx";
import Tasting from "./juleol/components/Tasting/Tasting";
import Results from "./juleol/components/Results/Results";
import NotteknekteneRoutes from "./Notteknektene/NotteknekteneRoutes";
import Login from "./Notteknektene/components/auth/login/index.jsx";
import Register from "./Notteknektene/components/auth/register";
import styles from "./App.module.css";

const App = () => {
  return (
    <Router>
      <div className={styles.app}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/fs" element={<FallingSand />} />
          <Route path="/jo" element={<Juleol />} />
          <Route path="/tasting" element={<Tasting />} />
          <Route path="/results" element={<Results />} />
          <Route path="/spill" element={<Navigate to="/" />} />

          <Route
            path="/auth/*"
            element={
              <AuthProvider>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Routes>
              </AuthProvider>
            }
          />
          <Route
            path="/nk/*"
            element={
              <AuthProvider>
                <NotteknekteneRoutes />
              </AuthProvider>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
