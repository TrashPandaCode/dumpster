const RACCOON = "raccoon";
const TRASHCAN = "trashcan";
// const EMPTY_TRASHCAN = "trashcanEmpty";
const GOAL_FLAG = "goalFlag";

export const GAME_OBJECTS = [RACCOON, TRASHCAN, GOAL_FLAG] as const;
export type GameObject = (typeof GAME_OBJECTS)[number];

export const RACCOON_SCALE = 5;
export const BACKGROUND_OFFSET = 300;
