import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
  removeBackgrounds,
} from "../utils/gameHelper";

export const initializeTimeTransform = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

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
    if (k.isKeyDown("up") && raccoon.pos.y >= -15) {
      raccoon.pos.y -= 5 * k.dt();
    }
    if (k.isKeyDown("down") && raccoon.pos.y <= 0) {
      raccoon.pos.y += 5 * k.dt();
    }
  });

  let onRoof = false;
  const raccoonState = useDataStore.getState().gameObjects.get("raccoon");

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    if (raccoon!.pos.y < -13) {
      removeBackgrounds();
      addBackgrounds(["background2"]);

      ladder.pos = k.vec2(-12, 5);
      ladder.height = 5;

      raccoonState!.get("xpos")!.value = -13;
      raccoonState!.get("ypos")!.value = -5;
      raccoon!.pos.x = -12;
      raccoon!.pos.y = 5;
      onRoof = true;
    }

    if (!isClimbing) {
      if (!onRoof) {
        animPlayer(raccoon!, k, "input");
      } else {
        animPlayer(raccoon!, k, "input", undefined, { minX: -20, maxX: 2 });
      }
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
