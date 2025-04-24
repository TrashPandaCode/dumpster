import { getKaplayCtx } from "./kaplayCtx";

export default async function initGame(canvas: HTMLCanvasElement) {
  const k = getKaplayCtx(canvas);

  k.loadBean();
  const bean = k.add([k.sprite("bean"), k.pos(0, 0), "bean"]);
  bean.tag("bean");

  k.onUpdate("bean", (b) => {
    b.moveBy(1, 1);
  });
}
