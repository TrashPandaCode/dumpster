import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

const ARM_LENGTH = 3;
const ARM = "arm";
export const KINEMATICS_GAME_OBJECTS = [ARM] as const;

export const initializeKinematics = () => {
  const { k, game } = getKaplayCtx();
  const dataStore = useDataStore.getState();

  k.setGravity(100);

  addBackgrounds(["background2"]);

  const { raccoon, goalFlag } = addGameobjects(["raccoon", "goalFlag"]);
  k.setCamPos(7.5, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  goalFlag!.pos.x = 18;

  const floor1 = k.add([
    k.rect(20, 1),
    k.anchor("top"),
    k.pos(-8, 0),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  const floor2 = k.add([
    k.rect(20, 1),
    k.anchor("top"),
    k.pos(27, 0),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  const arm1 = k.add([
    "arm1",
    k.rect(0.2, ARM_LENGTH),
    k.anchor("bot"),
    k.pos(8, 4),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(255, 25, 25),
    k.z(1),
  ]);
  const arm2 = k.add([
    "arm2",
    k.rect(0.2, ARM_LENGTH),
    k.anchor("bot"),
    k.pos(8, 1),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(25, 255, 25),
    k.z(2),
  ]);
  const platform = k.add([
    k.rect(4, 0.2),
    k.anchor("bot"),
    k.pos(8, -2),
    k.area(),
    k.body({ isStatic: true }),
    k.color(25, 25, 255),
    k.z(3),
  ]);

  // Initialize data store
  dataStore.setData("arm", "joint1x", arm1.pos.x);
  dataStore.setData("arm", "joint1y", arm1.pos.y);

  dataStore.setData("arm", "joint2x", arm2.pos.x);
  dataStore.setData("arm", "joint2y", arm2.pos.y);

  dataStore.setData("arm", "joint3x", platform.pos.x);
  dataStore.setData("arm", "joint3y", platform.pos.y);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    arm1.angle = dataStore.getData("arm", "joint1rot");
    arm2.angle = dataStore.getData("arm", "joint2rot") + arm1.angle;

    arm2.pos.x =
      arm1.pos.x + ARM_LENGTH * Math.sin((arm1.angle * Math.PI) / 180);
    arm2.pos.y =
      arm1.pos.y - ARM_LENGTH * Math.cos((arm1.angle * Math.PI) / 180);

    platform.pos.x =
      arm2.pos.x + ARM_LENGTH * Math.sin((arm2.angle * Math.PI) / 180);
    platform.pos.y =
      arm2.pos.y - ARM_LENGTH * Math.cos((arm2.angle * Math.PI) / 180);

    dataStore.setData("arm", "joint1x", arm1.pos.x);
    dataStore.setData("arm", "joint1y", arm1.pos.y);

    dataStore.setData("arm", "joint2x", arm2.pos.x);
    dataStore.setData("arm", "joint2y", arm2.pos.y);

    dataStore.setData("arm", "joint3x", platform.pos.x);
    dataStore.setData("arm", "joint3y", platform.pos.y);

    // Movement
    animPlayer(raccoon!, k, "input", undefined, undefined, {
      minX: 5,
      maxX: 15,
    });
    k.onKeyDown("space", () => {
      if (raccoon!.isGrounded()) {
        raccoon!.jump(20);
      }
    });
    // Raccoon fall die :(
    if (raccoon!.pos.y > 10) {
      raccoon!.pos.x = 0;
      raccoon!.pos.y = 0;
    }

    //Handle Finish + Reset
    const distGoal = raccoon!.pos.dist(goalFlag!.pos);
    if (distGoal <= 1 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
    if (dataStore.initData) {
      handleReset(raccoon!, 1);
    }
  });
};
