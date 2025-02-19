import React, { useState, useEffect } from "react";
import { addBeer, getBeers } from "../../firebase/juleol-firebase-utils";
import { Navigate } from "react-router-dom";

import "./Juleol.css";

const Juleol = () => {
  const [beers, setBeers] = useState([]);
  const [newBeer, setNewBeer] = useState({
    name: "",
    producer: "",
    alcoholPercentage: "",
    broughtBy: "",
  });
  const [isTastingStarted, setIsTastingStarted] = useState(false);

  // Hent øl fra Firestore
  useEffect(() => {
    const fetchBeers = async () => {
      const fetchedBeers = await getBeers("2024"); //Årstall
      setBeers(fetchedBeers);
    };
    fetchBeers();
  }, []);

  // Håndtering av inputendringer for nytt øl
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBeer((prev) => ({ ...prev, [name]: value }));
  };

  // Funksjon for å legge til nytt øl
  const handleAddBeer = async () => {
    if (
      !newBeer.name ||
      !newBeer.producer ||
      !newBeer.alcoholPercentage ||
      !newBeer.broughtBy
    ) {
      alert("Vennligst fyll ut alle felt.");
      return;
    }

    await addBeer({
      ...newBeer,
      alcoholPercentage: parseFloat(newBeer.alcoholPercentage),
      totalScore: 0,
      ratingsCount: 0,
    });

    // Oppdater listen med øl
    const updatedBeers = await getBeers("2024");
    setBeers(updatedBeers);

    // Lagre øl i sessionStorage
    sessionStorage.setItem("registeredBeers", JSON.stringify(updatedBeers));

    // Nullstill skjemaet
    setNewBeer({
      name: "",
      producer: "",
      alcoholPercentage: "",
      broughtBy: "",
    });
  };

  // Start smaking
  const handleStartTasting = () => {
    if (beers.length === 0) {
      alert(
        "Ingen øl tilgjengelig. Vennligst legg til minst ett øl før du starter smaking."
      );
      return;
    }
    sessionStorage.setItem("isTastingStarted", "true");
    setIsTastingStarted(true);
  };

  if (isTastingStarted) {
    return <Navigate to="/tasting" />;
  }

  return (
    <div className="juleol-wrapper">
      <div className="juleol-container">
        <h1>Juleøl-rangering</h1>

        <div className="add-beer-section">
          <h2>Legg til en ny øl</h2>
          <input
            type="text"
            name="name"
            placeholder="Navn på øl"
            value={newBeer.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="producer"
            placeholder="Produsent"
            value={newBeer.producer}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="alcoholPercentage"
            placeholder="Alkoholprosent"
            value={newBeer.alcoholPercentage}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="broughtBy"
            placeholder="Hvem tok med"
            value={newBeer.broughtBy}
            onChange={handleInputChange}
          />
          <button onClick={handleAddBeer}>Legg til øl</button>
        </div>

        <div className="start-tasting">
          <button onClick={handleStartTasting}>Start smaking</button>
        </div>

        {beers.length > 0 && (
          <div className="beer-list">
            <h2>Registrerte øl</h2>
            <ul>
              {beers.map((beer) => (
                <li key={beer.id}>
                  <strong>{beer.name}</strong> (Produsent: {beer.producer},
                  Alkohol: {beer.alcoholPercentage}%, Brakt av: {beer.broughtBy}
                  )
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Juleol;
