// redux/slices/roundsSlice.ts
import { createSlice  } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type { Round } from "../../models/round";
import type { Match } from '../../models/match'

interface RoundsState {
  rounds: Round[];
}

const initialState: RoundsState = {
  rounds: []
};

const roundsSlice = createSlice({
  name: "rounds",
  initialState,
  reducers: {
    /** Create a new round */
    addRound(state, action: PayloadAction<Round>) {
      state.rounds.push(action.payload);
    },

    /** Set all rounds at once (useful after generation) */
    setRounds(state, action: PayloadAction<Round[]>) {
      state.rounds = action.payload;
    },

    /** Update match result */
    updateMatchResult(
      state,
      action: PayloadAction<{
        roundNumber: number;
        matchId: string;
        homeScore: number | null;
        awayScore: number | null;
        winnerId: string | null;
        isDraw: boolean;
      }>
    ) {
      const round = state.rounds.find(
        r => r.roundNumber === action.payload.roundNumber
      );
      if (!round) return;

      const match = round.matches.find(
        m => m.matchId === action.payload.matchId
      );
      if (!match) return;

      match.homeScore = action.payload.homeScore;
      match.awayScore = action.payload.awayScore;
      match.winnerId = action.payload.winnerId;
      match.isDraw = action.payload.isDraw;
    },

    /** Reset everything */
    resetRounds(state) {
      state.rounds = [];
    }
  }
});

export const {
  addRound,
  setRounds,
  updateMatchResult,
  resetRounds
} = roundsSlice.actions;

export default roundsSlice.reducer;
