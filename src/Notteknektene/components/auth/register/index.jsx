import React, { useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  notteknekteneAuth,
  notteknekteneDb,
} from "../../../firebase/firebase-config-notteknektene.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useAuth } from "../../../context/authContext";
import styles from "./Register.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const inputs = document.querySelectorAll(`.${styles.formInput}`);
    inputs.forEach((input) => {
      input.addEventListener("input", handleInput);
      if (input.value) {
        input.classList.add(styles.hasText);
      }
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("input", handleInput);
      });
    };
  }, []);

  const handleInput = (e) => {
    if (e.target.value) {
      e.target.classList.add(styles.hasText);
    } else {
      e.target.classList.remove(styles.hasText);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSigningUp(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSigningUp(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        notteknekteneAuth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: username,
      });

      await setDoc(doc(notteknekteneDb, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        name: username,
        Participating: false,
      });

      navigate("/nk");
    } catch (error) {
      setError(error.message);
      setIsSigningUp(false);
    }
  };

  const handleBackToMain = () => {
    navigate("/");
  };

  if (currentUser) {
    return <Navigate to="/nk" />;
  }

  return (
    <div className={styles.registerWrapper}>
      <Link to="/" className={styles.backButton}>
        <IoArrowBackCircleOutline />
      </Link>
      <div className={styles.registerContainer}>
        <h2 className={styles.registerTitle}>Registrer deg</h2>
        <form className={styles.registerForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <input
              type="text"
              id="username"
              className={styles.formInput}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=""
            />
            <label className={styles.formLabel} htmlFor="username">
              Navn
            </label>
          </div>
          <div className={styles.formGroup}>
            <input
              type="email"
              id="email"
              className={styles.formInput}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=""
            />
            <label className={styles.formLabel} htmlFor="email">
              Epost
            </label>
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
          <div className={styles.formGroup}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.formInput}
              placeholder=""
            />
            <label className={styles.formLabel}>Bekreft Passord</label>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <button
            type="submit"
            disabled={isSigningUp}
            className={`${styles.submitButton} ${isSigningUp ? styles.buttonDisabled : ""}`}
          >
            {isSigningUp ? "Registrerer..." : "Registrer"}
          </button>
        </form>
        <p>
          Har du allerede bruker?{" "}
          <Link to="/auth/login" className={styles.loginLink}>
            Logg inn her
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Register;
