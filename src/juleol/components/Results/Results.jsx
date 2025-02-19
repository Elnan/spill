import React, { useEffect, useState } from "react";
import { getBeers } from "../../firebase/juleol-firebase-utils";
import "./Results.css";

const Results = () => {
  const [beers, setBeers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBeers = async () => {
      try {
        const year = "2024"; //År
        const allBeers = await getBeers(year);

        if (allBeers && Array.isArray(allBeers)) {
          // Sorter etter totalscore i synkende rekkefølge
          const sortedBeers = allBeers.sort(
            (a, b) => (b.totalScore || 0) - (a.totalScore || 0)
          );
          setBeers(sortedBeers);
        } else {
          setBeers([]);
        }
      } catch (error) {
        console.error("Feil ved henting av øl:", error);
        setBeers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBeers();
  }, []);

  if (loading) {
    return <p>Lasting av resultater...</p>;
  }

  if (beers.length === 0) {
    return <p>Ingen resultater funnet.</p>;
  }

  return (
    <div className="results-wrapper">
      <div className="results-container">
        <h1>Resultater</h1>
        <table className="results-table">
          <thead>
            <tr>
              <th>Plass</th>
              <th className="result-table-name">Navn</th>
              <th className="result-table-score">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {beers.map((beer, index) => (
              <tr key={beer.id} className={index < 3 ? `top-${index + 1}` : ""}>
                <td className="position">{index + 1}</td>
                <td className="beer-info">
                  <strong>{beer.name || "Ukjent Øl"}</strong>
                  <div className="beer-details">
                    {beer.producer || "Ukjent Produsent"} |{" "}
                    {beer.alcoholPercentage || "N/A"}% |{" "}
                    {beer.broughtBy || "Ukjent"}
                  </div>
                </td>
                <td className="total-score">{beer.totalScore || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Results;
