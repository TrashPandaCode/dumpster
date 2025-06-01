import { LEVELS } from "../core/levels";

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
