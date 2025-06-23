import { FORWARD_GAME_OBJECTS } from "./levels/forward";
import { INVERSE_GAME_OBJECTS } from "./levels/inverse";
import { LINEAR_GAME_OBJECTS } from "./levels/linear";
import { LOOPING_GAME_OBJECTS } from "./levels/looping";
import { REVERSE_GAME_OBJECTS } from "./levels/reverse";

export const CONSTANTS = [
  "raccoon",
  "trashcanEmpty",
  "trashcanFilled",
  "goalFlag",
] as const;

export const TEMPORARIES = [
  ...FORWARD_GAME_OBJECTS,
  ...INVERSE_GAME_OBJECTS,
  ...REVERSE_GAME_OBJECTS,
  ...LINEAR_GAME_OBJECTS,
  ...LOOPING_GAME_OBJECTS,
] as const;

export const GAME_OBJECTS = [...CONSTANTS, ...TEMPORARIES] as const;
export type GameObject = (typeof GAME_OBJECTS)[number];
