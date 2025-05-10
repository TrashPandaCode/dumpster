import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";

export const initializePlayground = () => {
  const k = getKaplayCtx();

  k.loadBean();
  const bean = k.add([
    k.sprite("bean"),
    k.color(0, 0, 255),
    k.pos(100, k.height() - 100),
  ]);
  const bean2 = k.add([
    k.sprite("bean"),
    k.color(0, 255, 0),
    k.pos(100, k.height() - 100),
  ]);

  //Create "Floor" Component
  const floor = k.add([
    k.rect(k.width(), 5),
    k.pos(0, k.height() - 5),
    k.color(255, 200, 200),
    k.area(),
    k.body({ isStatic: true }),
    "floor",
  ]);

  k.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    //Move
    bean.pos.x =
      useDataStore.getState().gameObjects.get("bean")?.get("xpos")?.value ?? 0;
    bean.pos.y =
      useDataStore.getState().gameObjects.get("bean")?.get("ypos")?.value ?? 0;

    bean2.pos.x =
      useDataStore.getState().gameObjects.get("bean2")?.get("xpos")?.value ?? 0;
    bean2.pos.y =
      useDataStore.getState().gameObjects.get("bean2")?.get("ypos")?.value ?? 0;
  });
};
