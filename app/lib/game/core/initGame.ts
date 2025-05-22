import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useGameStore } from "~/lib/zustand/game";
import { useKeyStore } from "~/lib/zustand/key";
import { useTimeStore } from "~/lib/zustand/time";
import { getKaplayCtx } from "./kaplayCtx";
import { globalKeyTracker } from "../utils/globalKeyTracker";

export const state = {
  first: true,
}; //TODO: remove just for react strict mode

/**
 * Initializes the game with a canvas element and sets up basic game-node interactions.
 * Is ALWAYS called before a level is loaded.
 * @param canvas The canvas element to use for rendering the game.
 * @returns Kaplay context
 */
export default function initGame(canvas: HTMLCanvasElement) {
  if (!state.first) return; //TODO: remove just for react strict mode
  state.first = false; //TODO: remove just for react strict mode

  const { k, game } = getKaplayCtx(canvas);

  useKeyStore.getState().setKeyDownFunction((key) => globalKeyTracker.isKeyDown(key));
  useKeyStore.getState().setKeyPressedFunction((key) => globalKeyTracker.isKeyPressed(key));
  useKeyStore.getState().setKeyReleasedFunction((key) => globalKeyTracker.isKeyReleased(key));

  useTimeStore.getState().setTimeFunction(() => k.time());
  useTimeStore.getState().setDeltaTimeFunction(() => k.dt());

  //Game Loop, runs at 60 frames per second
  k.onUpdate(() => {
    if (useGameStore.getState().isPaused) {
      game.paused = true;
      return;
    }
    game.paused = false; // TODO: run this only once (maybe in store)

    // compute node map
    useNodeStore.getState().compute();

    globalKeyTracker.clearPressedAndReleased();
  });

  return k;
}
