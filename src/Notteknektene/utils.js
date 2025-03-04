export const formatTimeSpent = (seconds) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedTime = [];
  if (days > 0) formattedTime.push(`${days}d`);
  if (hours > 0) formattedTime.push(`${hours}t`);
  if (minutes > 0) formattedTime.push(`${minutes}m`);
  if (secs > 0) formattedTime.push(`${secs}s`);

  return formattedTime.join(" ");
};

export const getUserRank = (roundTable, userId) => {
  // Sorter poengsummene i synkende rekkefølge
  const sortedRoundTable = [...roundTable].sort((a, b) => {
    if (b.points === a.points) {
      // Hvis poengene er like, sorter etter tid brukt
      return a.timeSpent - b.timeSpent;
    }
    return b.points - a.points;
  });

  // Finn brukeren basert på navn
  const user = sortedRoundTable.find((user) => user.name === userId);

  // Returner brukerens rangering (indeks + 1) eller null hvis brukeren ikke finnes
  return user ? sortedRoundTable.indexOf(user) + 1 : null;
};

export const getTotalRank = (totalScores, userId) => {
  // Sorter poengsummene i synkende rekkefølge
  const sortedTotalScores = [...totalScores].sort((a, b) => {
    const totalPointsA = a.scores.reduce((acc, score) => acc + score, 0); // Total poengsum
    const totalPointsB = b.scores.reduce((acc, score) => acc + score, 0); // Total poengsum
    return totalPointsB - totalPointsA;
  });

  // Finn brukeren basert på id eller navn
  const user = sortedTotalScores.find(
    (user) => user.id === userId || user.name === userId
  );

  // Returner brukerens rangering (indeks + 1) eller null hvis brukeren ikke finnes
  return user ? sortedTotalScores.indexOf(user) + 1 : null;
};
