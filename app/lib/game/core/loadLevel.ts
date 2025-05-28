import { handleUUID } from "~/lib/node-editor/utils";
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

  // load initial gameobjects data
  useDataStore.setState(() => {
    const result = new Map(
      curLevel.modifiableGameObjects.map((item) => [
        item.id,
        new Map(
          item.connections.map((conn) => [
            conn.label,
            { access: conn.access, value: 0 },
          ])
        ),
      ])
    );

    return { gameObjects: result };
  });

  curLevel.initialState();
};
