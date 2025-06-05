import { BOUNCE_GAME_OBJECTS } from "./levels/bounce";

export const TEMPORARIES = [...BOUNCE_GAME_OBJECTS] as const;

export type Temporary = (typeof TEMPORARIES)[number];
