// utils/getWinner.ts
import type { Match } from "../models/match";

export const getWinner = (match: Match): string | null => {
  if (match.homeScore === null || match.awayScore === null) {
    return null;
  }

  if (match.homeScore > match.awayScore) return match.homeTeamId;
  if (match.awayScore > match.homeScore) return match.awayTeamId;



  return null; // draw
};
