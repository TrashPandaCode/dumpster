import { create } from "zustand";
import type { LEVELS } from "../game/core/levels";

type LevelId = keyof typeof LEVELS;

interface GameState {
  isPaused: boolean;
  pause: () => void;
  play: () => void;
  currentLevel: LevelId;
  setCurrentLevel: (level: LevelId) => void;
  levelDialogOpen: boolean;
  setLevelDialogOpen: (open: boolean) => void;
  levelCompleteDialogOpen: boolean;
  setLevelCompleteDialogOpen: (open: boolean) => void;
  levelCompleted: boolean;
  setLevelCompleted: (completed: boolean) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPaused: false,
  pause: () => set({ isPaused: true }),
  play: () => set({ isPaused: false }),
  currentLevel: "playground",
  setCurrentLevel: (level: LevelId) => set({ currentLevel: level }),
  levelDialogOpen: true,
  setLevelDialogOpen: (open: boolean) => set({ levelDialogOpen: open }),
  levelCompleteDialogOpen: false,
  setLevelCompleteDialogOpen: (open: boolean) => set({ levelCompleteDialogOpen: open }),
  levelCompleted: false,
  setLevelCompleted: (completed: boolean) => set({ levelCompleted: completed}),
  reset: () => set({
    isPaused: false,
    currentLevel: "playground",
    levelCompleteDialogOpen: false,
    levelCompleted: false,
  }),
}));
