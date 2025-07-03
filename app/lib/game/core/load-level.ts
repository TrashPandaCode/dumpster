/*
 * Authors: Leo Kling, Jonathan Kron
 *
 * Purpose: This module initializes the level by calling the initialState function of the level.
 */
import { LEVELS, type LevelId } from "./levels";

/**
 * Initializes the level by calling the initialState function of the level.
 * @param level Name of the level to load.
 */
export const loadLevel = (level: LevelId) => {
  const curLevel = LEVELS[level];

  curLevel.initialState();
};
