import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/game-helper";

import { useTelemetryStore } from "~/lib/zustand/telemetry";

export const initializeSitting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["default"]);

  const { raccoon, trashcanFilled } = addGameobjects([
    "raccoon",
    "trashcanFilled",
  ]);

  trashcanFilled.z = 3;
  trashcanFilled.pos.x = -5;
  trashcanFilled.pos.y = -2;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k);

    const dist = raccoon.pos.dist(trashcanFilled!.pos);

    if (dist <= 0.5) {
      useGameStore.getState().setLevelCompleted(true);

      useTelemetryStore.getState().logFinish(new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }));
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon, 1);
    }
  });
};
