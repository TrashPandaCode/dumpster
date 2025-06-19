import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
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

  addBackgrounds(["default"]);

  const { raccoon } = addGameobjects(["raccoon"]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k);

    // useGameStore.getState().setLevelCompleteDialogOpen(true);
    // useGameStore.getState().setLevelCompleted(true);

    if (dataHelper.initData) {
      handleReset(raccoon, 1);
    }
  });
};
