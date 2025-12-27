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
    <div className="px-2 sm:px-6 md:px-12 py-6">
       
      <h1 className="text-2xl  mb-4  text-center text-gray-900 ">Rating Table</h1>

      <div className="overflow-x-auto  shadow-lg ">
        <table className="min-w-full border text-gray-900  border-gray-400 bg-white">
          <thead className=" bg-gray-200  border ">
            <tr>
              <th className=" px-4 py-3">Rank</th>
              <th className=" px-4 py-3 text-left">Team</th>
              <th className=" px-4 py-3">Played</th>
              <th className=" px-4 py-3">Won</th>
              <th className=" px-4 py-3">Drawn</th>
              <th className=" px-4 py-3">Lost</th>
              <th className=" px-4 py-3">Goals</th>
              <th className=" px-4 py-3">Rating</th>
            </tr>
          </thead>

          <tbody>
            {sortedTeams.map((team, index) => (
              <tr key={team.id} className=" odd:bg-gray-50 even:bg-gray-100 hover:bg-neutral-200 transition-colors transition-transform duration-300 hover:scale-103 ">

                <td className=" px-12 py-3">{index + 1}</td>
                {/* CLICKABLE TEAM NAME */}
                <td className=" px-4 py-3   cursor-pointer hover:underline"  onClick={() => setSelectedTeam(team)}>
                  {team.name}
                </td>

                <td className=" px-4 py-3 text-center">{team.played}</td>
                <td className=" px-4 py-3 text-center">{team.won}</td>
                <td className=" px-4 py-3 text-center">{team.drawn}</td>
                <td className=" px-4 py-3 text-center">{team.lost}</td>
                <td className=" px-4 py-3 text-center">{team.goal_points}</td>
                <td className=" px-4 py-3 text-center font-bold">{team.rating}</td>
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
