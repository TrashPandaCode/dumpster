import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

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
  dataHelper.setData("trashcanFilled", "filled", 0);
  dataHelper.setData("trashcanFilled", "x", -7);
  dataHelper.setData("trashcanFilled", "y", -1.75);

  dataHelper.setData("trashcanEmpty", "filled", 1);
  dataHelper.setData("trashcanEmpty", "x", -5);
  dataHelper.setData("trashcanEmpty", "y", -2);

  // Set initial positions and z-index for trashcans
  trashcan1.z = 3;
  trashcan1.pos.x = -7;
  trashcan1.pos.y = -1.75;

  trashcan2.z = 3;
  trashcan2.pos.x = -5;
  trashcan2.pos.y = -2;

  let swapTimer = 0;
  let nextSwap = Math.random() * 4 + 1; // Random time between 1 and 5 seconds

  let timeInFilled = 0;
  let graceTimer = 0;
  const GRACE_PERIOD = 0.2;

  k.loadFont("Pixelify Sans", "/fonts/PixelifySans-VariableFont_wght.ttf", {
    filter: "nearest",
  });
  const timerText = game.add([
    k.text("5", {
      size: 2,
      font: "Pixelify Sans",
    }),
    k.pos(0, -8),
    k.anchor("center"),
    k.z(10),
    k.opacity(0),
    "timerText",
  ]);

  let trashcan1IsFilled = false;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    swapTimer += k.dt();
    if (swapTimer >= nextSwap) {
      // Swap the trashcan sprites and filled states
      if (trashcan1IsFilled) {
        trashcan1.play("empty");
        trashcan2.play("filled");
      } else {
        trashcan1.play("filled");
        trashcan2.play("empty");
      }
      trashcan1IsFilled = !trashcan1IsFilled;

      dataHelper.setData("trashcanFilled", "filled", trashcan1IsFilled ? 1 : 0);
      dataHelper.setData("trashcanEmpty", "filled", trashcan1IsFilled ? 0 : 1);

      swapTimer = 0;
      nextSwap = Math.random() * 4 + 1; // Reset the timer with a new random value
    }

    animPlayer(raccoon, k);

    const trashcanFilled = trashcan1IsFilled ? trashcan1 : trashcan2;
    const distFilled = raccoon.pos.dist(trashcanFilled!.pos);

    if (distFilled <= 0.5 && !useGameStore.getState().levelCompleted) {
      timeInFilled += k.dt();
      graceTimer = 0;

      timerText.opacity = 1;
      const countdown = Math.max(0, Math.ceil(5 - timeInFilled));
      timerText.text = countdown.toString();
      if (timeInFilled >= 5) {
        useGameStore.getState().setLevelCompleteDialogOpen(true);
        useGameStore.getState().setLevelCompleted(true);
        timerText.opacity = 0;
      }
    } else if (timeInFilled > 0 && !useGameStore.getState().levelCompleted) {
      graceTimer += k.dt();
      if (graceTimer >= GRACE_PERIOD) {
        timeInFilled = 0;
        graceTimer = 0;

        timerText.opacity = 0;
      }
    }

    if (dataHelper.initData) {
      handleReset(raccoon, 1);
    }
  });
};
