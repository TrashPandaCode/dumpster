import { INVERSE_GAME_OBJECTS } from "./levels/inverse";
import { KINEMATICS_GAME_OBJECTS } from "./levels/kinematic";
import { PARENTING_GAME_OBJECTS } from "./levels/parenting";

export const TEMPORARIES = [
  ...PARENTING_GAME_OBJECTS,
  ...KINEMATICS_GAME_OBJECTS,
  ...INVERSE_GAME_OBJECTS,
] as const;

export type Temporary = (typeof TEMPORARIES)[number];
