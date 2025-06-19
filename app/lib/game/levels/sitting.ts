import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

export const initializeSitting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["default"]);

  const { raccoon, trashcanFilled } = addGameobjects([
    "raccoon",
    "trashcanFilled",
  ]);

  trashcanFilled.z = 3;
  trashcanFilled.pos.x = -5;
  trashcanFilled.pos.y = -2;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k);

    const dist = raccoon.pos.dist(trashcanFilled!.pos);

    if (dist <= 0.5 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon, 1);
    }
  });
};
