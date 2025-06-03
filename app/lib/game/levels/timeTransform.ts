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

const initDirection = 1;

export const initializeTimeTransform = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale(CAM_SCALE * k.height() / 947);

  let lastTime = 0;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const currentTime = k.time();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const speedT =
      useDataStore.getState().gameObjects.get("raccoon")?.get("speed")?.value ??
      0;

    animPlayer(raccoon!, k, "Loop", {
      minX: -5,
      maxX: 5,
      speed: speedT * deltaTime,
    });

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    };
  });
};
