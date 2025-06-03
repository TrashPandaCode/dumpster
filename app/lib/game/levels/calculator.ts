import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import { addBackgrounds, addGameobjects, handleReset } from "../utils/gameHelper";

export const initializeCalculator = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["backgroundCalc"], -200);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(-5, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);
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
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, -1);
    };
  });
};
