import React, { useState } from "react";
import type { Team } from "../../models/teams";
import TeamDetailsModal from "../TableTeamModal/TableTeamModal";

interface Props {
  teams: Team[];
}

const RatingTable: React.FC<Props> = ({ teams }) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const sortedTeams = [...teams].sort(
    (a, b) => b.rating - a.rating
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-neutral-200 text-center">Rating Table</h1>

      <div className="overflow-x-auto  bg-black/70 backdrop-blur- text-white ">
        <table className="min-w-full ">
          <thead className=" bg-white/40 backdrop-blur-xl ">
            <tr>
              <th className=" px-4 py-2">Rank</th>
              <th className=" px-4 py-2 text-left">Team</th>
              <th className=" px-4 py-2">Played</th>
              <th className=" px-4 py-2">Won</th>
              <th className=" px-4 py-2">Drawn</th>
              <th className=" px-4 py-2">Lost</th>
              <th className=" px-4 py-2">Goals</th>
              <th className=" px-4 py-2">Rating</th>
            </tr>
          </thead>

          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className="hover:bg-white/30 hover:backdrop-blur-xl transition-transform duration-300 hover:scale-103">
                <td className=" px-12 py-2">{index + 1}</td>
                {/* CLICKABLE TEAM NAME */}
                <td className=" px-4 py-2 font-semibold  cursor-pointer hover:underline"  onClick={() => setSelectedTeam(team)}>
                  {team.name}
                </td>

                <td className=" px-4 py-2 text-center">{team.played}</td>
                <td className=" px-4 py-2 text-center">{team.won}</td>
                <td className=" px-4 py-2 text-center">{team.drawn}</td>
                <td className=" px-4 py-2 text-center">{team.lost}</td>
                <td className=" px-4 py-2 text-center">{team.goal_points}</td>
                <td className=" px-4 py-2 text-center font-bold">{team.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {teams.length === 0 && (
          <p className="text-center text-gray-500 mt-4">
            No teams available
          </p>
        )}
      </div>

      {/* MODAL */}
      {selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          teams={teams}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
};

export default RatingTable;
