import { useDataStore } from "~/lib/zustand/data";
import { LEVELS } from "./levels";

/**
 * Initializes the level by calling the initialState function of the level.
 * @param level Name of the level to load.
 */
export const loadLevel = (level: string) => {
  if (!(level in LEVELS)) {
    throw new Error(`Level ${level} not found`);
  }

  const curLevel = LEVELS[level as keyof typeof LEVELS];

  useDataStore.getState().init(curLevel.modifiableGameObjects);
  curLevel.initialState();
};
