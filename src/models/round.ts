import type { Match } from "./match";
import type { Team } from "./teams";

export interface Round {
  roundNumber: number;
  matches: Match[];
  teams: Team[];
}