import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { useTimeStore } from "~/lib/zustand/time";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplay-ctx";
import { addBackgrounds, addGameobjects } from "../utils/game-helper";

export const LINEAR_GAME_OBJECTS = ["pocketwatch"] as const;

export const initializeLinear = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("linear");
  addBackgrounds(["roof"]);
  k.setCamPos(2, -BACKGROUND_OFFSET);
  const { raccoon } = addGameobjects(["raccoon"]);
  raccoon.enterState("idleHolding");
  raccoon.pos = k.vec2(1, 0);
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
  k.loadSprite("pocketwatch", "/game/sprites/pocketwatch.png");
  const pocketwatch = game.add([
    k.sprite("pocketwatch"),
    k.anchor("center"),
    k.pos(1.2, -3.75),
    k.rotate(0),
    k.area(),
    k.scale(0.075),
    k.z(2),
    "pocketwatch",
  ]);
  const pocketwatchHand = game.add([
    k.sprite("clockHand"),
    k.anchor("center"),
    k.pos(1.2, -3.35),
    k.rotate(0),
    k.area(),
    k.scale(0.045),
    k.z(3),
    "pocketwatchHand",
  ]);
  const getTime = useTimeStore.getState().getTime;
  const TIME_SCALE = 100;
  const TIME_OFFSET = 50;
  let lastTime = getTime();
  let matchTimer = 5;
  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;
    const userTime = dataHelper.getData("pocketwatch", "time");
    bigClockHand.rotateTo(lastTime);
    pocketwatchHand.rotateTo(userTime);
    if ((lastTime + TIME_OFFSET) * TIME_SCALE - userTime < Number.EPSILON)
      matchTimer -= k.dt();
    if (matchTimer < 0 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
    lastTime = getTime();
  });
};
