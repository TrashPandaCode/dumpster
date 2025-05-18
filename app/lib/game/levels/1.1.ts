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

  //sample equation
  const equation = "7 + 5 * 2 - 3 / 3 = ?";
  const result = 16;

  let text = game.add([
    k.text(equation, { size: 32 }),
    k.pos(500, 100),
    "text",
  ]);

  const background = game.add([
    k.rect(k.width(), k.height()),
    k.color(120, 150, 200),
    k.pos(0, 0),
    k.z(-100),
    "background",
  ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const value = useDataStore.getState().gameObjects.get("raccoon")?.get("value")?.value ?? 0;

    if (value == result && text.text !== "Equation solved!") {
      text.text = "Equation solved!";
      raccoon.pos.x = 400;
    }

  });
};
