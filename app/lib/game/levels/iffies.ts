import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
} from "../utils/gameHelper";

export const initializeIffies = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcanEmpty, trashcanFilled } = addGameobjects([
    "raccoon",
    "trashcanEmpty",
    "trashcanFilled",
  ]);
  k.setCamPos(0, -BACKGROUND_OFFSET);

  trashcanFilled!.z = 3;
  trashcanFilled!.pos.x = -280;
  trashcanFilled!.pos.y = -110;

  trashcanEmpty!.z = 3;
  trashcanEmpty!.pos.x = 350;
  trashcanEmpty!.pos.y = 0;

  useDataStore.getState().gameObjects.set(
    "trashcanEmpty",
    new Map([
      ["filled", { access: "get", value: 0 }],
      ["xpos", { access: "get", value: 350 }],
      ["ypos", { access: "get", value: 0 }],
    ])
  );

  useDataStore.getState().gameObjects.set(
    "trashcanFilled",
    new Map([
      ["filled", { access: "get", value: 1 }],
      ["xpos", { access: "get", value: -280 }],
      ["ypos", { access: "get", value: -110 }],
    ])
  );

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    const distFilled = raccoon!.pos.dist(trashcanFilled!.pos);

    if (distFilled <= 10 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleted(true);
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
  });
};
