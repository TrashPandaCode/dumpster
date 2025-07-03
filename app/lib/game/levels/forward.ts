/*
 * Authors:
 *
 * Purpose:
 */
import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/game-helper";

const ARM_LENGTH = 3;
const ARM = "arm";
export const FORWARD_GAME_OBJECTS = [ARM] as const;

export const initializeForward = () => {
  const { k, game } = getKaplayCtx();

  const dataHelper = createLevelDataHelpers("forward");

  k.setGravity(100);

  addBackgrounds(["roofWithoutPerspective"]);

  const { raccoon, goalFlag } = addGameobjects(["raccoon", "goalFlag"]);

  raccoon.pos.x = -10;
  goalFlag.pos.x = 10;

  const floor1 = k.add([
    k.rect(19, 1),
    k.anchor("top"),
    k.pos(-17.2, 0),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  const floor2 = k.add([
    k.rect(18.5, 1),
    k.anchor("top"),
    k.pos(17, 0),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  const leftArmX = -3;
  const rightArmX = 3;

  const arm1 = k.add([
    "arm1",
    k.rect(0.2, ARM_LENGTH),
    k.anchor("bot"),
    k.pos(leftArmX, 4),
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
    k.pos(leftArmX, 1),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(25, 255, 25),
    k.z(2),
  ]);
  const platform = k.add([
    k.rect(5, 0.2),
    k.anchor("bot"),
    k.pos(leftArmX, -2),
    k.area(),
    k.body({ isStatic: true }),
    k.color(255, 255, 255),
    k.z(3),
  ]);

  const arm3 = k.add([
    "arm1",
    k.rect(0.2, ARM_LENGTH),
    k.anchor("bot"),
    k.pos(rightArmX, 4),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(255, 155, 25),
    k.z(1),
  ]);
  const arm4 = k.add([
    "arm2",
    k.rect(0.2, ARM_LENGTH),
    k.anchor("bot"),
    k.pos(rightArmX, 1),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(25, 25, 255),
    k.z(2),
  ]);
  const platform2 = k.add([
    k.rect(5, 0.2),
    k.anchor("bot"),
    k.pos(rightArmX, -2),
    k.area(),
    k.body({ isStatic: true }),
    k.color(255, 255, 255),
    k.z(3),
  ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    arm1.angle = dataHelper.getData("arm", "Red Rotation");
    arm2.angle = dataHelper.getData("arm", "Green Rotation") + arm1.angle;

    arm2.pos.x =
      arm1.pos.x + ARM_LENGTH * Math.sin((arm1.angle * Math.PI) / 180);
    arm2.pos.y =
      arm1.pos.y - ARM_LENGTH * Math.cos((arm1.angle * Math.PI) / 180);

    platform.pos.x =
      arm2.pos.x + ARM_LENGTH * Math.sin((arm2.angle * Math.PI) / 180);
    platform.pos.y =
      arm2.pos.y - ARM_LENGTH * Math.cos((arm2.angle * Math.PI) / 180);

    arm3.angle = dataHelper.getData("arm", "Orange Rotation");
    arm4.angle = dataHelper.getData("arm", "Blue Rotation") + arm3.angle;

    arm4.pos.x =
      arm3.pos.x + ARM_LENGTH * Math.sin((arm3.angle * Math.PI) / 180);
    arm4.pos.y =
      arm3.pos.y - ARM_LENGTH * Math.cos((arm3.angle * Math.PI) / 180);

    platform2.pos.x =
      arm4.pos.x + ARM_LENGTH * Math.sin((arm4.angle * Math.PI) / 180);
    platform2.pos.y =
      arm4.pos.y - ARM_LENGTH * Math.cos((arm4.angle * Math.PI) / 180);

    // Movement
    animPlayer(raccoon, k, {
      movementMode: "keyboard",
      updateStoreData: false,
      camClampX: {
        min: -8,
        max: 12,
      },
      playerClampX: {
        min: -12,
        max: 20,
      },
    });

    // Raccoon fall die :(
    if (raccoon.pos.y > 10) {
      raccoon.pos.x = -10;
      raccoon.pos.y = 0;
      raccoon.vel = k.vec2(0, 0);
    }

    //Handle Finish + Reset
    const distGoal = raccoon.pos.dist(goalFlag.pos);
    if (distGoal <= 1) {
      useGameStore.getState().setLevelCompleted(true);
    }
    if (dataHelper.initData()) {
      handleReset(raccoon, 1);
      raccoon.pos = k.vec2(-10, 0);
    }
  });
};
