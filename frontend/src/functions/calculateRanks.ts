import { LeaderboardType } from "../types/LeaderboardType";

const calculateRanks = (data: LeaderboardType) => {
  if (data.length === 0) return [];

  let currentRank = 1;
  // First player is always rank 1
  data[0].rank = currentRank;

  for (let i = 1; i < data.length; i++) {
    if (data[i].points === data[i - 1].points) {
      // If scores are the same, share the rank
      data[i].rank = currentRank;
    } else {
      // If scores are different, increment the rank
      currentRank = i + 1;
      data[i].rank = currentRank;
    }
  }

  return data;
};

export default calculateRanks;