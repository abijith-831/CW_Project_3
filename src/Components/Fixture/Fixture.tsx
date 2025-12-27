import { useEffect, useState } from "react";
import { generateMatches } from "../../engine/matchGenerator";
import { getWinner } from "../../engine/getWinner";
import { getWinnersFromRound } from "../../engine/getWinnerFromRound";
import { updateTeamsAfterMatch } from "../../engine/updateTeamsFromMatches";
import FixtureConnectorTop from "../FixtureConnector/FixtureConnectorTop";
import TeamModal from "../TeamModal/TeamModal";

import { useDispatch, useSelector } from "react-redux";
import { updateMatchResult, addRound } from "../../redux/slices/RoundsSlice";
import { setTeams , incrementPlayed} from "../../redux/slices/TeamSlice";

import type { Team } from "../../models/teams";
import type { Round } from "../../models/round";
import type { Match } from "../../models/match";
import type { RootState } from "../../redux/store";

type BracketProps = {
  teams: Team[];
  rounds: Round[];
};

const Bracket = ({ teams, rounds }: BracketProps) => {
  const dispatch = useDispatch();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* -------------------- SCORE SUBMIT -------------------- */
const handleSubmitScore = (
  matchId: string,
  teamId: string,
  goals: number
) => {
  const round = rounds.find(r => r.matches.some(m => m.matchId === matchId));
  if (!round) return;

  const match = round.matches.find(m => m.matchId === matchId);
  if (!match) return;

  const updatedHomeScore =
    match.homeTeamId === teamId ? goals : match.homeScore;

  const updatedAwayScore =
    match.awayTeamId === teamId ? goals : match.awayScore;

  const bothEntered =
    updatedHomeScore !== null && updatedAwayScore !== null;

  const wasAlreadyCompleted =
    match.homeScore !== null && match.awayScore !== null;

  const winnerId = bothEntered
    ? getWinner({
        ...match,
        homeScore: updatedHomeScore,
        awayScore: updatedAwayScore,
      })
    : null;

  const isDraw =
    bothEntered && updatedHomeScore === updatedAwayScore;

  // ✅ Update match always
  dispatch(
    updateMatchResult({
      roundNumber: round.roundNumber,
      matchId: match.matchId,
      homeScore: updatedHomeScore,
      awayScore: updatedAwayScore,
      winnerId,
      isDraw,
    })
  );

  // ✅ Increment played ONLY once
  if (bothEntered && !wasAlreadyCompleted) {
    const teamIds = [
      match.homeTeamId,
      ...(match.awayTeamId ? [match.awayTeamId] : []),
    ];

    dispatch(incrementPlayed({ teamIds }));
  }

  // ✅ Update teams ONLY if winner exists
  if (bothEntered && !wasAlreadyCompleted) {
  dispatch(
    setTeams(
      updateTeamsAfterMatch(teams, {
        ...match,
        homeScore: updatedHomeScore,
        awayScore: updatedAwayScore,
        winnerId,   // null for draw
        isDraw,
      })
    )
  );
}

};



  /* -------------------- REMATCH -------------------- */
  const handleRematch = (matchId: string) => {
  const round = rounds.find(r =>
    r.matches.some(m => m.matchId === matchId)
  );
  if (!round) return;

  const match = round.matches.find(m => m.matchId === matchId);
  if (!match) return;

  // ONLY reset match
  dispatch(
    updateMatchResult({
      roundNumber: round.roundNumber,
      matchId: match.matchId,
      homeScore: null,
      awayScore: null,
      winnerId: null,
      isDraw: false,
    })
  );
};



  /* -------------------- AUTO CREATE NEXT ROUND -------------------- */
  useEffect(() => {
    if (rounds.length === 0) return;

    const lastRound = rounds[rounds.length - 1];
    const allCompleted = lastRound.matches.every((m) => m.winnerId !== null);
    if (!allCompleted) return;

    const nextRoundExists = rounds.some(
      (r) => r.roundNumber === lastRound.roundNumber + 1
    );
    if (nextRoundExists) return;

    const winnerTeams = getWinnersFromRound(lastRound, teams);
    if (winnerTeams.length <= 1) return;

    const nextRound: Round = {
      roundNumber: lastRound.roundNumber + 1,
      teams: winnerTeams,
      matches: generateMatches(winnerTeams, lastRound.roundNumber + 1),
    };

    dispatch(addRound(nextRound));
  }, [rounds, teams, dispatch]);

  

  /* -------------------- UI -------------------- */
  return (
    <div className="p-6">
      <h1 className="text-3xl   mb-6 text-center">Tournament Bracket</h1>

      <div className="flex gap-20 overflow-x-auto bg-black/70 py-6 px-12">
        {rounds.map((round) => (
          <div key={round.roundNumber} className="flex flex-col gap-10 min-w-[320px] h-full">
            <h2 className="text-lg font-semibold text-center text-neutral-200">
              Round {round.roundNumber}
            </h2>

            <div className="flex flex-col justify-center items-center gap-10 flex-1">
              {round.matches.map((match) => {
                const homeTeam = teams.find((t) => t.id === match.homeTeamId);
                const awayTeam = match.awayTeamId ? teams.find((t) => t.id === match.awayTeamId) : null;
                const winner = teams.find((t) => t.id === match.winnerId);

                const isCompleted = match.homeScore !== null && match.awayScore !== null;
                const isDraw = isCompleted && match.homeScore === match.awayScore;
                const homeWon = isCompleted && !isDraw && match.homeScore! > match.awayScore!;
                const awayWon = isCompleted && !isDraw && match.awayScore! > match.homeScore!;
                const isMatchOver = match.isBye || isCompleted;

                return (
                  <div key={match.matchId} className="grid grid-cols-[220px_60px_260px] gap-10 items-center">
                    {/* LEFT SIDE: HOME & AWAY */}
                    <div className="flex flex-col items-center gap-2">
                      <div className={`text-neutral-800 bg-white/70 border-2 transition-all duration-300 p-3 shadow text-center w-full cursor-pointer font-semibold
                        ${!isCompleted ? "border-neutral-300 hover:bg-white/30 hover:backdrop-blur-xl hover:scale-103"
                          : isDraw ? "border-blue-400"
                          : homeWon ? "border-green-400" : "border-red-400"}`}
                        onClick={() => {
                          if (homeTeam) {
                            setSelectedTeam(homeTeam);
                            setSelectedMatch(match);
                            setIsModalOpen(true);
                          }
                        }}>
                        {homeTeam?.name} {match.homeScore !== null && `(${match.homeScore})`}
                      </div>

                      <div className="text-neutral-100 font-bold">VS</div>

                      <div className={`border-2 text-neutral-800 bg-white/70 transition-all duration-300 p-3 shadow text-center w-full cursor-pointer font-semibold
                        ${!isCompleted ? "border-neutral-300 hover:bg-white/30 hover:backdrop-blur-xl hover:scale-103"
                          : isDraw ? "border-blue-400"
                          : awayWon ? "border-green-400" : "border-red-400"}`}
                        onClick={() => {
                          if (awayTeam) {
                            setSelectedTeam(awayTeam);
                            setSelectedMatch(match);
                            setIsModalOpen(true);
                          }
                        }}>
                        {awayTeam ? awayTeam.name : "BYE"} {match.awayScore !== null && `(${match.awayScore})`}
                      </div>
                    </div>

                    <FixtureConnectorTop />

                    {/* RIGHT SIDE: WINNER */}
                    {isMatchOver && (
                      <div className="border text-neutral-200 transition-all duration-300 p-3 shadow text-center w-full cursor-pointer bg-white/70 font-semibold hover:bg-white/30 hover:backdrop-blur-xl hover:scale-103">
                        {isDraw ? (
                          <>
                            <p className="font-bold text-orange-600">DRAW</p>
                            <button
                              onClick={() => handleRematch(match.matchId)}
                              className="mt-2 cursor-pointer text-sm text-blue-600">
                              Rematch
                            </button>
                          </>
                        ) : (
                          <p className="font-bold text-green-600">
                            {winner ? winner.name : "—"}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* TEAM MODAL */}
      {selectedTeam && selectedMatch && (
        <TeamModal
          team={selectedTeam}
          match={selectedMatch}
          teams={teams}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitScore}
        />
      )}
    </div>
  );
};

export default Bracket;
