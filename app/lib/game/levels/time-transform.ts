import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { useTimeStore } from "~/lib/zustand/time";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplay-ctx";
import { addBackgrounds, addGameobjects } from "../utils/game-helper";

export const TIME_TRANSFORM_GAME_OBJECTS = ["clock"] as const;

export const initializeTimeTransform = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("time-transform");

  addBackgrounds(["roof"]);

  k.setCamPos(2, -BACKGROUND_OFFSET);

  const { raccoon } = addGameobjects(["raccoon"]);

  k.loadSprite("clockHand", "/game/sprites/clockHand.png");
  const bigClockHand = game.add([
    k.sprite("clockHand"),
    k.anchor("center"),
    k.pos(6.25, -6.85),
    k.rotate(0),
    k.area(),
    k.scale(0.075),
    "bigClockHand",
  ]);

  const getTime = useTimeStore.getState().getTime;

  const TIME_SCALE = 100;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    bigClockHand.rotateTo(getTime() * TIME_SCALE);
  });
};
