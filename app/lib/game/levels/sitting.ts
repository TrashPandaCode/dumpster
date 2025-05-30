import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
} from "../utils/gameHelper";

export const initializeSitting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcan } = addGameobjects(["raccoon", "trashcan"]);
  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  trashcan!.z = 3;
  raccoon!.pos.x = -200;

  k.onCollide("raccoon", "trashcan", (raccoon, trashcan) => {
    useGameStore.getState().setLevelCompleteDialogOpen(true);
    useGameStore.getState().setLevelCompleted(true);
    console.log("Raccoon collided with trashcan");
  });

  game.onUpdate(() => {
    if (
      useDataStore
        .getState()
        .gameObjects.get("raccoon")
        ?.get("setTo1ActivateNode")?.value == 1
    ) {
      animPlayer(raccoon!, k);
    } else {
      raccoon!.pos.x = -200;
    }

    trashcan!.pos.x =
      useDataStore.getState().gameObjects.get("trashcan")?.get("xpos")?.value ??
      0;
    trashcan!.pos.y =
      useDataStore.getState().gameObjects.get("trashcan")?.get("ypos")?.value ??
      0;
  });
};
