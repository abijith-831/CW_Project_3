import type { Match } from "./match";

export type Team = {
  id: string;
  name: string;
  rating: number;
  won: number;
  lost: number;
  played: number;
  drawn: number;
  goal_points: number;
  matchHistory: Match[];
};
