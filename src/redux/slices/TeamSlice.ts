import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Team } from "../../models/teams";

interface TeamState {
  teams: Team[];
}

const initialState: TeamState = {
  teams: JSON.parse(localStorage.getItem("teams") || "[]"),
};

const persist = (teams: Team[]) => {
  localStorage.setItem("teams", JSON.stringify(teams));
};

export const teamSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    /* -------------------- CREATE -------------------- */
    addTeam: (state, action: PayloadAction<Team>) => {
      state.teams.push(action.payload);
      persist(state.teams);
    },

    /* -------------------- READ (SET ALL) -------------------- */
    setTeams: (state, action: PayloadAction<Team[]>) => {
      state.teams = action.payload;
      persist(state.teams);
    },
    // match draw
    incrementPlayed(state, action: PayloadAction<{ teamIds: string[] }>) {
      action.payload.teamIds.forEach(id => {
        const team = state.teams.find(t => t.id === id);
        if (team) {
          team.played += 1;
        }
      });
    },

    /* -------------------- UPDATE -------------------- */
    updateTeam: (
      state,
      action: PayloadAction<{ id: string; name: string }>
    ) => {
      const team = state.teams.find(t => t.id === action.payload.id);
      if (team) {
        team.name = action.payload.name;
        persist(state.teams);
      }
    },

    /* -------------------- DELETE -------------------- */
    removeTeam: (state, action: PayloadAction<string>) => {
      state.teams = state.teams.filter(t => t.id !== action.payload);
      persist(state.teams);
    },

    /* -------------------- RESET (optional) -------------------- */
    clearTeams: state => {
      state.teams = [];
      persist([]);
    },
  },
});

export const {
  addTeam,
  setTeams,
  incrementPlayed,
  updateTeam,
  removeTeam,
  clearTeams,
} = teamSlice.actions;

export default teamSlice.reducer;
