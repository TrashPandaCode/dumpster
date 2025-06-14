import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";

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

  k.setCamPos(0, 0);
  k.setCamScale((CAM_SCALE * k.height()) / 1500);

  const dataState = useDataStore.getState().gameObjects;

  useDataStore
    .getState()
    .setData("endeffector", "x", () => setJointPos().end.x);
  useDataStore
    .getState()
    .setData("endeffector", "y", () => setJointPos().end.y);
  useDataStore
    .getState()
    .setData("joint1", "x", () => setJointPos().joint1.pos.x);
  useDataStore
    .getState()
    .setData("joint1", "y", () => setJointPos().joint1.pos.y);
  useDataStore
    .getState()
    .setData("joint1", "importrot", () => setJointPos().joint1.rot);
  useDataStore
    .getState()
    .setData("joint2", "x", () => setJointPos().joint2.pos.x);
  useDataStore
    .getState()
    .setData("joint2", "y", () => setJointPos().joint2.pos.y);
  useDataStore
    .getState()
    .setData("joint2", "importrot", () => setJointPos().joint2.rot);
  useDataStore
    .getState()
    .setData("joint3", "x", () => setJointPos().joint3.pos.x);
  useDataStore
    .getState()
    .setData("joint3", "y", () => setJointPos().joint3.pos.y);
  useDataStore
    .getState()
    .setData("joint3", "importrot", () => setJointPos().joint3.rot);

  const joint1 = k.add([
    "joint1",
    k.rect(0.2, JOINT_1_LENGTH),
    k.anchor("bot"),
    k.pos(0, 0),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(255, 0, 0),
    k.z(1),
  ]);
  const joint2 = k.add([
    "joint2",
    k.rect(0.2, JOINT_2_LENGTH),
    k.anchor("bot"),
    k.pos(0, -JOINT_1_LENGTH),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(0, 255, 0),
    k.z(1),
  ]);
  const joint3 = k.add([
    "joint3",
    k.rect(0.2, JOINT_3_LENGTH),
    k.anchor("bot"),
    k.pos(0, -(JOINT_1_LENGTH + JOINT_2_LENGTH)),
    k.rotate(0),
    k.area(),
    k.body({ isStatic: true }),
    k.color(0, 0, 255),
    k.z(1),
  ]);
  const endeffector = k.add([
    "endeffector",
    k.circle(0.25),
    k.anchor("center"),
    k.pos(0, -(JOINT_1_LENGTH + JOINT_2_LENGTH + JOINT_3_LENGTH)),
    k.area(),
    k.body({ isStatic: true }),
    k.color(255, 255, 255),
    k.z(1),
  ]);

  // this function is computed multiple times unecessarily
  // there are prob. ways to make this more efficient
  function setJointPos(): {
    joint1: { pos: { x: number; y: number }; rot: number };
    joint2: { pos: { x: number; y: number }; rot: number };
    joint3: { pos: { x: number; y: number }; rot: number };
    end: { x: number; y: number };
  } {
    joint1.angle = dataState.get("joint1")!.get("exportrot")!.getValue();
    joint2.angle =
      dataState.get("joint2")!.get("exportrot")!.getValue() + joint1.angle;
    joint3.angle =
      dataState.get("joint3")!.get("exportrot")!.getValue() + joint2.angle;

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
      joint1: { pos: joint1.pos, rot: joint1.angle },
      joint2: { pos: joint2.pos, rot: joint2.angle },
      joint3: { pos: joint3.pos, rot: joint3.angle },
      end: endeffector.pos,
    };
  }

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    setJointPos();
  });
};
