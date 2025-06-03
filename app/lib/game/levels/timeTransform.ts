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

export const initializeTimeTransform = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const speedT =
      useDataStore.getState().gameObjects.get("raccoon")?.get("speed")?.value ??
      0;

    animPlayer(raccoon!, k, "Loop", {
      minX: -5,
      maxX: 5,
      speed: speedT * k.dt(),
    });

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
