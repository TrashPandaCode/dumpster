const RACCOON = "raccoon";
const TRASHCAN_EMPTY = "trashcanEmpty";
const TRASHCAN_FILLED = "trashcanFilled";
const GOAL_FLAG = "goalFlag";

export const CONSTANTS = [
  RACCOON,
  TRASHCAN_EMPTY,
  TRASHCAN_FILLED,
  GOAL_FLAG,
] as const;
export type Constant = (typeof CONSTANTS)[number];

export const SPRITE_SCALE = 0.1;
export const BACKGROUND_OFFSET = 4.727;
export const CAM_SCALE = 55;

export const SMALL_FLAG_OFFSET = 30;
