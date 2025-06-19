import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  handleReset,
} from "../utils/gameHelper";

export const initializeCalculator = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("calculator");

  addBackgrounds(["withEquation"], -200);

  const { raccoon } = addGameobjects(["raccoon"]);
  raccoon.scaleBy(-1, 1);

  k.setCamPos(-5, -BACKGROUND_OFFSET);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    // Get value from exportToGameObject node
    const value = dataHelper.getData("raccoon", "solution");

    if (value == 16 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }

    if (dataHelper.initData) {
      handleReset(raccoon, -1);
    }
  });
};
