import { getKaplayCtx } from "./kaplayCtx";

export default async function initGame(canvas: HTMLCanvasElement) {
  const k = getKaplayCtx(canvas);

  k.loadBean();
  const bean = k.add([k.sprite("bean"), k.pos(0, 0), "bean"]);

  k.onUpdate(() => {
    bean.moveBy(1, 1);
  })
}
