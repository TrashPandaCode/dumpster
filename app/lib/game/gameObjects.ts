import { CONSTANTS } from "./constants";
import { TEMPORARIES } from "./temporaries";

export const GAME_OBJECTS = [...CONSTANTS, ...TEMPORARIES] as const;
export type GameObject = (typeof GAME_OBJECTS)[number];
