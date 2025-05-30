import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import { addBackgrounds, addGameobjects } from "../utils/gameHelper";

export const initializeCalculator = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  //sample equation
  const equation = "7 + 5 * 2 - 3 / 3 = ?";
  const result = 16;

  const label = game.add([
    k.text(equation, { size: 32 }),
    k.pos(0, 100),
    k.anchor("center"),
    k.scale(2),
    "text",
  ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    // Get value from exportToGameObject node
    const value =
      useDataStore
        .getState()
        .gameObjects.get("raccoon")
        ?.get("equationSolution")?.value ?? 0;

    if (value == result && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleted(true);
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
  });
};
