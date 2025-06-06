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

  addBackgrounds(["background1"]);

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

    trashcanEmpty!.pos.x =
      useDataStore.getState().gameObjects.get("trashcanEmpty")?.get("xpos")
        ?.value ?? 0;
    trashcanEmpty!.pos.y =
      useDataStore.getState().gameObjects.get("trashcanEmpty")?.get("ypos")
        ?.value ?? 0;

    trashcanFilled!.pos.x =
      useDataStore.getState().gameObjects.get("trashcanFilled")?.get("xpos")
        ?.value ?? 0;
    trashcanFilled!.pos.y =
      useDataStore.getState().gameObjects.get("trashcanFilled")?.get("ypos")
        ?.value ?? 0;

    goalFlag!.pos.x =
      useDataStore.getState().gameObjects.get("goalFlag")?.get("xpos")?.value ??
      0;
    goalFlag!.pos.y =
      useDataStore.getState().gameObjects.get("goalFlag")?.get("ypos")?.value ??
      0;

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
