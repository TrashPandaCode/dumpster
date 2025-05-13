import kaplay, { type KAPLAYCtx } from "kaplay";
import { state } from "./initGame";

// Kaplay Context Singleton, kaplay does not work if initialized multiple times
let k: KAPLAYCtx | undefined = undefined;

export function getKaplayCtx(canvas?: HTMLCanvasElement) {
  if (k) {
    return k;
  }

  k = kaplay({
    global: false,
    pixelDensity: 2,
    touchToMouse: true,
    debug: false,
    debugKey: "f1",
    canvas: canvas,
  });
  return k;
}

export function cleanupKaplay() {
  if (!k) return;
  k = undefined;
  state.first = true; //TODO: remove just for react strict mode
}
