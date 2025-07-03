/*
 * Authors: Leo Kling, Jonathan Kron
 *
 * Purpose: This module provides the kaplay context for the game, initializing it if it doesn't exist.
 */
import kaplay, { type GameObj, type KAPLAYCtx, type TimerComp } from "kaplay";

import { state } from "./init-game";

let ctx: { k: KAPLAYCtx; game: GameObj<TimerComp> } | undefined = undefined;

/**
 * Returns the kaplay context, creating it if it doesn't exist.
 * @param canvas - Optional HTMLCanvasElement to use for the game.
 * @returns The kaplay context with the highest order game object.
 */
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

/**
 * Cleans up the kaplay context by quitting the app and resetting the context.
 */
export function cleanupKaplay() {
  if (!ctx) return;
  const { game, app } = ctx.k._k;
  game.events.onOnce("frameEnd", () => {
    app.quit();
  });
  ctx = undefined;
  state.first = true;
}
