import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
} from "../utils/gameHelper";

const TRASHCAN1 = "trashcan1";
const TRASHCAN2 = "trashcan2";

export const IFFIES_GAME_OBJECTS = [TRASHCAN1, TRASHCAN2] as const;

export const initializeIffies = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon } = addGameobjects(["raccoon"]);

  k.setCamPos(raccoon!.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET));

  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });
  const trashcanEmpty = game.add([
    k.sprite("trashcan", {
      anim: "empty",
    }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(5),
    k.area(),
    k.z(1),
    "trashcan1",
  ]);
  const trashcanFilled = game.add([
    k.sprite("trashcan", {
      anim: "filled",
    }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(5),
    k.area(),
    k.z(1),
    "trashcan2",
  ]);

  trashcanEmpty!.z = 3;
  trashcanEmpty!.pos.x = 350;
  trashcanEmpty!.pos.y = -75;

  trashcanFilled!.z = 3;
  trashcanFilled!.pos.x = -400;
  trashcanFilled!.pos.y = -205;

  useDataStore.getState().gameObjects.set(
    "trashcan1",
    new Map([
      ["filled", { access: "get", value: 0 }],
      ["xpos", { access: "get", value: 350 }],
      ["ypos", { access: "get", value: -75 }],
    ])
  );

  useDataStore.getState().gameObjects.set(
    "trashcan2",
    new Map([
      ["filled", { access: "get", value: 1 }],
      ["xpos", { access: "get", value: -400 }],
      ["ypos", { access: "get", value: -205 }],
    ])
  );

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k);

    const distFilled = raccoon!.pos.dist(trashcanFilled!.pos);

    if (distFilled <= 10 && !useGameStore.getState().levelCompleted) {
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }
  });
};
