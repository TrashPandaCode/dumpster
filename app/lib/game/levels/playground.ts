import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background2"]);

  const { raccoon, trashcanEmpty, trashcanFilled, goalFlag } = addGameobjects([
    "raccoon",
    "trashcanEmpty",
    "trashcanFilled",
    "goalFlag",
  ]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    const trashcanEmptyState = useDataStore
      .getState()
      .gameObjects.get("trashcanEmpty");
    const trashcanFilledState = useDataStore
      .getState()
      .gameObjects.get("trashcanFilled");
    const goalFlagState = useDataStore.getState().gameObjects.get("goalFlag");

    if (trashcanEmpty && trashcanEmptyState) {
      trashcanEmpty!.pos.x = trashcanEmptyState!.get("xpos")!.value;
      trashcanEmpty!.pos.y = trashcanEmptyState!.get("ypos")!.value;
    }
    if (trashcanFilled && trashcanFilledState) {
      trashcanFilled!.pos.x = trashcanFilledState!.get("xpos")!.value;
      trashcanFilled!.pos.y = trashcanFilledState!.get("ypos")!.value;
    }

    if (goalFlag && goalFlagState) {
      goalFlag!.pos.x = goalFlagState!.get("xpos")!.value;
      goalFlag!.pos.y = goalFlagState!.get("ypos")!.value;
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
