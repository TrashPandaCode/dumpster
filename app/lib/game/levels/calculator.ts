import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import { addBackgrounds, addGameobjects } from "../utils/gameHelper";

import { useTelemetryStore } from "~/lib/zustand/telemetry";

export const initializeCalculator = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["backgroundCalc"], -200);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(-300, -BACKGROUND_OFFSET);
  k.setCamScale(k.height() / 947);
  raccoon!.scaleBy(-1, 1);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    // Get value from exportToGameObject node
    const value =
      useDataStore.getState().gameObjects.get("raccoon")?.get("solution")
        ?.value ?? 0;

    if (value == 16 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);

      useTelemetryStore.getState().logFinish(new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }
  });
};
