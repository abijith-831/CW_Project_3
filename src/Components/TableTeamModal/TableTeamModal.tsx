import React from "react";
import type { Team } from "../../models/teams";

interface Props {
  team: Team;
  teams: Team[];
  onClose: () => void;
}

const TeamDetailsModal: React.FC<Props> = ({ team, teams, onClose }) => {
  const getTeamName = (id: string | null) => {
    if (!id) return "—";
    return teams.find(t => t.id === id)?.name || "Unknown";
  };

  return (
    /* Overlay */
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose} >
      {/* Modal */}
      <div className="bg-white  w-[720px] max-h-[85vh] overflow-y-auto p-6 shadow-xl" onClick={e => e.stopPropagation()}>
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{team.name}</h2>
          <button onClick={onClose}  className="text-gray-400 hover:text-black text-2xl">
            ✕
          </button>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-500">Rating</p>
            <p className="font-semibold">{team.rating}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-500">Goal Points</p>
            <p className="font-semibold">{team.goal_points}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-500">Played</p>
            <p className="font-semibold">{team.played}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-500">Won</p>
            <p className="font-semibold text-green-600">{team.won}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-500">Lost</p>
            <p className="font-semibold text-red-600">{team.lost}</p>
          </div>

          <div className="bg-gray-100 p-3 rounded">
            <p className="text-gray-500">Drawn</p>
            <p className="font-semibold text-orange-600">{team.drawn}</p>
          </div>
        </div>

        {/* MATCH HISTORY */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Match History
          </h3>

          {team.matchHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No matches played</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {team.matchHistory.map((match, index) => {
                const homeTeam = getTeamName(match.homeTeamId);
                const awayTeam = getTeamName(match.awayTeamId);

                const isDraw =
                  match.homeScore !== null &&
                  match.awayScore !== null &&
                  match.homeScore === match.awayScore;

                const isWin = !isDraw && match.winnerId === team.id;

                return (
                  <div
                    key={index}
                    className={`flex justify-between items-center p-3 rounded text-sm
                      ${
                        isDraw
                          ? "bg-orange-50"
                          : isWin
                          ? "bg-green-50"
                          : "bg-red-50"
                      }
                    `} >
                    <span className="text-gray-500 font-medium">
                      R{match.round}
                    </span>

                    <span className="font-semibold flex-1 text-center">
                      {homeTeam} {match.homeScore ?? "—"} :{" "}
                      {match.awayScore ?? "—"} {awayTeam}
                    </span>

                    <span className={
                        isDraw
                          ? "text-orange-600"
                          : isWin
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {isDraw ? "DRAW" : isWin ? "WIN" : "LOSS"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailsModal;
