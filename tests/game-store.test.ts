import { describe, expect, test } from "@jest/globals";

import type { LevelId } from "../app/lib/game/core/levels";
import { useGameStore } from "../app/lib/zustand/game";

// Test suite for the game store
describe("Game Store", () => {
  test("should initialize with default values", () => {
    const store = useGameStore.getState();
    expect(store.isPaused).toBe(false);
    expect(store.currentLevel).toBe("playground");
    expect(store.levelCompleteDialogOpen).toBe(false);
    expect(store.levelCompleted).toBe(false);
  });

  test("should pause and play the game", () => {
    const store = useGameStore.getState();
    store.pause();
    expect(store.isPaused).toBe(true);
    store.play();
    expect(store.isPaused).toBe(false);
  });

  test("should set current level", () => {
    const store = useGameStore.getState();
    const newLevel: LevelId = "sitting";
    store.init(newLevel);
    expect(store.currentLevel).toBe(newLevel);
  });

  test("should handle level completion state", () => {
    const store = useGameStore.getState();
    store.setLevelCompleted(true);
    expect(store.levelCompleted).toBe(true);

    // Check localStorage
    const storedData = localStorage.getItem(`game-store-${store.currentLevel}`);
    expect(storedData).toBe('{"levelCompleted":true}');
  });

  test("should open and close level complete dialog", () => {
    const store = useGameStore.getState();
    store.setLevelCompleteDialogOpen(true);
    expect(store.levelCompleteDialogOpen).toBe(true);
    store.setLevelCompleteDialogOpen(false);
    expect(store.levelCompleteDialogOpen).toBe(false);
  });
});
