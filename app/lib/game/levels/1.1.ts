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
    k.pos(0.1 * k.width(), k.height() - 0.1 * k.height()),
    k.scale(0.1 * k.width() / 24),
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

  const label = game.add([
    k.text(equation, { size: 32 }),
    k.pos(0.5 * k.width() - 0.1 * k.width(), 0.1 * k.height()),
    k.scale(0.03 * k.width() / 24),
    "text",
  ]);

  const background = game.add([
    k.rect(k.width(), k.height()),
    k.color(120, 150, 200),
    k.pos(0, 0),
    k.z(-100),
    "background",
  ]);

  let lastWidth = k.width();
  let lastHeight = k.height();

  let raccooonRelX = raccoon.pos.x / lastWidth;
  let raccooonRelY = raccoon.pos.y / lastHeight;

  function updateLayout() {

    raccoon.pos.x = raccooonRelX * k.width();
    raccoon.pos.y = raccooonRelY * k.height();
    raccoon.scale = k.vec2(0.1 * k.height() / 24);

    label.pos.x = 0.5 * k.width() - 0.1 * k.width();
    label.pos.y = 0.1 * k.height();
    label.scale = k.vec2(0.03 * k.width() / 24);

    background.width = k.width();
    background.height = k.height();

    floor.pos.y = k.height() - 5;
    floor.width = k.width();
  }

  // Update layout on window resize
  updateLayout();

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    // Check if the window size has changed
    if (k.width() !== lastWidth || k.height() !== lastHeight) {
      raccooonRelX = raccoon.pos.x / lastWidth;
      raccooonRelY = raccoon.pos.y / lastHeight;

      lastWidth = k.width();
      lastHeight = k.height();
      updateLayout();
    }

    // Get value from exportToGameObject node
    const value = useDataStore.getState().gameObjects.get("raccoon")?.get("value")?.value ?? 0;

    if (value == result && label.text !== "Equation solved!") {
      label.text = "Equation solved!";
      raccoon.pos.x = 0.5 * k.width();

      useGameStore.getState().setLevelCompleteDialogOpen(true);
    }

  });
};
