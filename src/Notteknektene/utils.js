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
