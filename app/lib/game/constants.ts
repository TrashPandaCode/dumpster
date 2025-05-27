const RACCOON = "raccoon";
const TRASHCAN = "trashcan";
const GOAL_FLAG = "goalFlag";

export const GAME_OBJECTS = [RACCOON, TRASHCAN, GOAL_FLAG] as const;
export type GameObject = (typeof GAME_OBJECTS)[number];

export const RACCOON_SCALE = 5;
