import { IFFIES_GAME_OBJECTS } from "./levels/iffies";

export const TEMPORARIES = [...IFFIES_GAME_OBJECTS] as const;

export type Temporary = (typeof TEMPORARIES)[number];
