import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../../firebase/auth";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useAuth } from "../../../context/authContext";
import googleIcon from "../../../../../public/LogoGoogle.png";

import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError(null);

    try {
      await doSignInWithEmailAndPassword(email, password);
      navigate("/nk");
    } catch (error) {
      setError(
        "Feil brukernavn eller passord. Prøv igjen, jeg har troen på deg!"
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setIsSigningIn(true);
    setError(null);

    try {
      await doSignInWithGoogle();
      navigate("/nk");
    } catch (error) {
      setError(
        "Feil brukernavn eller passord. Prøv igjen, jeg har troen på deg!"
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  if (currentUser) {
    return <Navigate to="/nk" />;
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.backButton} onClick={handleBackToMain}>
        <IoArrowBackCircleOutline />
      </div>
      <div className={styles.loginBox}>
        <h2 className={styles.loginTitle}>Welcome Back, Agent</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.formInput}
              placeholder=""
            />
            <label className={styles.formLabel}>Epost</label>
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.formInput}
              placeholder=""
            />
            <label className={styles.formLabel}>Passord</label>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button
            type="submit"
            disabled={isSigningIn}
            className={`${styles.submitButton} ${isSigningIn ? styles.buttonDisabled : ""}`}
          >
            {isSigningIn ? "Logger inn..." : "Logg inn"}
          </button>
        </form>
        <p className={`${styles.textCenter}`}>
          Ikke registrert enda?{" "}
          <Link to="/auth/register" className={styles.registerLink}>
            Registrer deg her
          </Link>
          .
        </p>
        <div className={styles.separator}>
          <hr className={styles.separatorLine} />
          <span className={styles.separatorText}>ELLER</span>
          <hr className={styles.separatorLine} />
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={isSigningIn}
          className={`${styles.googleSigninButton} ${isSigningIn ? styles.buttonDisabled : ""}`}
        >
          <img src={googleIcon} alt="Google" className={styles.googleIcon} />
          {isSigningIn ? "Logger inn..." : "Logg inn med Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
