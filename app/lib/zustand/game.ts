/*
 * Authors: Jonathan Kron, Leo Kling, Markus Heming
 *
 * Purpose:
 * This Zustand store manages the game's state, including pause/play status, current level, level completion, dialog visibility, and persistence of progress in localStorage.
 */
import { create } from "zustand";

import type { LevelId } from "../game/core/levels";

interface GameState {
  isPaused: boolean;
  pause: () => void;
  play: () => void;
  currentLevel: LevelId;
  levelCompleteDialogOpen: boolean;
  setLevelCompleteDialogOpen: (open: boolean) => void;
  levelCompleted: boolean;
  setLevelCompleted: (completed: boolean) => void;
  init: (level: LevelId) => void;
}

/**
 * Game state management using Zustand.
 * This store manages the game state, including pause/play status,
 * current level, level completion status, and dialog visibility.
 */
export const useGameStore = create<GameState>((set, get) => ({
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
    if (completed && !get().levelCompleted) {
      get().setLevelCompleteDialogOpen(true);
    }

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

    set({
      isPaused: false,
      currentLevel: level,
      levelCompleteDialogOpen: false,
      levelCompleted: stored ? JSON.parse(stored).levelCompleted : false,
    });
  },
}));
