import { INVERSE_GAME_OBJECTS } from "./levels/inverse";
import { KINEMATICS_GAME_OBJECTS } from "./levels/kinematic";

export const TEMPORARIES = [
  ...KINEMATICS_GAME_OBJECTS,
  ...INVERSE_GAME_OBJECTS,
] as const;

export type Temporary = (typeof TEMPORARIES)[number];
