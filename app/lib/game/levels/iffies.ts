import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE, SPRITE_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

const TRASHCAN1 = "trashcan1";
const TRASHCAN2 = "trashcan2";

export const IFFIES_GAME_OBJECTS = [TRASHCAN1, TRASHCAN2] as const;

export const initializeIffies = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });
  const trashcanEmpty = game.add([
    k.sprite("trashcan", {
      anim: "empty",
    }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(SPRITE_SCALE),
    k.area(),
    k.z(1),
    "trashcan1",
  ]);
  const trashcanFilled = game.add([
    k.sprite("trashcan", {
      anim: "filled",
    }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(SPRITE_SCALE),
    k.area(),
    k.z(1),
    "trashcan2",
  ]);

  useDataStore.getState().gameObjects.set(
    "trashcan1",
    new Map([
      ["filled", { access: "get", value: 0 }],
      ["xpos", { access: "get", value: 3.63 }],
      ["ypos", { access: "get", value: -0.45 }],
    ])
  );

  useDataStore.getState().gameObjects.set(
    "trashcan2",
    new Map([
      ["filled", { access: "get", value: 1 }],
      ["xpos", { access: "get", value: -5 }],
      ["ypos", { access: "get", value: -2 }],
    ])
  );

  trashcanEmpty!.z = 3;
  trashcanEmpty!.pos.x = 3.63;
  trashcanEmpty!.pos.y = -0.45;

  trashcanFilled!.z = 3;
  trashcanFilled!.pos.x = -5;
  trashcanFilled!.pos.y = -2;

  let swapTimer = 0;
  let nextSwap = Math.random() * 4 + 1; // Random time between 1 and 5 seconds

  let timeInFilled = 0;
  let graceTimer = 0;
  const GRACE_PERIOD = 0.2;

  const timerText = game.add([
    k.text("5", {
      size: 2,
      font: "satoshi",
    }),
    k.pos(0, -8),
    k.anchor("center"),
    k.z(10),
    k.opacity(0),
    "timerText",
  ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    swapTimer += k.dt();
    if (swapTimer >= nextSwap) {
      // Swap the positions of the trashcans
      const tempX = trashcanEmpty!.pos.x;
      const tempY = trashcanEmpty!.pos.y;
      trashcanEmpty!.pos.x = trashcanFilled!.pos.x;
      trashcanEmpty!.pos.y = trashcanFilled!.pos.y;
      trashcanFilled!.pos.x = tempX;
      trashcanFilled!.pos.y = tempY;

      useDataStore.getState().gameObjects.set(
        "trashcan1",
        new Map([
          ["filled", { access: "get", value: 0 }],
          ["xpos", { access: "get", value: trashcanEmpty!.pos.x }],
          ["ypos", { access: "get", value: trashcanEmpty!.pos.y }],
        ])
      );

      useDataStore.getState().gameObjects.set(
        "trashcan2",
        new Map([
          ["filled", { access: "get", value: 1 }],
          ["xpos", { access: "get", value: trashcanFilled!.pos.x }],
          ["ypos", { access: "get", value: trashcanFilled!.pos.y }],
        ])
      );
      swapTimer = 0;
      nextSwap = Math.random() * 4 + 1; // Reset the timer with a new random value
    }

    animPlayer(raccoon!, k);

    const distFilled = raccoon!.pos.dist(trashcanFilled!.pos);

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

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
