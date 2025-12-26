import { importTeamsFromJSON, importTeamsFromCSV } from "../../engine/teamEngine";
import type { Team } from "../../models/teams";

/**
 * Generic handler for importing teams from a file
 * Supports CSV and JSON
 */
export const handleTeamFileImport = async (file: File): Promise<Team[]> => {
  const text = await file.text();

  // JSON
  if (file.type === "application/json" || file.name.endsWith(".json")) {
    return importTeamsFromJSON(text);
  }

  // CSV / TXT
  if (
    file.type === "text/csv" ||
    file.name.endsWith(".csv") ||
    file.name.endsWith(".txt")
  ) {
    return importTeamsFromCSV(text);
  }

  throw new Error("Unsupported file type");
};

/**
 * Helper to create a file input dynamically and get the selected file
 */
export const selectFile = (accept: string): Promise<File> => {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;

    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) resolve(file);
      else reject(new Error("No file selected"));
    };

    input.click();
  });
};
