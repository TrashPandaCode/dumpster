/*
 * Authors: Jonathan Kron, David KLein, Markus Heming
 *
 * Purpose:
 * This function initializes a game level where the player must stay near a randomly swapping "filled" trashcan for a continuous
 * duration to complete the level, with a brief grace period allowing temporary departure without resetting progress.
 */
import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
  type StandardGameObjectType,
} from "../utils/game-helper";

const GRACE_PERIOD = 0.2;
const TIMER_DURATION = 4;

export const initializeBounce = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("bounce");

  addBackgrounds(["default"]);

  const {
    raccoon,
    trashcanFilled: trashcan1,
    trashcanEmpty: trashcan2,
  } = addGameobjects(["raccoon", "trashcanFilled", "trashcanEmpty"]);

  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });

  // Initialize trashcan states in the data store
  const setupTrashcan = (
    can: StandardGameObjectType,
    x: number,
    y: number,
    filled: number
  ) => {
    can.z = 3;
    can.pos = k.vec2(x, y);
    dataHelper.setData(
      can === trashcan1 ? "trashcanFilled" : "trashcanEmpty",
      "filled",
      filled
    );
    dataHelper.setData(
      can === trashcan1 ? "trashcanFilled" : "trashcanEmpty",
      "x",
      x
    );
    dataHelper.setData(
      can === trashcan1 ? "trashcanFilled" : "trashcanEmpty",
      "y",
      y
    );
  };

  setupTrashcan(trashcan1, -7, -1.75, 0);
  setupTrashcan(trashcan2, -5, -2, 1);
  const cans = [trashcan1, trashcan2];

  k.loadFont("Pixelify Sans", "/fonts/PixelifySans-VariableFont_wght.ttf", {
    filter: "nearest",
  });
  const timerText = game.add([
    k.text(TIMER_DURATION.toString(), { size: 2, font: "Pixelify Sans" }),
    k.pos(-6, -6),
    k.anchor("center"),
    k.z(10),
    k.opacity(0),
    "timerText",
  ]);

  const newSwap = () => Math.random() * (TIMER_DURATION / 2) + 1;

  let swapTimer = 0,
    nextSwap = newSwap();
  let timeInFilled = 0,
    graceTimer = 0;
  let trashcan1IsFilled = false;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    swapTimer += k.dt();
    if (swapTimer >= nextSwap) {
      // Swap the trashcan sprites and filled states
      trashcan1IsFilled = !trashcan1IsFilled;
      cans[0].play(trashcan1IsFilled ? "filled" : "empty");
      cans[1].play(trashcan1IsFilled ? "empty" : "filled");

      dataHelper.setData("trashcanFilled", "filled", trashcan1IsFilled ? 1 : 0);
      dataHelper.setData("trashcanEmpty", "filled", trashcan1IsFilled ? 0 : 1);

      swapTimer = 0;
      nextSwap = newSwap();
    }

    animPlayer(raccoon, k);

    const filledCan = trashcan1IsFilled ? trashcan1 : trashcan2;
    const isNearFilled = raccoon.pos.dist(filledCan.pos) <= 0.5;

    if (isNearFilled) {
      timeInFilled += k.dt();
      graceTimer = 0;

      timerText.opacity = 1;
      timerText.text = Math.max(
        0,
        Math.ceil(TIMER_DURATION - timeInFilled)
      ).toString();

      if (timeInFilled >= TIMER_DURATION) {
        useGameStore.getState().setLevelCompleted(true);
        timerText.opacity = 0;
      }
    } else if (timeInFilled > 0) {
      graceTimer += k.dt();
      if (graceTimer >= GRACE_PERIOD) {
        timeInFilled = 0;
        graceTimer = 0;
        timerText.opacity = 0;
      }
    }

    if (dataHelper.initData()) {
      handleReset(raccoon, 1);
    }
  });
};
