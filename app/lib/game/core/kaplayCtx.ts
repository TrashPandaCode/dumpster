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
  const { game, app, gfx, ggl, gc } = ctx.k._k;
  game.events.onOnce("frameEnd", () => {
    app.quit();

    // decide what we need from this:

    // // clear canvas
    // gfx.gl.clear(
    //   gfx.gl.COLOR_BUFFER_BIT |
    //     gfx.gl.DEPTH_BUFFER_BIT |
    //     gfx.gl.STENCIL_BUFFER_BIT
    // );

    // // unbind everything
    // const numTextureUnits = gfx.gl.getParameter(gfx.gl.MAX_TEXTURE_IMAGE_UNITS);

    // for (let unit = 0; unit < numTextureUnits; unit++) {
    //   gfx.gl.activeTexture(gfx.gl.TEXTURE0 + unit);
    //   gfx.gl.bindTexture(gfx.gl.TEXTURE_2D, null);
    //   gfx.gl.bindTexture(gfx.gl.TEXTURE_CUBE_MAP, null);
    // }

    // gfx.gl.bindBuffer(gfx.gl.ARRAY_BUFFER, null);
    // gfx.gl.bindBuffer(gfx.gl.ELEMENT_ARRAY_BUFFER, null);
    // gfx.gl.bindRenderbuffer(gfx.gl.RENDERBUFFER, null);
    // gfx.gl.bindFramebuffer(gfx.gl.FRAMEBUFFER, null);

    // // run all scattered gc events
    // ggl.destroy();
    // gc.forEach((f) => f());
  });
  ctx = undefined;
  state.first = true; //TODO: remove just for react strict mode
}
