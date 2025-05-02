import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useKeyStore } from "~/lib/zustand/key";
import { useTimeStore } from "~/lib/zustand/time";
import { getKaplayCtx } from "./kaplayCtx";

let first = true; //TODO: remove just for react strict mode

/**
 * Initializes the game with a canvas element and sets up basic game-node interactions.
 * Is ALWAYS called before a level is loaded.
 * @param canvas The canvas element to use for rendering the game.
 * @returns Kaplay context
 */
export default function initGame(canvas: HTMLCanvasElement) {
  if (!first) return; //TODO: remove just for react strict mode
  first = false; //TODO: remove just for react strict mode

  const k = getKaplayCtx(canvas);
  const setKeyPressed = useKeyStore.getState().setKeyPressed;

  // Key Presses for multiple keys at once. Maybe better in another file or at another place?
  k.onKeyDown((key) => {
    setKeyPressed(key, true);
  });

  k.onKeyRelease((key) => {
    setKeyPressed(key, false);
  });


  //Game Loop, runs at 60 frames per second
  const setTime = useTimeStore.getState().setTime;
  const setDeltaTime = useTimeStore.getState().setDeltaTime;
  k.onUpdate(() => {
    const time = k.time();
    const deltaTime = k.dt();
    setTime(time);
    setDeltaTime(deltaTime);

    // compute node map
    useNodeStore.getState().compute();
  });

  return k;
}
