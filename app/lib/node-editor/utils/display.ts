/*
 * Authors:
 *
 * Purpose:
 */
import type { ModifiableGameObject } from "~/lib/game/core/levels";
import type { GameObject } from "~/lib/game/game-objects";

export function getDisplayName(
  gameObject: GameObject,
  modifiableGameObjects: ModifiableGameObject[]
): string {
  const modifiableObject = modifiableGameObjects.find(
    (obj) => obj.id === gameObject
  );
  return modifiableObject?.displayName || gameObject;
}
