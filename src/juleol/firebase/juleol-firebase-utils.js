import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { juleolDb } from "./firebase-config-juleol";

//Husk å endre årstall

// Funksjon for å legge til øl i Firestore
export const addBeer = async (beer) => {
  try {
    // Referer til collectionen '2024' og legg til øl som et nytt dokument
    const beersCollectionRef = collection(juleolDb, "2024");

    // Legg til et nytt dokument (øl) i 2024-collectionen
    const docRef = await addDoc(beersCollectionRef, beer);
    console.log("Øl lagt til med ID:", docRef.id);
  } catch (e) {
    console.error("Feil ved å legge til øl:", e);
  }
};

// Funksjon for å hente øl for et spesifikt år, sortert etter alkoholprosent
export const getBeers = async (year) => {
  try {
    // Referer til collectionen '2024' og hent dokumentene
    const beerCollectionRef = collection(juleolDb, year); // Hent dokumenter fra 2024-collectionen
    const q = query(beerCollectionRef, orderBy("alcoholPercentage"));
    const querySnapshot = await getDocs(q);

    const beers = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return beers;
  } catch (e) {
    console.error("Feil ved henting av øl:", e);
  }
};

// Funksjon for å oppdatere score på øl i Firestore
export const updateBeerScore = async (beerId, score) => {
  try {
    const beerDocRef = doc(juleolDb, "2024", beerId); // Referer til spesifikt øl-dokument i 2024-collectionen

    await updateDoc(beerDocRef, {
      totalScore: increment(score),
      ratingsCount: increment(1),
    });

    console.log(`Score for øl med ID ${beerId} oppdatert.`);
  } catch (e) {
    console.error("Feil ved oppdatering av øl score:", e);
  }
};
