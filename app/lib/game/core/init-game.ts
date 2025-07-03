/*
 * Authors:
 *
 * Purpose:
 */
import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useGameStore } from "~/lib/zustand/game";
import { useMouseStore } from "~/lib/zustand/mouse";
import { useTimeStore } from "~/lib/zustand/time";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { globalKeyTracker } from "../utils/global-keytracker";
import { getKaplayCtx } from "./kaplay-ctx";

// Module state to track if the game has been initialized (needs to be an object to maintain state across imports)
export const state = {
  first: true,
};

/**
 * Initializes the game with a canvas element and sets up basic game-node interactions.
 * Is ALWAYS called before a level is loaded.
 * @param canvas The canvas element to use for rendering the game.
 * @returns Kaplay context
 */
export default function initGame(canvas: HTMLCanvasElement) {
  if (!state.first) return;
  state.first = false;

  let pauseStart = 0;
  let totalPausedTime = 0;

  const { k, game } = getKaplayCtx(canvas);

  useMouseStore.getState().setMousePosFunction(() => k.toWorld(k.mousePos()));

  useTimeStore.getState().setTimeFunction(() => k.time() - totalPausedTime);
  useTimeStore.getState().setDeltaTimeFunction(() => k.dt());

  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  //Game Loop, runs at 60 frames per second
  k.onUpdate(() => {
    if (useGameStore.getState().isPaused) {
      // Log pause start
      if (!game.paused) {
        pauseStart = k.time();
      }
      game.paused = true;
      return;
    }
    // Will run once on game resume
    if (game.paused) {
      totalPausedTime += k.time() - pauseStart;
      pauseStart = 0;
      game.paused = false;
    }

    // Compute node map
    useNodeStore.getState().compute();

    globalKeyTracker.clearPressedAndReleased();
  });

  return k;
}
