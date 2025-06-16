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
  const dataStore = useDataStore.getState();

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

    trashcanEmpty!.pos.x = dataStore.getData("trashcanEmpty", "xpos");
    trashcanEmpty!.pos.y = dataStore.getData("trashcanEmpty", "ypos");

    trashcanFilled!.pos.x = dataStore.getData("trashcanFilled", "xpos");
    trashcanFilled!.pos.y = dataStore.getData("trashcanFilled", "ypos");

    goalFlag!.pos.x = dataStore.getData("goalFlag", "xpos");
    goalFlag!.pos.y = dataStore.getData("goalFlag", "ypos");

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
