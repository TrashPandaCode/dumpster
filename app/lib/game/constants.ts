import { IFFIES_GAME_OBJECTS } from "./levels/iffies";

const RACCOON = "raccoon";
const TRASHCAN_EMPTY = "trashcanEmpty";
const TRASHCAN_FILLED = "trashcanFilled";
const GOAL_FLAG = "goalFlag";

export const GAME_OBJECTS = [
  RACCOON,
  TRASHCAN_EMPTY,
  TRASHCAN_FILLED,
  GOAL_FLAG,

  // Game objects from the Iffies level
  ...IFFIES_GAME_OBJECTS,
] as const;
export type GameObject = (typeof GAME_OBJECTS)[number];

export const RACCOON_SCALE = 5.5;
export const BACKGROUND_OFFSET = 260;
