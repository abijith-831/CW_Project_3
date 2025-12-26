import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { addTeam, setTeams } from "../../redux/slices/TeamSlice";

import SplitButton from "../../Components/SplitButton";
import {
  MAX_TEAMS,
  MIN_TEAMS,
  createTeam,
  validateTeamAdd,
} from "../../engine/teamEngine";
import {
  handleTeamFileImport,
  selectFile,
} from "../../Components/SplitButton/importTeams";
import TeamList from "./TeamList";
import { mergeTeamsWithValidation } from "../../Components/SplitButton/mergeTeams";

const TeamAddingPage = ({ onStart }: { onStart: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const teams = useSelector((state: RootState) => state.teams.teams);
  const [teamName, setTeamName] = useState("");

  // -------------------- Add Single Team --------------------
  const handleAddTeam = () => {
    const error = validateTeamAdd(teams, teamName);
    if (error) return alert(error);

    dispatch(addTeam(createTeam(teamName)));
    setTeamName("");
  };

  // -------------------- Overwrite Confirmation --------------------
  const shouldOverwriteTeams = (
    existingCount: number,
    importedCount: number
  ): boolean => {
    if (existingCount + importedCount <= MAX_TEAMS) return false;

    return window.confirm(
      "Importing these teams will overwrite manually added teams. Do you want to continue?"
    );
  };

  // -------------------- Generic Import Handler (JSON + CSV) --------------------
  const handleImport = async (accept: ".json" | ".csv") => {
    try {
      const file = await selectFile(accept);
      const importedTeams = await handleTeamFileImport(file);

      const overwrite = shouldOverwriteTeams(
        teams.length,
        importedTeams.length
      );

      if (overwrite) {
        dispatch(setTeams(importedTeams.slice(0, MAX_TEAMS)));
        return;
      }

      const { merged, duplicates, skippedCount } =
        mergeTeamsWithValidation(teams, importedTeams);

      if (duplicates.length > 0) {
        alert(
          `${duplicates.length} duplicate teams were skipped:\n` +
            duplicates.map((t) => t.name).join(", ")
        );
      }

      if (skippedCount > 0) {
        alert(`Team limit reached. ${skippedCount} teams were ignored.`);
      }

      dispatch(setTeams(merged));
    } catch (err: any) {
      alert(err.message);
    }
  };

  // -------------------- Start Tournament --------------------
  const handleStartTournament = () => {
    if (teams.length < MIN_TEAMS) {
      alert(`Add at least ${MIN_TEAMS} teams`);
      return;
    }
    localStorage.setItem("tournamentStarted", "true");
    onStart();
  };

  // -------------------- SplitButton Items --------------------
  const importItems = [
    {
      index: 0,
      children: "Import as JSON",
      onClickHandler: () => handleImport(".json"),
    },
    {
      index: 1,
      children: "Import as CSV",
      onClickHandler: () => handleImport(".csv"),
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover"
      style={{ backgroundImage: "url('bg/bg-league.jpg')" }}
    >
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Cloudwick Premier League
        </h1>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Team Setup
        </h2>

        {/* Add Team */}
        <div className="flex flex-col mb-6 space-y-6">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            disabled={teams.length >= MAX_TEAMS}
            className="w-full border-2 border-gray-600 px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
          />

          <button
            onClick={handleAddTeam}
            disabled={teams.length >= MAX_TEAMS}
            className="w-60 px-4 py-2 bg-gray-900 text-white font-semibold hover:bg-gray-700 disabled:bg-gray-400 mx-auto"
          >
            Add Team
          </button>
        </div>

        {/* Import */}
        <div className="flex justify-center mb-6">
          <SplitButton label="Import Teams" items={importItems} />
        </div>

        {/* Count */}
        <p className="text-md text-center mb-4 text-gray-800">
          Teams Added:{" "}
          <span className="font-semibold">{teams.length}</span> / {MAX_TEAMS}
        </p>

        {/* Team List */}
        {teams.length > 0 && (
          <>
            <TeamList teams={teams} />
            <div className="flex justify-center">
              <button
                onClick={handleStartTournament}
                className="w-60 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold"
              >
                Start Tournament
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeamAddingPage;
