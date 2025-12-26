export interface Match {
  matchId: string;
  homeTeamId: string;
  awayTeamId: string | null; 
  homeScore: number | null
  awayScore: number | null;
  isDraw: boolean;
  winnerId?: string | null;
  isBye: boolean;
  round: number;
}