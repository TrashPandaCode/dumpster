/*
 * Authors: Leo Kling
 *
 * Purpose: This file contains a utility function to get the display name of a game object.
 */
import type { ModifiableGameObject } from "~/lib/game/core/levels";
import type { GameObject } from "~/lib/game/game-objects";

/**
 * Returns the display name of a game object.
 * If the game object is not found in the modifiableGameObjects list,
 * it returns the gameObject ID as a fallback.
 *
 * @param gameObject - The ID of the game object.
 * @param modifiableGameObjects - The list of modifiable game objects.
 * @returns The display name of the game object or its ID if not found.
 */
export function getDisplayName(
  gameObject: GameObject,
  modifiableGameObjects: ModifiableGameObject[]
): string {
  const modifiableObject = modifiableGameObjects.find(
    (obj) => obj.id === gameObject
  );
  return modifiableObject?.displayName || gameObject;
}
