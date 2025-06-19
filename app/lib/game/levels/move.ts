import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";
import { globalKeyTracker } from "../utils/globalKeyTracker";

export const initializeMove = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["default"]);

  const { raccoon, goalFlag } = addGameobjects(["raccoon", "goalFlag"]);

  goalFlag.pos.x = -22;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k);

    const distGoal = raccoon.pos.dist(goalFlag.pos);

    if (distGoal <= 1 && !useGameStore.getState().levelCompleted) {
      //TODO: Raccoon continues walking after "Continue Playing" is clicked

      if (
        globalKeyTracker.isKeyDown("w") ||
        globalKeyTracker.isKeyDown("a") ||
        globalKeyTracker.isKeyDown("s") ||
        globalKeyTracker.isKeyDown("d") ||
        globalKeyTracker.isKeyDown("space") ||
        globalKeyTracker.isKeyDown("enter")
      ) {
        useGameStore.getState().setLevelCompleteDialogOpen(true);
        useGameStore.getState().setLevelCompleted(true);
      }
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon, 1);
    }
  });
};
