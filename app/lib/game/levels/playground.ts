import { useDataStore } from "~/lib/zustand/data";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPLayer,
} from "../utils/gameHelper";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcan, goalFlag } = addGameobjects([
    "raccoon",
    "trashcan",
    "goalFlag",
  ]);

  game.onUpdate(() => {
    animPLayer(raccoon!, k);

    trashcan!.pos.x =
      useDataStore.getState().gameObjects.get("trashcan")?.get("xpos")?.value ??
      0;
    trashcan!.pos.y =
      useDataStore.getState().gameObjects.get("trashcan")?.get("ypos")?.value ??
      0;
  });
};
