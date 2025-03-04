import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doPasswordReset,
} from "../../../firebase/auth";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useAuth } from "../../../context/authContext";

import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
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

  const handlePasswordReset = async () => {
    if (!email) {
      setError(
        "Vennligst skriv inn e-postadressen din for å tilbakestille passordet."
      );
      return;
    }

    try {
      await doPasswordReset(email);
      setResetEmailSent(true);
      setError(null);
    } catch (error) {
      setError(
        "Kunne ikke sende tilbakestillings-e-post. Vennligst prøv igjen senere."
      );
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
          {resetEmailSent && (
            <div className={styles.successMessage}>
              En e-post for tilbakestilling av passord har blitt sendt.
            </div>
          )}

          <button
            onClick={handlePasswordReset}
            className={styles.resetPasswordLink}
          >
            Glemt passord?
          </button>

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
          <img
            src="/LogoGoogle.webp"
            alt="A capitalized G, which is the icon of Google"
            className={styles.googleIcon}
          />
          {isSigningIn ? "Logger inn..." : "Logg inn med Google"}
        </button>
      </div>
    </div>
  );
};

export default Login;
