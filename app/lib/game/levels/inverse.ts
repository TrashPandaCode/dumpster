import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/game-helper";

const JOINT_1 = "joint1";
const JOINT_1_LENGTH = 3;
const JOINT_2 = "joint2";
const JOINT_2_LENGTH = 3;
const JOINT_3 = "joint3";
const JOINT_3_LENGTH = 3;
const ENDEFFECTOR = "endeffector";
export const INVERSE_GAME_OBJECTS = [
  JOINT_1,
  JOINT_2,
  JOINT_3,
  ENDEFFECTOR,
] as const;

export const initializeInverse = () => {
  const { k, game } = getKaplayCtx();

  k.setGravity(100);

  addBackgrounds(["default"]);
  const { raccoon } = addGameobjects(["raccoon"]);

  const floor1 = k.add([
    k.rect(100, 1),
    k.anchor("top"),
    k.pos(-17.2, 0),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  const dataHelper = createLevelDataHelpers("inverse");

  dataHelper.setData("endeffector", "x", () => setJointPos().end.x);
  dataHelper.setData("endeffector", "y", () => setJointPos().end.y);
  dataHelper.setData("joint1", "x", () => setJointPos().joint1.x);
  dataHelper.setData("joint1", "y", () => setJointPos().joint1.y);
  dataHelper.setData("joint2", "x", () => setJointPos().joint2.x);
  dataHelper.setData("joint2", "y", () => setJointPos().joint2.y);
  dataHelper.setData("joint3", "x", () => setJointPos().joint3.x);
  dataHelper.setData("joint3", "y", () => setJointPos().joint3.y);

  const joint1 = k.add([
    "joint1",
    k.rect(0.2, JOINT_1_LENGTH),
    k.anchor("bot"),
    k.pos(0, 0),
    k.rotate(0),
    k.color(255, 0, 0),
    k.z(5),
  ]);
  const joint2 = k.add([
    "joint2",
    k.rect(0.2, JOINT_2_LENGTH),
    k.anchor("bot"),
    k.pos(0, 0),
    k.rotate(0),
    k.color(0, 255, 0),
    k.z(6),
  ]);
  const joint3 = k.add([
    "joint3",
    k.rect(0.2, JOINT_3_LENGTH),
    k.anchor("bot"),
    k.pos(0, 0),
    k.rotate(0),
    k.color(0, 0, 255),
    k.z(7),
  ]);
  const endeffector = k.add([
    "endeffector",
    k.circle(0.25),
    k.anchor("center"),
    k.pos(0, 0),
    k.color(255, 255, 255),
    k.z(8),
  ]);

  // this function is computed multiple times unecessarily
  // there are prob. ways to make this more efficient
  function setJointPos(): {
    joint1: { x: number; y: number };
    joint2: { x: number; y: number };
    joint3: { x: number; y: number };
    end: { x: number; y: number };
  } {
    joint1.angle = dataHelper.getData("joint1", "rotation");
    joint2.angle = dataHelper.getData("joint2", "rotation");
    joint3.angle = dataHelper.getData("joint3", "rotation");

    joint2.pos.x =
      joint1.pos.x + JOINT_1_LENGTH * Math.sin((joint1.angle * Math.PI) / 180);
    joint2.pos.y =
      joint1.pos.y - JOINT_1_LENGTH * Math.cos((joint1.angle * Math.PI) / 180);

    joint3.pos.x =
      joint2.pos.x + JOINT_2_LENGTH * Math.sin((joint2.angle * Math.PI) / 180);
    joint3.pos.y =
      joint2.pos.y - JOINT_2_LENGTH * Math.cos((joint2.angle * Math.PI) / 180);

    endeffector.pos.x =
      joint3.pos.x + JOINT_3_LENGTH * Math.sin((joint3.angle * Math.PI) / 180);
    endeffector.pos.y =
      joint3.pos.y - JOINT_3_LENGTH * Math.cos((joint3.angle * Math.PI) / 180);
    return {
      joint1: joint1.pos,
      joint2: joint2.pos,
      joint3: joint3.pos,
      end: endeffector.pos,
    };
  }

  let pettingTimer = 0;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    setJointPos();

    animPlayer(raccoon, k, {
      movementMode: "input",
      camClampX: {
        min: -5,
        max: 5,
      },
    });

    k.onKeyDown("space", () => {
      if (raccoon.isGrounded()) {
        raccoon.jump(20);
      }
    });

    // wincon
    if (
      Math.pow(
        Math.pow(endeffector.pos.x - raccoon.pos.x, 2) +
          Math.pow(endeffector.pos.y - (raccoon.pos.y - 1), 2),
        0.5
      ) < 1
    ) {
      pettingTimer += k.dt();
      if (pettingTimer > 5) {
        useGameStore.getState().setLevelCompleteDialogOpen(true);
        useGameStore.getState().setLevelCompleted(true);
      }
    } else {
      pettingTimer = 0;
    }

    if (dataHelper.initData) {
      handleReset(raccoon, -1);
    }
  });
};
