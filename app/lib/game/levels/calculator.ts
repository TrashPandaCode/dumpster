import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  handleReset,
} from "../utils/game-helper";

import { useTelemetryStore } from "~/lib/zustand/telemetry";

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

    if (value == 16) {
      useGameStore.getState().setLevelCompleted(true);

      useTelemetryStore.getState().logFinish(new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }

    if (dataHelper.initData()) {
      handleReset(raccoon, -1);
    }
  });
};
