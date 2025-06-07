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

export const BOUNCE_GAME_OBJECTS = [TRASHCAN1, TRASHCAN2] as const;

export const initializeBounce = () => {
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
  const trashcan1 = game.add([
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
  const trashcan2 = game.add([
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

  // Initialize trashcan states in the data store
  const trashcan1State = useDataStore.getState().gameObjects.get("trashcan1");

  if (trashcan1State) {
    trashcan1State.set("filled", { access: "import", value: 0 });
    trashcan1State.set("xpos", { access: "import", value: 3.63 });
    trashcan1State.set("ypos", { access: "import", value: -0.45 });
  }

  const trashcan2State = useDataStore.getState().gameObjects.get("trashcan2");

  if (trashcan2State) {
    trashcan2State.set("filled", { access: "import", value: 1 });
    trashcan2State.set("xpos", { access: "import", value: -5 });
    trashcan2State.set("ypos", { access: "import", value: -2 });
  }

  // Set initial positions and z-index for trashcans
  trashcan1!.z = 3;
  trashcan1!.pos.x = 3.63;
  trashcan1!.pos.y = -0.45;

  trashcan2!.z = 3;
  trashcan2!.pos.x = -5;
  trashcan2!.pos.y = -2;

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

  let trashcan1IsFilled = false;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    swapTimer += k.dt();
    if (swapTimer >= nextSwap) {
      // Swap the trashcan sprites and filled states
      if (trashcan1IsFilled) {
        trashcan1!.play("empty");
        trashcan2!.play("filled");
      } else {
        trashcan1!.play("filled");
        trashcan2!.play("empty");
      }
      trashcan1IsFilled = !trashcan1IsFilled;

      // Update the data store with the new filled states
      trashcan1State?.set("filled", {
        access: "import",
        value: trashcan1IsFilled ? 1 : 0,
      });

      trashcan2State?.set("filled", {
        access: "import",
        value: trashcan1IsFilled ? 0 : 1,
      });

      swapTimer = 0;
      nextSwap = Math.random() * 4 + 1; // Reset the timer with a new random value
    }

    animPlayer(raccoon!, k);

    const trashcanFilled = trashcan1IsFilled ? trashcan1 : trashcan2;
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
