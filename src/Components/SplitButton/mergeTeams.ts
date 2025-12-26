// utils/mergeTeams.ts
import type { Team } from "../../models/teams";
import { MAX_TEAMS } from "../../engine/teamEngine";

export const mergeTeamsWithValidation = (
  existing: Team[],
  imported: Team[]
) => {
  const existingNames = new Set(
    existing.map(t => t.name.toLowerCase())
  );

  const duplicates = imported.filter(t =>
    existingNames.has(t.name.toLowerCase())
  );

  const uniqueImported = imported.filter(
    t => !existingNames.has(t.name.toLowerCase())
  );

  const merged = [...existing, ...uniqueImported].slice(0, MAX_TEAMS);

  return {
    merged,
    duplicates,
    skippedCount:
      existing.length + uniqueImported.length > MAX_TEAMS
        ? existing.length + uniqueImported.length - MAX_TEAMS
        : 0,
  };
};
