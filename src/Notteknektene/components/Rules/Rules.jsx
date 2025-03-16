import React from "react";
import styles from "./Rules.module.css";

const Rules = () => {
  return (
    <div className={styles.rulesContainer}>
      <h2>Regler</h2>
      <ul>
        <h3>Generelle regler</h3>
        <li>
          En sesong varer i <strong>10 uker</strong>, og det slippes en ny nøtt
          hver uke.
        </li>
        <li>
          Hver nøtt har en innleveringsfrist <strong>Søndag, kl. 18:00</strong>.
        </li>
        <li>
          Du har kun <strong>ett forsøk</strong> per oppgave – tenk deg godt om
          før du sender inn svaret.
        </li>
        <li>
          Hver oppgave har <strong>ett hint</strong> som kan brukes, men det
          påvirker poengsummen din.
        </li>
        <li>Tidsbruk måles fra du åpner oppgaven til du sender inn svaret.</li>
        <li>
          Raskeste korrekte besvarelse kan gi et bonuspoeng, men vinneren av
          sesongen er den som svarer riktig oftest, så ikke stress unødvendig
          med tiden.
        </li>
      </ul>
      <ul>
        <h3>Hjelpemidler</h3>
        <li>
          Du kan bruke hjelpemidler som hjelper deg med å tenke, for eksempel:
          <ul>
            <li>✅ Kalkulator, penn og papir, Excel/Sheets</li>
          </ul>
        </li>
        <li>
          Men det er <strong>ikke lov</strong> å bruke hjelpemidler som gir deg
          svaret direkte, for eksempel:
          <ul>
            <li>
              ❌ Google, AI (ChatGPT, Bard, etc.), direkte oppslag av svaret
            </li>
          </ul>
        </li>
      </ul>
      <ul>
        <h3>Poeng</h3>
        <li>
          Riktig svar innen fristen:
          <ul>
            <li>
              <strong>Uten hint</strong>: <strong>7 poeng</strong>
            </li>
            <li>
              <strong>Med hint</strong>: <strong>4 poeng</strong>
            </li>
          </ul>
        </li>
        <li>
          Bonuspoeng:
          <ul>
            <li>
              Den raskeste korrekte besvarelsen hver runde får{" "}
              <strong>1 bonuspoeng</strong>, uansett om hint ble brukt eller
              ikke.
            </li>
          </ul>
        </li>
        <li>
          Feil svar eller ingen innlevering: <strong>0 poeng</strong>
        </li>
      </ul>
    </div>
  );
};

export default Rules;
