import { v4 as uuidv4 } from "uuid";

import type { ConnectionAccess } from "~/lib/game/core/levels";
import type { GameObject } from "~/lib/game/gameObjects";
import type { GameObjectsData } from "~/lib/zustand/data";

export function handleUUID() {
  return uuidv4().replace(/-/g, "");
}

export function getHandleIntersection(
  handleAccess: ConnectionAccess,
  gameObjects: GameObjectsData,
  selectedGameObjects: GameObject[]
): string[] {
  if (selectedGameObjects.length === 0) return [];

  const getFilteredHandles = (gameObjectLabel: GameObject): Set<string> => {
    const gameObject = gameObjects.get(gameObjectLabel);

    const handles = new Set<string>();
    if (!gameObject) return handles;
    for (const [handle, data] of gameObject) {
      if (data.access === handleAccess || data.access === "all") {
        handles.add(handle);
      }
    }
    return handles;
  };

  // Get the first game object's handles as the starting set
  const intersection = getFilteredHandles(selectedGameObjects[0]);

  // Intersect with each subsequent game object's handles
  for (let i = 1; i < selectedGameObjects.length; i++) {
    const currentHandles = getFilteredHandles(selectedGameObjects[i]);
    // Keep only handles that exist in both sets
    for (const handle of intersection) {
      if (!currentHandles.has(handle)) {
        intersection.delete(handle);
      }
    }
    // Early exit if intersection becomes empty
    if (intersection.size === 0) break;
  }
  return Array.from(intersection);
}
