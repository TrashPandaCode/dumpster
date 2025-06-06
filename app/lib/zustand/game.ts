import { create } from "zustand";

import type { LEVELS } from "../game/core/levels";

type LevelId = keyof typeof LEVELS;

interface GameState {
  isPaused: boolean;
  pause: () => void;
  play: () => void;
  currentLevel: LevelId;
  levelCompleteDialogOpen: boolean;
  setLevelCompleteDialogOpen: (open: boolean) => void;
  levelCompleted: boolean;
  setLevelCompleted: (completed: boolean) => void;
  init: (level: keyof typeof LEVELS) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPaused: false,
  pause: () => set({ isPaused: true }),
  play: () => set({ isPaused: false }),
  currentLevel: "playground",
  setCurrentLevel: (level: LevelId) => set({ currentLevel: level }),
  levelCompleteDialogOpen: false,
  setLevelCompleteDialogOpen: (open: boolean) =>
    set({ levelCompleteDialogOpen: open }),
  levelCompleted: false,
  setLevelCompleted: (completed: boolean) => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded

    const gameStoreData = {
      levelCompleted: completed,
    };

    localStorage.setItem(
      `game-store-${levelId}`,
      JSON.stringify(gameStoreData)
    );
    set({ levelCompleted: completed });
  },
  init: (level) => {
    localStorage.setItem("level", level);
    const stored = localStorage.getItem(`game-store-${level}`);
    if (!stored)
      return set({
        isPaused: false,
        currentLevel: level,
        levelCompleteDialogOpen: false,
        levelCompleted: false,
      });

    const gameStoreData = JSON.parse(stored);

    set({
      isPaused: false,
      currentLevel: level,
      levelCompleteDialogOpen: false,
      levelCompleted: gameStoreData.levelCompleted,
    });
  },
}));
