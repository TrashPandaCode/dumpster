import { useDataStore } from "~/lib/zustand/data";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
} from "../utils/gameHelper";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcan, goalFlag } = addGameobjects([
    "raccoon",
    "trashcan",
    "goalFlag",
  ]);
  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  game.onUpdate(() => {
    animPlayer(raccoon!, k);

    trashcan!.pos.x =
      useDataStore.getState().gameObjects.get("trashcan")?.get("xpos")?.value ??
      0;
    trashcan!.pos.y =
      useDataStore.getState().gameObjects.get("trashcan")?.get("ypos")?.value ??
      0;
  });
};
