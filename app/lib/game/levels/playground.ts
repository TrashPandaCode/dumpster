/*
 * Authors:
 *
 * Purpose:
 */
import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/game-helper";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("playground");

  addBackgrounds(["default"]);

  const { raccoon, trashcanEmpty, trashcanFilled, goalFlag } = addGameobjects([
    "raccoon",
    "trashcanEmpty",
    "trashcanFilled",
    "goalFlag",
  ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k);

    trashcanEmpty.pos.x = dataHelper.getData("trashcanEmpty", "x");
    trashcanEmpty.pos.y = dataHelper.getData("trashcanEmpty", "y");

    trashcanFilled.pos.x = dataHelper.getData("trashcanFilled", "x");
    trashcanFilled.pos.y = dataHelper.getData("trashcanFilled", "y");

    goalFlag.pos.x = dataHelper.getData("goalFlag", "x");
    goalFlag.pos.y = dataHelper.getData("goalFlag", "y");

    if (dataHelper.initData()) {
      handleReset(raccoon, 1);
    }
  });
};
