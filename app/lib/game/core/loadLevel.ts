import { v4 as uuidv4 } from "uuid";

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

  useDataStore.setState(() => {
    const result = new Map<
      string,
      Map<
        string,
        {
          handleId: string;
          value: number;
        }
      >
    >();

    for (const item of curLevel.modifiableGameObjects) {
      const innerMap = new Map<string, { handleId: string; value: number }>();
      for (const conn of item.connections) {
        innerMap.set(conn, {
          handleId: uuidv4(),
          value: 0,
        });
      }
      result.set(item.id, innerMap);
    }
    return { gameObjects: result };
  });

  curLevel.initialState();
};
