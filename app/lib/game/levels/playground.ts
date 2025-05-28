import { useDataStore } from "~/lib/zustand/data";
import { RACCOON_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";

export const initializePlayground = () => {
  const { k, game } = getKaplayCtx();

  k.loadSprite("background1", "/game/backgrounds/background1.png");
  k.loadSprite("background1light", "/game/backgrounds/background1_light.png");

  const background = game.add([
    k.sprite("background1"),
    k.anchor("bot"),
    k.scale(k.height() * (1 / 180)),
    k.pos(0, 0),
    k.z(0),
  ]);

  const backgroundLight = game.add([
    k.sprite("background1light"),
    k.anchor("bot"),
    k.scale(k.height() * (1 / 180)),
    k.pos(k.width() / 2 + 200, 0),
    k.z(100),
    k.opacity(0.75),
  ]);

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
    k.pos(0, 0),
    k.scale(RACCOON_SCALE),
    k.anchor("bot"),
    k.z(2),
    k.state("idle", ["idle", "walkLeft", "walkRight"]),
  ]);
  raccoon.onStateEnter("idle", () => {
    raccoon.play("idle");
  });
  raccoon.onStateEnter("walkLeft", () => {
    raccoon.play("walk");
    raccoon.scaleTo(k.vec2(-RACCOON_SCALE, RACCOON_SCALE));
  });
  raccoon.onStateEnter("walkRight", () => {
    raccoon.play("walk");
    raccoon.scaleTo(k.vec2(RACCOON_SCALE, RACCOON_SCALE));
  });

  const trashcan = game.add([
    k.sprite("trashcan", {
      anim: "filled",
    }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(5),
    k.z(1),
  ]);

  const flag = game.add([
    k.sprite("flag", {
      anim: "default",
    }),
    k.anchor("bot"),
    k.pos(200, 0),
    k.scale(5),
    k.z(1),
  ]);

  game.onUpdate(() => {
    const lastX = raccoon.pos.x;

    //Move
    raccoon.pos.x =
      useDataStore.getState().gameObjects.get("raccoon")?.get("xpos")?.value ??
      0;
    raccoon.pos.y =
      useDataStore.getState().gameObjects.get("raccoon")?.get("ypos")?.value ??
      0;

    trashcan.pos.x =
      useDataStore.getState().gameObjects.get("trashcan")?.get("xpos")?.value ??
      0;
    trashcan.pos.y =
      useDataStore.getState().gameObjects.get("trashcan")?.get("ypos")?.value ??
      0;

    k.setCamPos(raccoon.pos.add(0, -k.height() / 2));

    //Handle anim change
    const deltaX = raccoon.pos.x - lastX;
    const newState =
      deltaX === 0 ? "idle" : deltaX < 0 ? "walkLeft" : "walkRight";

    if (raccoon.state !== newState) {
      raccoon.enterState(newState);
    }
  });
};
