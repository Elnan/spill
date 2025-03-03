import React, { useEffect, useState, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Checkbox,
} from "@mui/material";
import { getDocs, collection } from "firebase/firestore";
import { notteknekteneDb } from "../../firebase/firebase-config-notteknektene";
import { TaskContext } from "../../context/TaskContext";
import { formatTimeSpent } from "../../utils";
import styles from "./Tabell.module.css";

const Tabell = ({ currentUser, setUserRank }) => {
  const [view, setView] = useState("round"); // "Runde" or "Sammenlagt"
  const [roundTable, setRoundTable] = useState([]);
  const [totalScores, setTotalScores] = useState([]);
  const { roundNumber } = useContext(TaskContext);
  const totalRounds = 10; // Total number of rounds

  useEffect(() => {
    const fetchRoundTableData = async () => {
      const roundTableCollection = collection(notteknekteneDb, "RoundTable");
      const roundTableSnapshot = await getDocs(roundTableCollection);
      const roundTableList = roundTableSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRoundTable(roundTableList);
    };

    const fetchTotalScores = async () => {
      const totalScoresCollection = collection(notteknekteneDb, "TotalScores");
      const totalScoresSnapshot = await getDocs(totalScoresCollection);
      const totalScoresList = totalScoresSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTotalScores(totalScoresList);
    };

    fetchRoundTableData();
    fetchTotalScores();
  }, [roundNumber]);

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return { fontSize: "1.5em", color: "gold" };
      case 2:
        return { fontSize: "1.3em", color: "silver" };
      case 3:
        return { fontSize: "1.1em", color: "#cd7f32" };
      default:
        return { fontSize: "1em", color: "black" };
    }
  };

  // Sorter roundTable by points, then by time spent (ascending)
  const sortedRoundTable = [...roundTable].sort((a, b) => {
    if (b.points === a.points) {
      if (a.timeSpent === "" && b.timeSpent !== "") return 1;
      if (b.timeSpent === "" && a.timeSpent !== "") return -1;
      return a.timeSpent - b.timeSpent;
    }
    if (a.points === 0 && b.points !== 0) return 1;
    if (b.points === 0 && a.points !== 0) return -1;
    return b.points - a.points;
  });

  // Sort totalScores by scores
  const sortedTotalScores = [...totalScores].sort((a, b) => {
    const totalPointsA = a.scores.reduce((acc, score) => acc + score, 0);
    const totalPointsB = b.scores.reduce((acc, score) => acc + score, 0);
    return totalPointsB - totalPointsA;
  });

  // Find users rank
  useEffect(() => {
    if (currentUser) {
      const userRank = sortedTotalScores.findIndex(
        (user) => user.id === currentUser.uid
      );
      setUserRank(userRank + 1);
    }
  }, [sortedTotalScores, currentUser, setUserRank]);

  return (
    <Box className={styles.mainBox}>
      <Typography variant="h4" gutterBottom className={styles.tableTitle}>
        {view === "round" ? `Runde ${roundNumber}` : "Sammenlagt"}
      </Typography>
      <Button
        variant="contained"
        onClick={() => setView(view === "round" ? "total" : "round")}
        className={styles.buttonContainer}
      >
        {view === "round" ? "Sammenlagt" : "Rundetabellen"}
      </Button>

      {view === "round" ? (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell className={styles.rankCell}>#</TableCell>
                <TableCell className={styles.nameCell}>Navn</TableCell>
                <TableCell className={styles.openedAtCell}>Åpnet</TableCell>
                <TableCell className={styles.submittedAtCell}>Levert</TableCell>
                <TableCell>Hint</TableCell>
                <TableCell>Tid brukt</TableCell>
                <TableCell>Poeng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRoundTable.map((row, index) => (
                <TableRow
                  key={index}
                  id={`row-${index}`}
                  className={styles.tableRow}
                >
                  <TableCell
                    className={styles.rankCell}
                    style={getRankStyle(index + 1)}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell className={styles.nameCell}>{row.name}</TableCell>
                  <TableCell className={styles.openedAtCell}>
                    {row.openedAt}
                  </TableCell>
                  <TableCell className={styles.submittedAtCell}>
                    {row.submittedAt}
                  </TableCell>
                  <TableCell>
                    <Checkbox checked={row.hintUsed} disabled />
                  </TableCell>
                  <TableCell>{formatTimeSpent(row.timeSpent)}</TableCell>
                  <TableCell>{row.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table>
            <TableHead>
              <TableRow className={styles.tableHeader}>
                <TableCell className={styles.rankCell}>#</TableCell>
                <TableCell className={styles.nameCell}>Navn</TableCell>
                {Array.from({ length: totalRounds }, (_, index) => (
                  <TableCell key={index} className={styles.roundCell}>
                    {`R${index + 1}`}
                  </TableCell>
                ))}
                <TableCell className={styles.totalColumn}>Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedTotalScores.map((row, index) => (
                <TableRow
                  key={row.id}
                  id={`row-${index}`}
                  className={styles.tableRow}
                >
                  <TableCell
                    className={styles.rankCell}
                    style={getRankStyle(index + 1)}
                  >
                    {index + 1}
                  </TableCell>
                  <TableCell className={styles.nameCell}>{row.name}</TableCell>
                  {Array.from({ length: totalRounds }, (_, roundIndex) => (
                    <TableCell key={roundIndex} className={styles.roundCell}>
                      {row.scores[roundIndex] !== undefined
                        ? row.scores[roundIndex]
                        : ""}
                    </TableCell>
                  ))}
                  <TableCell className={styles.totalColumn}>
                    {row.scores.reduce((acc, score) => acc + score, 0)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Tabell;
