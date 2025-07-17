/*
 * Authors: Jonathan Kron, David Klein
 *
 * Purpose:
 * This function initializes a game level where the player must input the correct
 * solution (16) to complete the level, providing feedback via a toast message on incorrect attempts.
 */
import { toast } from "~/lib/node-editor/editor-components/Toast";
import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  handleReset,
} from "../utils/game-helper";

export const initializeCalculator = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("calculator");

  addBackgrounds(["withEquation"], -200);

  const { raccoon } = addGameobjects(["raccoon"]);
  raccoon.scaleBy(-1, 1);

  k.setCamPos(-5, -BACKGROUND_OFFSET);

  let lastSolution = 0;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    // Get value from exportToGameObject node
    const value = dataHelper.getData("raccoon", "solution");

    if (value == 16) {
      useGameStore.getState().setLevelCompleted(true);
    } else if (value !== lastSolution) {
      toast({
        title: "Wrong solution!",
        description: "It seems like a wrong solution was given to the raccoon.",
      });
      lastSolution = value;
    }

    if (dataHelper.initData()) {
      handleReset(raccoon, -1);
    }
  });
};
