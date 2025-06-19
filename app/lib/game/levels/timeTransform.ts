import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
  removeBackgrounds,
} from "../utils/gameHelper";
import { globalKeyTracker } from "../utils/globalKeyTracker";

export const initializeTimeTransform = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("time-transform");

  addBackgrounds(["default"]);

  const { raccoon } = addGameobjects(["raccoon"]);

  const ladder = game.add([
    k.rect(0.1, 13),
    k.opacity(0),
    k.anchor("bot"),
    k.pos(-11, -1),
    k.rotate(0),
    k.area(),
    "ladder",
  ]);

  let isClimbing = false;

  k.onCollideUpdate("raccoon", "ladder", (raccoon) => {
    isClimbing = false;
    if (raccoon.pos.y < 0) {
      isClimbing = true;
    }
    if (globalKeyTracker.isKeyDown("w") && raccoon.pos.y >= -15) {
      raccoon.pos.y -= 5 * k.dt();
    }
    if (globalKeyTracker.isKeyDown("s") && raccoon.pos.y <= 0) {
      raccoon.pos.y += 5 * k.dt();
    }
  });

  let onRoof = false;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    if (raccoon.pos.y < -13) {
      removeBackgrounds();
      addBackgrounds(["roof"]);

      ladder.pos = k.vec2(-12, 5);
      ladder.height = 5;

      dataHelper.setData("raccoon", "xpos", -13);
      dataHelper.setData("raccoon", "ypos", -5);
      raccoon.pos.x = -12;
      raccoon.pos.y = 5;
      onRoof = true;
    }

    if (!isClimbing) {
      if (!onRoof) {
        animPlayer(raccoon, k, {
          movementMode: "input",
        });
      } else {
        animPlayer(raccoon, k, {
          movementMode: "input",
          playerClampX: { min: -20, max: 2 },
        });
      }
    }

    if (dataHelper.initData) {
      handleReset(raccoon, 1);
    }
  });
};
