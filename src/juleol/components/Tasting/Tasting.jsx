import React, { useState, useEffect } from "react";
import {
  getBeers,
  updateBeerScore,
} from "../../firebase/juleol-firebase-utils";
import { useNavigate } from "react-router-dom";
import "./Tasting.css";

const Tasting = () => {
  const [beers, setBeers] = useState([]);
  const [currentBeerIndex, setCurrentBeerIndex] = useState(0);
  const [score, setScore] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const allBeers = await getBeers("2024");
        const sortedBeers = allBeers.sort(
          (a, b) => a.alcoholPercentage - b.alcoholPercentage
        ); // Sorter etter alkoholprosent
        setBeers(sortedBeers);
      } catch (error) {
        console.error("Feil ved henting av øl:", error);
      }
    };
    fetchBeers();
  }, []);

  // Funksjon for å bekrefte score
  const handleSubmitScore = async () => {
    if (score === null || score < 1 || score > 10) {
      alert("Vennligst gi en score mellom 1 og 10!");
      return;
    }

    const currentBeer = beers[currentBeerIndex];

    try {
      console.log(`Oppdaterer øl med ID ${currentBeer.id} med score: ${score}`);
      await updateBeerScore(currentBeer.id, score);
      setSubmitted(true);
    } catch (error) {
      console.error("Feil ved oppdatering av score:", error);
    }
  };

  // Funksjon for å gå til neste øl
  const handleNextBeer = () => {
    if (currentBeerIndex < beers.length - 1) {
      setCurrentBeerIndex((prevIndex) => prevIndex + 1);
      setSubmitted(false);
      setScore(null);
    } else {
      console.log("Alle øl er smakt.");
      setCurrentBeerIndex(beers.length);
    }
  };

  // Naviger til resultatsiden
  const handleFinishTasting = () => {
    navigate("/results");
  };

  // Hvis ingen øl er lastet inn
  if (beers.length === 0) {
    return <p>Ingen øl funnet.</p>;
  }

  // Beregn fremdriften (prosent) for progressbaren
  const progress = (currentBeerIndex / beers.length) * 100;

  return (
    <div className="tasting-wrapper">
      <div className="tasting-container">
        <div className="content">
          <h1>Smaking</h1>

          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progress}%` }} />
          </div>

          <div className="beer-info">
            <h2>{beers[currentBeerIndex].name}</h2>
            <p>{beers[currentBeerIndex].producer}</p>
            <p>{beers[currentBeerIndex].alcoholPercentage}%</p>
            <p>Brakt av: {beers[currentBeerIndex].broughtBy}</p>
          </div>

          {submitted ? (
            <div className="submitted-score">
              <h3>Score: {score}</h3>
              {currentBeerIndex < beers.length - 1 ? (
                <button className="next-button" onClick={handleNextBeer}>
                  Neste Øl
                </button>
              ) : (
                <button className="next-button" onClick={handleFinishTasting}>
                  Fullfør Smaking
                </button>
              )}
            </div>
          ) : (
            <div className="scoring">
              <label>
                Score (1-10):
                <input
                  type="tel"
                  min="1"
                  max="10"
                  value={score || ""}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </label>
              <button onClick={handleSubmitScore}>Bekreft score</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tasting;
