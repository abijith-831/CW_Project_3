import type { Team } from "../models/teams";
import type { Match } from "../models/match";

export const updateTeamsAfterMatch = (
  teams: Team[],
  match: Match
): Team[] => {
  if (match.homeScore === null || match.awayScore === null) {
    return teams;
  }

  const homeScore = match.homeScore;
  const awayScore = match.awayScore;
  const isDraw = homeScore === awayScore;

  return teams.map((team) => {
    const isHome = team.id === match.homeTeamId;
    const isAway = team.id === match.awayTeamId;

    if (!isHome && !isAway) return team;

    const teamScore = isHome ? homeScore : awayScore;

    const isWin = !isDraw && match.winnerId === team.id;
    const isLoss = !isDraw && !isWin;

    // ✅ YOUR rating rule
    let ratingChange = 0;
    if (!isDraw) {
      ratingChange = (isWin ? 10 : -10) + teamScore;
    }

    return {
      ...team,
      played: team.played + 1,
      won: isWin ? team.won + 1 : team.won,
      drawn: isDraw ? team.drawn + 1 : team.drawn,
      lost: isLoss ? team.lost + 1 : team.lost,

      // goal points always increase
      goal_points: team.goal_points + teamScore,

      // rating logic
      rating: team.rating + ratingChange,

      matchHistory: [...team.matchHistory, match],
    };
  });
};

