import { useEffect, useState } from "react";
import type { Team } from "../../models/teams"; 

const LandingPage = () => {
  const [teams, setTeams] = useState<Team[]>([]); 

  useEffect(() => {
    // Load teams from localStorage
    const storedTeams: Team[] = JSON.parse(localStorage.getItem("teams") || "[]");
    setTeams(storedTeams);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Tournament Started!</h1>
      <h2 className="text-xl mb-2">Teams:</h2>
      <ul className="list-disc pl-6">
        {teams.length > 0 ? (
          teams.map((team) => <li key={team.id}>{team.name}</li>)
        ) : (
          <li>No teams found</li>
        )}
      </ul>
    </div>
  );
};

export default LandingPage;
