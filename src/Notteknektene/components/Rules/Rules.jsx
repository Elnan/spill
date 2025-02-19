import React from "react";
import styles from "./Rules.module.css";
import underConstruction from "../../assets/underConstruction.webp";

const Rules = () => {
  return (
    <div>
      <h2>Regler</h2>
      <div className={styles.statsContainer}>
        <div className={styles.underConstruction}>
          <img src={underConstruction} alt="Under Construction" />
          <p>Denne siden vil komme senere</p>
        </div>
      </div>
    </div>
  );
};

export default Rules;
