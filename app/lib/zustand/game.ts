import { create } from "zustand";
import type { LEVELS } from "../game/core/levels";

type LevelId = keyof typeof LEVELS;

interface GameState {
  isPaused: boolean;
  pause: () => void;
  play: () => void;
  currentLevel: LevelId;
  setCurrentLevel: (level: LevelId) => void;
}

export const useGameStore = create<GameState>((set) => ({
  isPaused: false,
  pause: () => set({ isPaused: true }),
  play: () => set({ isPaused: false }),
  currentLevel: "playground",
  setCurrentLevel: (level: LevelId) => set({ currentLevel: level }),
}));
