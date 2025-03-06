import React from "react";
import styles from "./Rules.module.css";

const Rules = () => {
  return (
    <div className={styles.rulesContainer}>
      <h2>Regler</h2>
      <ul>
        <h3>Generelle regler</h3>
        <li>
          Hver sesong vil gå over 10 uker, og det slippes en ny nøtt én gang i
          uka, hver uke. <strong>10 oppgaver.</strong>
        </li>
        <li>
          Fristen for hver nøtt vil være{" "}
          <strong>18:00, fire dager fra oppgaveslipp</strong>. Dvs om oppgaven
          slippes på mandag, så er frist Fredag 18:00
        </li>
        <li>
          For hver oppgave, så har man <strong>ett forsøk</strong> på å svare
          riktig.
        </li>
        <li>
          {" "}
          Hver oppgave har <strong>ett hint</strong> som kan brukes.
        </li>
        <li>
          Tiden du bruker på oppgaven, måles fra du åpner oppgaven, til du har
          levert.
        </li>
        <li>
          Raskeste tid kan gi et bonuspoeng hver runde, men vinneren bli den som
          leverer riktig svar oftest, så ikke stress med tiden.
        </li>
      </ul>
      <ul>
        <h3>Poeng</h3>
        <li>Svarer du riktig innen fristen:</li>
        <ul>
          <li>
            <strong>Uten hint</strong>, får du <strong>7 poeng.</strong>
          </li>
          <li>
            <strong>Med hint</strong>, får du <strong>4 poeng.</strong>
          </li>
          <li>
            For hver runde vil den raskeste korrekte besvarelsen bli belønnet
            med <strong>1 bonuspoeng</strong>. <br />
            Så selv om du bruker hint, kan du få bonuspoeng for raskeste
            besvarelse.
            <br />
            <br /> Om du ikke svarer innen fristen, eller du svarer feil, får du{" "}
            <strong>0 poeng.</strong>
          </li>
        </ul>
      </ul>
    </div>
  );
};

export default Rules;
