import type {
  AnchorComp,
  GameObj,
  KAPLAYCtx,
  PosComp,
  ScaleComp,
  SpriteComp,
  StateComp,
  ZComp,
} from "kaplay";

import { useDataStore } from "~/lib/zustand/data";
import {
  BACKGROUND_OFFSET,
  RACCOON_SCALE,
  type GameObject,
} from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";

type Background = "background1";
type PlayerType = GameObj<
  | PosComp
  | ScaleComp
  | SpriteComp
  | AnchorComp
  | ZComp
  | StateComp<"idle" | "walkLeft" | "walkRight">
>;

interface GameObjectInstances {
  raccoon?: PlayerType;
  trashcan?: GameObj<PosComp | ScaleComp | SpriteComp | AnchorComp | ZComp>;
  goalFlag?: GameObj<PosComp | ScaleComp | SpriteComp | AnchorComp | ZComp>;
}

export function addGameobjects(gameobjects: GameObject[]) {
  const { k, game } = getKaplayCtx();
  const instances: GameObjectInstances = {};

  if (gameobjects.includes("raccoon")) {
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
    instances.raccoon = raccoon;
  }
  if (gameobjects.includes("trashcan")) {
    k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
      sliceX: 2,
      sliceY: 1,
      anims: {
        empty: { from: 0, to: 0, loop: false },
        filled: { from: 1, to: 1, loop: false },
      },
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
    instances.trashcan = trashcan;
  }
  if (gameobjects.includes("goalFlag")) {
    k.loadSprite("flag", "/game/sprites/flag_spritesheet.png", {
      sliceX: 2,
      sliceY: 2,
      anims: {
        default: { from: 0, to: 3, loop: true },
      },
    });

    const flag = game.add([
      k.sprite("flag", {
        anim: "default",
      }),
      k.anchor("bot"),
      k.pos(200, 0),
      k.scale(5),
      k.z(1),
    ]);
    instances.goalFlag = flag;
  }
  return instances;
}

export function addBackgrounds(backgrounds: Background[]) {
  const { k, game } = getKaplayCtx();

  if (backgrounds.includes("background1")) {
    k.loadSprite("background1", "/game/backgrounds/background1.png");
    k.loadSprite("background1light", "/game/backgrounds/background1_light.png");

    game.add([
      k.sprite("background1"),
      k.anchor("bot"),
      k.scale(k.height() * (1 / 180)),
      k.pos(0, BACKGROUND_OFFSET),
      k.z(0),
    ]);

    game.add([
      k.sprite("background1light"),
      k.anchor("bot"),
      k.scale(k.height() * (1 / 180)),
      k.pos(k.width() / 2 + 200, BACKGROUND_OFFSET),
      k.z(100),
      k.opacity(0.75),
    ]);
  }
}

export function animPLayer(player: PlayerType, k: KAPLAYCtx) {
  const lastX = player.pos.x;

  //Move
  player.pos.x =
    useDataStore.getState().gameObjects.get("raccoon")?.get("xpos")?.value ?? 0;
  player.pos.y =
    useDataStore.getState().gameObjects.get("raccoon")?.get("ypos")?.value ?? 0;

  k.setCamPos(
    k.lerp(
      k.getCamPos(),
      player.pos.add(0, -k.height() / 2 + BACKGROUND_OFFSET),
      0.1
    )
  );

  //Handle anim change
  const deltaX = player.pos.x - lastX;
  const newState =
    deltaX === 0 ? "idle" : deltaX < 0 ? "walkLeft" : "walkRight";

  if (player.state !== newState) {
    player.enterState(newState);
  }
}
