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

export const initializeLooping = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("looping");

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    // useGameStore.getState().setLevelCompleteDialogOpen(true);
    // useGameStore.getState().setLevelCompleted(true);

    if (dataHelper.initData) {
      handleReset(raccoon!, 1);
    }
  });
};
