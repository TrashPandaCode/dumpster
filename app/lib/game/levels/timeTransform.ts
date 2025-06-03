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

export const initializeTimeTransform = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  const ladder = game.add([
    k.rect(0.1, 15),
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
      raccoon.move(0, -5);
    }
    if (k.isKeyDown("down") && raccoon.pos.y <= 0) {
      raccoon.move(0, 5);
    }
  });

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    if (!isClimbing) {
      animPlayer(raccoon!, k, "Input");
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
