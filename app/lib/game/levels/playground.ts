import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("playground");

  addBackgrounds(["background2"]);

  const { raccoon, trashcanEmpty, trashcanFilled, goalFlag } = addGameobjects([
    "raccoon",
    "trashcanEmpty",
    "trashcanFilled",
    "goalFlag",
  ]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    trashcanEmpty!.pos.x = dataHelper.getData("trashcanEmpty", "xpos");
    trashcanEmpty!.pos.y = dataHelper.getData("trashcanEmpty", "ypos");

    trashcanFilled!.pos.x = dataHelper.getData("trashcanFilled", "xpos");
    trashcanFilled!.pos.y = dataHelper.getData("trashcanFilled", "ypos");

    goalFlag!.pos.x = dataHelper.getData("goalFlag", "xpos");
    goalFlag!.pos.y = dataHelper.getData("goalFlag", "ypos");

    if (dataHelper.initData) {
      handleReset(raccoon!, 1);
    }
  });
};
