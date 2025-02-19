import React, { useState } from "react";
import { updateDoc, doc } from "firebase/firestore";
import { juleolDb } from "../../firebase/firebase-config-juleol";

const BeerItem = ({ beer }) => {
  const [score, setScore] = useState(null);

  const handleVote = async (score) => {
    try {
      const beerRef = doc(juleolDb, "2024", "beers", beer.id);
      await updateDoc(beerRef, {
        votes: [...beer.votes, score],
      });
      setScore(score);
    } catch (error) {
      console.error("Feil ved å oppdatere poeng:", error);
    }
  };

  return (
    <div>
      <h3>{beer.name}</h3>
      <p>{beer.description}</p>
      <div>
        {[1, 2, 3, 4, 5].map((vote) => (
          <button key={vote} onClick={() => handleVote(vote)}>
            {vote}
          </button>
        ))}
      </div>
      {score && <p>Du har stemt: {score}</p>}
    </div>
  );
};

export default BeerItem;
