import React, { useEffect, useState } from "react";
import { getBeers } from "../../firebase/firebase-utils";

const BeerList = () => {
  const [beers, setBeers] = useState([]);

  useEffect(() => {
    const fetchBeers = async () => {
      const fetchedBeers = await getBeers();
      setBeers(fetchedBeers);
    };

    fetchBeers();
  }, []);

  return (
    <div>
      <h2>Juleøl Rangering</h2>
      {beers.length === 0 ? (
        <p>Ingen øl lagt til enda!</p>
      ) : (
        <ul>
          {beers.map((beer) => (
            <li key={beer.id}>
              <h3>{beer.name}</h3>
              <p>{beer.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BeerList;
