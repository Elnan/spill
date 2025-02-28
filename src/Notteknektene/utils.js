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

export const getUserRank = (totalScores, userId, roundIndex = null) => {
  // Sort by points
  const sortedTotalScores = [...totalScores].sort((a, b) => {
    const totalPointsA =
      roundIndex !== null
        ? a.scores[roundIndex]
        : a.scores.reduce((acc, score) => acc + score, 0);
    const totalPointsB =
      roundIndex !== null
        ? b.scores[roundIndex]
        : b.scores.reduce((acc, score) => acc + score, 0);
    return totalPointsB - totalPointsA;
  });

  // Finn user by id or name
  const user = sortedTotalScores.find(
    (user) => user.id === userId || user.name === userId
  );

  return user ? sortedTotalScores.indexOf(user) + 1 : null;
};
