import { useDataStore } from "~/lib/zustand/data";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
} from "../utils/gameHelper";
import { useGameStore } from "~/lib/zustand/game";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcanFilled, goalFlag } = addGameobjects([
    "raccoon",
    "trashcanFilled",
    "goalFlag",
  ]);
  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    trashcanFilled!.pos.x =
      useDataStore.getState().gameObjects.get("trashcanFilled")?.get("xpos")?.value ??
      0;
    trashcanFilled!.pos.y =
      useDataStore.getState().gameObjects.get("trashcanFilled")?.get("ypos")?.value ??
      0;
  });
};
