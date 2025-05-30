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
  trashcan!.pos.x = -400;
  trashcan!.pos.y = -200;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    const dist = raccoon!.pos.dist(trashcan!.pos);

    if (dist <= 10 && !useGameStore.getState().levelCompleted) {

      useGameStore.getState().setLevelCompleted(true);
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }

  });
};
