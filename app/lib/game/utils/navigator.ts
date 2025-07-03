/*
 * Authors:
 *
 * Purpose:
 */
import { LEVELS } from "../core/levels";

/**
 * Retrieves the neighboring levels of the current level.
 * Returns an object containing the previous and next levels.
 * If the current level is the first or last, it returns undefined for the respective neighbor.
 * @param curLevel - The current level key.
 * @returns An object with 'prev' and 'next' keys or undefined if the current level is not found.
 */
export function getNeighborLevels(curLevel: string) {
  const keys = Object.keys(LEVELS);
  const currentIndex = keys.indexOf(curLevel);

  if (currentIndex === -1) {
    return undefined;
  }

  return {
    prev: currentIndex === 0 ? undefined : keys[currentIndex - 1],
    next: currentIndex === keys.length - 1 ? undefined : keys[currentIndex + 1],
  };
}
