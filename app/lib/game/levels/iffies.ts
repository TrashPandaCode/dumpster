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

  const { raccoon, trashcan: trashcanFilled } = addGameobjects(["raccoon", "trashcan"], {trashcanAnim: "filled"});
  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  trashcanFilled!.z = 3;
  trashcanFilled!.pos.x = -400;
  trashcanFilled!.pos.y = -200;

  const { trashcan: trashcanEmpty } = addGameobjects(["trashcan"], { trashcanAnim: "empty" });

  trashcanEmpty!.z = 3;
  trashcanEmpty!.pos.x = 400;

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