import { useState } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import type { Team } from "../../models/teams";
import { removeTeam, updateTeam } from "../../redux/slices/TeamSlice";
import { validateTeamUpdate } from "../../engine/teamEngine";


type Props = {
  teams: Team[];
};

const TeamList = ({ teams }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  /* -------------------- Delete -------------------- */
  const handleDelete = (id: string) => {
    if (confirm("Remove this team?")) {
      dispatch(removeTeam(id));
    }
  };

  /* -------------------- Start Edit -------------------- */
  const handleEditStart = (team: Team) => {
    setEditingId(team.id);
    setEditName(team.name);
  };

  /* -------------------- Save Edit -------------------- */
  const handleEditSave = () => {
  if (!editingId) return;

  const error = validateTeamUpdate(teams, editingId, editName);
  if (error) {
    alert(error);
    return;
  }

  dispatch(
    updateTeam({
      id: editingId,
      name: editName.trim(),
    })
  );

  setEditingId(null);
  setEditName("");
};


  return (
    <div className="mb-5 border p-3 max-h-56 overflow-y-auto bg-gray-50">
      {teams.map((team, index) => (
        <div
          key={team.id}
          className="flex items-center justify-between py-2 text-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 text-right text-gray-400">
              {index + 1}.
            </span>

            {editingId === team.id ? (
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className="border px-2 py-1 text-sm"
              />
            ) : (
              <span className="font-medium">{team.name}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {editingId === team.id ? (
              <>
                <button
                  onClick={handleEditSave}
                  className="px-2 py-1 bg-green-600 text-white text-xs"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-2 py-1 bg-gray-400 text-white text-xs"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEditStart(team)}
                  className="px-2 py-1 bg-yellow-500 text-white text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="px-2 py-1 bg-red-600 text-white text-xs"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeamList;
