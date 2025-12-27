import type { Round } from "../models/round";
import type { Team } from "../models/teams";

export const getWinnersFromRound = (
  round: Round,
  allTeams: Team[]
): Team[] => {
  const winnerIds = round.matches
    .map((m) => m.winnerId)
    .filter((id): id is string => Boolean(id));

  return allTeams.filter((team) => winnerIds.includes(team.id));
};
