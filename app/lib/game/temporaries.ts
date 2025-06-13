import { BOUNCE_GAME_OBJECTS } from "./levels/bounce";
import { PARENTING_GAME_OBJECTS } from "./levels/parenting";
import { KINEMATICS_GAME_OBJECTS } from "./levels/kinematic";

export const TEMPORARIES = [
  ...BOUNCE_GAME_OBJECTS,
  ...PARENTING_GAME_OBJECTS,
  ...KINEMATICS_GAME_OBJECTS,
] as const;

export type Temporary = (typeof TEMPORARIES)[number];
