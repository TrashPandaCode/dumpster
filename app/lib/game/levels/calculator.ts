import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import { addBackgrounds, addGameobjects } from "../utils/gameHelper";

export const initializeCalculator = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["backgroundCalc"], -200);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(-300, -BACKGROUND_OFFSET);
  k.setCamScale(k.height() / 947);
  raccoon!.scaleBy(-1, 1);

  const result = 16;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    // Get value from exportToGameObject node
    const value =
      useDataStore
        .getState()
        .gameObjects.get("raccoon")
        ?.get("solution")?.value ?? 0;

    if (value == result && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
  });
};
