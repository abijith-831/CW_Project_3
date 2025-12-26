import type { Team } from "../models/teams";
import { generateId } from "../utils/uuid";

export const MAX_TEAMS = 15;
export const MIN_TEAMS = 2;

/* -------------------- Create Team -------------------- */
export const createTeam = (name: string): Team => ({
  id: generateId(),
  name: name.trim(),
  rating: 1000,
  won: 0,
  lost: 0,
  played: 0,
  drawn: 0,
  goal_points: 0,
  matchHistory: [],
});

/* -------------------- Validation -------------------- */
export const validateTeamAdd = (
  teams: Team[],
  name: string
): string | null => {
  if (!name.trim()) return "Team name is required";

  if (!isValidTeamName(name))
    return "Only letters and spaces are allowed";

  if (teams.length >= MAX_TEAMS)
    return `Maximum ${MAX_TEAMS} teams allowed`;

  if (teams.some(t => t.name.toLowerCase() === name.toLowerCase()))
    return "Team already exists";

  return null;
};


export const isValidTeamName = (name: string): boolean => {
  // allows letters and spaces only
  return /^[A-Za-z ]+$/.test(name.trim());
};



/* -------------------- Validation for Update -------------------- */
export const validateTeamUpdate = (
  teams: Team[],
  editingId: string,
  name: string
): string | null => {
  if (!name.trim()) return "Team name cannot be empty";

  if (!isValidTeamName(name))
    return "Only letters and spaces are allowed";

  if (
    teams.some(
      t =>
        t.id !== editingId &&
        t.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    return "Team already exists";
  }

  return null;
};


/* -------------------- Core Import Logic -------------------- */
const normalizeNames = (names: string[]): string[] => {
  const cleaned = names
    .map(n => n.trim())
    .filter(Boolean);

  const invalidNames = cleaned.filter(n => !isValidTeamName(n));
  if (invalidNames.length > 0) {
    throw new Error(
      `Invalid team names found:\n${invalidNames.join(", ")}`
    );
  }

  const unique = Array.from(new Set(cleaned));

  if (unique.length < MIN_TEAMS)
    throw new Error(`Minimum ${MIN_TEAMS} teams required`);

  if (unique.length > MAX_TEAMS)
    throw new Error(`Maximum ${MAX_TEAMS} teams allowed`);

  return unique;
};


/* -------------------- CSV Import -------------------- */
export const importTeamsFromCSV = (csvText: string): Team[] => {
  const lines = csvText
    .split("\n")
    .map(line => line.replace(/\r/g, "").trim())
    .filter(Boolean);

  // remove header
  const names = lines.slice(1);

  const normalized = normalizeNames(names);
  return normalized.map(createTeam);
};

/* -------------------- JSON Import -------------------- */
type TeamJSON = { name: string };

export const importTeamsFromJSON = (jsonText: string): Team[] => {
  let parsed: TeamJSON[];

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("Invalid JSON file");
  }

  if (!Array.isArray(parsed))
    throw new Error("JSON must be an array");

  const names = parsed
    .map(t => t.name)
    .filter(name => typeof name === "string");

  const normalized = normalizeNames(names);
  return normalized.map(createTeam);
};
