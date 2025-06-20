import { INVERSE_GAME_OBJECTS } from "./levels/inverse";
import { KINEMATICS_GAME_OBJECTS } from "./levels/kinematic";
import { TIME_TRANSFORM_GAME_OBJECTS } from "./levels/time-transform";

export const TEMPORARIES = [
  ...KINEMATICS_GAME_OBJECTS,
  ...INVERSE_GAME_OBJECTS,
  ...TIME_TRANSFORM_GAME_OBJECTS,
] as const;

export type Temporary = (typeof TEMPORARIES)[number];
