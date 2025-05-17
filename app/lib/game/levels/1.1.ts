import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";

export const initialize1_1 = () => {
  const { k, game } = getKaplayCtx();

  //Load Sprites
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

  //Create Basic Game Objects
  const raccoon = game.add([
    k.sprite("raccoon", {
      anim: "walkHolding",
    }),
    k.pos(100, k.height() - 100),
    k.scale(5),
    k.area(),
    k.body(),
    "raccoon",
  ]);

  const floor = game.add([
    k.rect(k.width(), 5),
    k.pos(0, k.height() - 5),
    k.color(255, 200, 200),
    k.area(),
    k.body({ isStatic: true }),
    "floor",
  ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const value = useDataStore.getState().gameObjects.get("raccoon")?.get("xpos")?.value ?? 0;

    console.log(useDataStore.getState().gameObjects.get("raccoon")?.has("xpos"));

    console.log("Raccoon X Position: ", value);

    if (value == 100) {
      console.log("Ziel erfüllt: ", value);
      raccoon.pos.x = 500;
    }

  });
};
