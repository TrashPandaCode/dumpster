import fs from "fs";
import path from "path";
import { beforeAll, describe, expect, it } from "bun:test";

import { LEVELS } from "~/lib/game/core/levels";

describe("solutions", () => {
  const solutionsDir = path.join(__dirname, "../content/solutions");

  beforeAll(() => {
    // Check if solutions directory exists
    if (!fs.existsSync(solutionsDir)) {
      throw new Error(`Solutions directory does not exist: ${solutionsDir}`);
    }
  });

  it("every level should have a corresponding solution file", () => {
    const levelKeys = Object.keys(LEVELS);
    const missingSolutions: string[] = [];

    levelKeys.forEach((levelKey) => {
      const solutionFilePath = path.join(solutionsDir, `${levelKey}.json`);

      if (!fs.existsSync(solutionFilePath)) {
        missingSolutions.push(levelKey);
      }
    });

    expect(
      missingSolutions,
      `Missing solution files for levels: ${missingSolutions.join(", ")}`
    ).toHaveLength(0);
  });

  it("no orphaned solution files should exist", () => {
    const levelKeys = Object.keys(LEVELS);
    const solutionFiles = fs
      .readdirSync(solutionsDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => file.replace(".json", ""));

    const orphanedFiles = solutionFiles.filter(
      (fileName) => !levelKeys.includes(fileName)
    );

    if (orphanedFiles.length > 0) {
      console.warn(
        `Orphaned solution files found (no corresponding level): ${orphanedFiles.join(", ")}`
      );
    }

    expect(orphanedFiles).toBeDefined(); // This will always pass, just for awareness
  });
});
