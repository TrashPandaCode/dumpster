/*
 * Authors:
 *
 * Purpose:
 */
import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/game-helper";

export const initializeMove = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["default"]);

  const { raccoon, goalFlag } = addGameobjects(["raccoon", "goalFlag"]);

  goalFlag.pos.x = -15;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k);

    const distGoal = raccoon.pos.dist(goalFlag.pos);

    if (distGoal <= 1) {
      useGameStore.getState().setLevelCompleted(true);
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon, 1);
    }
  });
};
