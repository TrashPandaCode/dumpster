import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();

  k.loadSprite("raccoon", "/game/sprites/raccoon_spritesheet.png", {
    sliceX: 4,
    sliceY: 4,
    anims: {
      idle: { from: 0, to: 0, loop: false },
      idleHolding: { from: 1, to: 1, loop: false },
      walk: { from: 2, to: 7, loop: true },
      walkHolding: { from: 8, to: 13, loop: true },
    },
  });
  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });
  k.loadSprite("flag", "/game/sprites/flag_spritesheet.png", {
    sliceX: 2,
    sliceY: 2,
    anims: {
      default: { from: 0, to: 3, loop: true },
    },
  });

  const raccoon = game.add([
    k.sprite("raccoon", {
      anim: "walkHolding",
    }),
    k.pos(100, k.height() - 100),
    k.scale(5),
  ]);
  const trashcan = game.add([
    k.sprite("trashcan", {
      anim: "filled",
    }),
    k.pos(200, 200),
    k.scale(5),
  ]);
  const flag = game.add([
    k.sprite("flag", {
      anim: "default",
    }),
    k.pos(200, 200),
    k.scale(5),
  ]);

  //Create "Floor" Component
  const floor = game.add([
    k.rect(k.width(), 5),
    k.pos(0, k.height() - 5),
    k.color(255, 200, 200),
    k.area(),
    k.body({ isStatic: true }),
    "floor",
  ]);

  game.onUpdate(() => {
    //Move
    raccoon.pos.x =
      useDataStore.getState().gameObjects.get("bean")?.get("xpos")?.value ?? 0;
    raccoon.pos.y =
      useDataStore.getState().gameObjects.get("bean")?.get("ypos")?.value ?? 0;

    trashcan.pos.x =
      useDataStore.getState().gameObjects.get("bean2")?.get("xpos")?.value ?? 0;
    trashcan.pos.y =
      useDataStore.getState().gameObjects.get("bean2")?.get("ypos")?.value ?? 0;
  });
};
