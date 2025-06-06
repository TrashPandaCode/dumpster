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

export const initializeParenting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcanFilled, goalFlag } = addGameobjects([
    "raccoon",
    "trashcanFilled",
    "goalFlag",
  ]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  trashcanFilled!.pos.x = 5;
  trashcanFilled!.pos.y = -0.5;

  goalFlag!.pos.x = -22;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k, "input");

    const distGoal = trashcanFilled!.pos.dist(goalFlag!.pos);

    if (distGoal <= 1 && !useGameStore.getState().levelCompleted) {
      //TODO: Raccoon continues walking after "Continue Playing" is clicked
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
