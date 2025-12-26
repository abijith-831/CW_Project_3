import { v4 as uuid } from "uuid";
import type { Team } from "../models/teams";
import type { Match } from "../models/match";

export const generateMatches = (
  teams: Team[],
  roundNumber: number
): Match[] => {
  const matches: Match[] = [];

  // 1️⃣ Sort teams by rating (HIGH → LOW)
  const sorted = [...teams].sort((a, b) => b.rating - a.rating);

  /* ===========================
     🔴 SPECIAL CASE: 3 TEAMS
     =========================== */
  if (sorted.length === 3) {
    const high = sorted[0];
    const mid = sorted[1];
    const low = sorted[2];

    // mid vs low
    matches.push({
      matchId: uuid(),
      round: roundNumber,
      homeTeamId: mid.id,
      awayTeamId: low.id,
      homeScore: null,
      awayScore: null,
      isBye: false,
      winnerId: null,
      isDraw: false,
    });

    // high gets BYE
    matches.push({
      matchId: uuid(),
      round: roundNumber,
      homeTeamId: high.id,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      isBye: true,
      winnerId: high.id,
      isDraw: false,
    });

    return matches;
  }

  /* ===========================
     🟢 NORMAL LOGIC (4+ teams)
     =========================== */

  let byeTeam: Team | null = null;

  // If odd → assign BYE based on round
  if (sorted.length % 2 !== 0) {
    if (roundNumber === 1) {
      // Round 1 → LOWEST-rated team gets BYE
      byeTeam = sorted.pop()!;
    } else {
      // Later rounds → HIGHEST-rated team gets BYE
      byeTeam = sorted.shift()!;
    }
  }

  // Pair remaining teams
  for (let i = 0; i < sorted.length; i += 2) {
    matches.push({
      matchId: uuid(),
      round: roundNumber,
      homeTeamId: sorted[i].id,
      awayTeamId: sorted[i + 1].id,
      homeScore: null,
      awayScore: null,
      isBye: false,
      winnerId: null,
      isDraw: false,
    });
  }

  // Add BYE match
  if (byeTeam) {
    matches.push({
      matchId: uuid(),
      round: roundNumber,
      homeTeamId: byeTeam.id,
      awayTeamId: null,
      homeScore: null,
      awayScore: null,
      isBye: true,
      winnerId: byeTeam.id,
      isDraw: false,
    });
  }

  return matches;
};
