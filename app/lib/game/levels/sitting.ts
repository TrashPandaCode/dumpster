import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
} from "../utils/gameHelper";

import { useTelemetryStore } from "~/lib/zustand/telemetry";

export const initializeSitting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcanFilled } = addGameobjects([
    "raccoon",
    "trashcanFilled",
  ]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale(k.height() / 947);

  trashcanFilled!.z = 3;
  trashcanFilled!.pos.x = -280;
  trashcanFilled!.pos.y = -110;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    const dist = raccoon!.pos.dist(trashcanFilled!.pos);

    if (dist <= 50 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);

      useTelemetryStore.getState().logFinish(new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }
  });
};
