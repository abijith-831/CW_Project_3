import { useEffect, useState } from "react";
import type { Team } from "../../models/teams";
import type { Match } from "../../models/match";
// import ExportSingleTeam from "./SplitButton/ExportSingleTeam";
import { useForm } from "react-hook-form";

type FormValues = {
  goals: number;
};

type Props = {
  team: Team;
  match: Match;
  teams: Team[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (matchId: string, teamId: string, goals: number) => void;
};

const TeamModal = ({
  team,
  match,
  teams,
  isOpen,
  onClose,
  onSubmit,
}: Props) => {

  const {  register,  handleSubmit,  formState: { errors },  reset, } = useForm<FormValues>({  defaultValues: {    goals: 0,  },});

  const visibleHistory = team.matchHistory
    .filter((m) => m.round <= match.round)
    .sort((a, b) => a.round - b.round);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const onSubmitForm = (data: FormValues) => {
  onSubmit(match.matchId, team.id, data.goals);
  reset();
  onClose();
};


  const isLocked =
    (team.id === match.homeTeamId && match.homeScore !== null) ||
    (team.id === match.awayTeamId && match.awayScore !== null);

  return (
    // Overlay
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}  >
      {/* Modal box */}
      <div  className="bg-white p-6 w-[720px] max-h-[90vh] overflow-y-auto  shadow-lg"  onClick={(e) => e.stopPropagation()} >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{team.name}</h2>
          {/* <ExportSingleTeam team={team} /> */}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-gray-100 p-2 rounded">
            <p className="text-gray-500">Rating</p>
            <p className="font-semibold">{team.rating}</p>
          </div>

          <div className="bg-gray-100 p-2 rounded">
            <p className="text-gray-500">Goal Points</p>
            <p className="font-semibold">{team.goal_points}</p>
          </div>

          <div className="bg-gray-100 p-2 rounded">
            <p className="text-gray-500">Played</p>
            <p className="font-semibold">{team.played}</p>
          </div>

          <div className="bg-gray-100 p-2 rounded">
            <p className="text-gray-500">Won</p>
            <p className="font-semibold text-green-600">{team.won}</p>
          </div>

          <div className="bg-gray-100 p-2 rounded">
            <p className="text-gray-500">Lost</p>
            <p className="font-semibold text-red-600">{team.lost}</p>
          </div>

          <div className="bg-gray-100 p-2 rounded">
            <p className="text-gray-500">Drawn</p>
            <p className="font-semibold text-orange-600">{team.drawn}</p>
          </div>
        </div>

        {/* MATCH HISTORY */}
        <div className="border-t pt-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Match History
          </h3>

          <div className="space-y-2 max-h-52 overflow-y-auto">
            {visibleHistory.map((m) => {
              const home = teams.find((t) => t.id === m.homeTeamId);
              const away = m.awayTeamId
                ? teams.find((t) => t.id === m.awayTeamId)
                : null;

              const isDraw =
                  m.homeScore !== null &&
                  m.awayScore !== null &&
                  m.homeScore === m.awayScore;

                const isWin = !isDraw && m.winnerId === team.id;
                const isLoss = !isDraw && m.winnerId !== null && m.winnerId !== team.id;


              return (
                <div  key={m.matchId}  className={`flex justify-between items-center text-sm p-2 rounded
                    ${
                      isDraw
                        ? "bg-orange-50"
                        : isWin
                        ? "bg-green-50"
                        : "bg-red-50"
                    } `} >
                  <span className="text-gray-500 font-medium">
                    R{m.round}
                  </span>

                  <span className="font-semibold text-center flex-1">
                    {home?.name} {m.homeScore ?? "—"} :{" "}
                    {m.awayScore ?? "—"} {away?.name ?? "BYE"}
                  </span>

                  <span className={
                      isDraw
                        ? "text-orange-600"
                        : isWin
                        ? "text-green-600"
                        : "text-red-600"  }  >
                    {isDraw ? "D" : isWin ? "W" : "L"}
                  </span>
                </div>

              );
            })}
          </div>
        </div>

        {/* SCORE INPUT (BELOW MATCH HISTORY) */}
        {!isLocked ? (
          <div className="border-t pt-4">
            <label className="block mb-1 font-medium text-sm">
              Enter Goals
            </label>

          <input type="number"
              className={`border p-2 w-full rounded mb-1 ${
              errors.goals ? "border-red-500" : ""
            }`}
            {...register("goals", {
              valueAsNumber: true, 
              required: "Goals are required",
              min: {
                value: 0,
                message: "Goals cannot be less than 0",
              },
              max: {
                value: 10,
                message: "Goals cannot be more than 50",
              },
            })} />

          {errors.goals && (
            <p className="text-red-500 text-xs mt-1">
              {errors.goals.message}
            </p>
          )}

            <div className="flex justify-end gap-2">
              <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose} >
                Cancel
              </button>

              <button  className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleSubmit(onSubmitForm)}>
                Submit
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Score already submitted 🔒
          </p>
        )}
      </div>
    </div>
  );
};

export default TeamModal;
