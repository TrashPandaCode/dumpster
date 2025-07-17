/*
 * Authors: David Klein
 *
 * Purpose: Initializes the gravity level, which contains a trashcan.
 * The function checks wether the trashcan has been moved to it's designated position, to then make it static.
 * The level is completed when the raccoon is sitting on top of the trashcan.
 */
import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/game-helper";

export const initializeGravity = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("gravity");

  addBackgrounds(["default"]);

  const { raccoon, trashcanFilled } = addGameobjects([
    "raccoon",
    "trashcanFilled",
  ]);

  const floor = k.add([
    k.rect(50, 10),
    k.anchor("top"),
    k.pos(0, 0),
    k.area(),
    k.body({ isStatic: true }),
    k.opacity(0),
  ]);

  trashcanFilled.use(k.body());
  trashcanFilled.use(
    k.area({
      shape: new k.Rect(k.vec2(0, 0), 16, 16),
      offset: k.vec2(0, 0),
    })
  );

  trashcanFilled.pos.x = 5;
  trashcanFilled.pos.y = -10;

  let trashcanVely = 0;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon, k, {
      movementMode: "keyboard",
      updateStoreData: false,
      camClampX: {
        min: -8,
        max: 12,
      },
      playerClampX: {
        min: -12,
        max: 20,
      },
    });

    trashcanVely = dataHelper.getData("trashcanFilled", "y vel");

    if (trashcanFilled.pos.y < 0) {
      trashcanFilled.pos.y = trashcanFilled.pos.y + trashcanVely;
    } else {
      trashcanFilled.use(k.body({ isStatic: true }));
    }

    raccoon.pos.y = dataHelper.getData("raccoon", "y pos");

    dataHelper.setData("trashcanFilled", "y vel", () => trashcanVely);
    dataHelper.setData("raccoon", "y pos", () => raccoon.pos.y);

    const trashcanTop = trashcanFilled.pos.sub(k.vec2(0, 2));

    if (raccoon.pos.dist(trashcanTop) <= 1) {
      useGameStore.getState().setLevelCompleted(true);
    }

    if (dataHelper.initData()) {
      handleReset(raccoon, 1);
      trashcanFilled.pos.x = 5;
      trashcanFilled.pos.y = -10;
    }
  });
};
