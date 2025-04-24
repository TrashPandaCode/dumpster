import { useDebugStore } from "~/lib/zustand/debug";
import { getKaplayCtx } from "./kaplayCtx";

export default async function initGame(canvas: HTMLCanvasElement) {
  const k = getKaplayCtx(canvas);

  k.loadBean();
  const bean = k.add([k.sprite("bean"), k.pos(0, 0)]);
  k.add([k.sprite("bean"), k.pos(20, 20)]);

  k.onUpdate(() => {
    const x = useDebugStore.getState().xpos;
    bean.moveBy(x, 0);

    if (bean.pos.x > k.width()) {
      bean.pos.x = 0;
    }
  });
}
