import React, { lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import Index from "./Index.jsx";
import { AuthProvider } from "./Notteknektene/context/authContext";
import styles from "./App.module.css";

const FallingSand = lazy(() => import("./FallingSand/FallingSand.jsx"));
const Juleol = lazy(() => import("./juleol/components/jo/Juleol.jsx"));
const Tasting = lazy(() => import("./juleol/components/Tasting/Tasting"));
const Results = lazy(() => import("./juleol/components/Results/Results"));
const Login = lazy(
  () => import("./Notteknektene/components/auth/login/index.jsx")
);
const Register = lazy(() => import("./Notteknektene/components/auth/register"));
const NotteknekteneRoutes = lazy(
  () => import("./Notteknektene/NotteknekteneRoutes")
);

const HandleRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const redirectPath = new URLSearchParams(window.location.search).get(
      "redirect"
    );
    if (redirectPath) {
      window.history.replaceState({}, "", redirectPath);
    }
  }, [location]);

  return null;
};

const App = () => {
  return (
    <Router>
      <HandleRedirect />
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
