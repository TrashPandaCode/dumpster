import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import { addBackgrounds, addGameobjects } from "../utils/gameHelper";

export const initialize1_1 = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  const floor = game.add([
    k.rect(k.width(), 5),
    k.pos(0, k.height() - 5),
    k.color(255, 200, 200),
    k.area(),
    k.body({ isStatic: true }),
    "floor",
  ]);

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
    k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));
    const levelCompleted = useGameStore.getState().levelCompleted;

    if (useGameStore.getState().isPaused || levelCompleted) return;

    // Get value from exportToGameObject node
    const value =
      useDataStore.getState().gameObjects.get("raccoon")?.get("value")?.value ??
      0;

    if (value == result && !levelCompleted) {
      label.text = "Equation solved!";

      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
  });
};
