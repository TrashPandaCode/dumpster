import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import { addBackgrounds, createRaccoon } from "../utils/game-helper";

export const LOOPING_GAME_OBJECTS = [
  "raccoon1",
  "raccoon2",
  "raccoon3",
  "raccoon4",
  "raccoon5",
] as const;

export const initializeLooping = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("looping");

  addBackgrounds(["default"]);
  k.loadSprite("box", "/game/sprites/box.png");

  const addBox = (x: number, height: number) => {
    for (let i = 0; i < height; i++) {
      game.add([
        k.sprite("box"),
        k.anchor("bot"),
        k.pos(x, -i),
        k.scale(0.022),
      ]);
    }
  };

  const raccoonHeights = [1, 2, 3, 5, 4];

  const raccoon1 = createRaccoon(k, game);
  addBox(-5, raccoonHeights[0]);
  raccoon1.pos.x = -5;
  const raccoon2 = createRaccoon(k, game);
  addBox(-2.5, raccoonHeights[1]);
  raccoon2.pos.x = -2.5;
  const raccoon3 = createRaccoon(k, game);
  addBox(0, raccoonHeights[2]);
  raccoon3.pos.x = 0;
  const raccoon4 = createRaccoon(k, game);
  addBox(2.5, raccoonHeights[3]);
  raccoon4.pos.x = 2.5;
  const raccoon5 = createRaccoon(k, game);
  addBox(5, raccoonHeights[4]);
  raccoon5.pos.x = 5;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;
    raccoon1.pos.y = dataHelper.getData("raccoon1", "y");
    raccoon2.pos.y = dataHelper.getData("raccoon2", "y");
    raccoon3.pos.y = dataHelper.getData("raccoon3", "y");
    raccoon4.pos.y = dataHelper.getData("raccoon4", "y");
    raccoon5.pos.y = dataHelper.getData("raccoon5", "y");

    if (
      raccoon1.pos.y === -raccoonHeights[0] &&
      raccoon2.pos.y === -raccoonHeights[1] &&
      raccoon3.pos.y === -raccoonHeights[2] &&
      raccoon4.pos.y === -raccoonHeights[3] &&
      raccoon5.pos.y === -raccoonHeights[4]
    )
      useGameStore.getState().setLevelCompleted(true);
  });
};
