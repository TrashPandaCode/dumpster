import kaplay, { type GameObj, type KAPLAYCtx, type TimerComp } from "kaplay";

import { state } from "./initGame";

let ctx: { k: KAPLAYCtx; game: GameObj<TimerComp> } | undefined = undefined;

export function getKaplayCtx(canvas?: HTMLCanvasElement) {
  if (ctx) {
    return ctx;
  }

  const k = kaplay({
    global: false,
    pixelDensity: 2,
    touchToMouse: true,
    debug: false,
    debugKey: "f1",
    canvas: canvas,
    background: "#2b292f",
  });
  const game = k.add([k.timer()]);

  ctx = {
    k,
    game,
  };

  return ctx;
}

export function cleanupKaplay() {
  if (!ctx) return;
  ctx = undefined;
  state.first = true; //TODO: remove just for react strict mode
}
