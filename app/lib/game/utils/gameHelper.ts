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

type Background = "background1" | "backgroundCalc";
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
  trashcanEmpty?: GameObj<
    PosComp | ScaleComp | SpriteComp | AnchorComp | ZComp
  >;
  trashcanFilled?: GameObj<
    PosComp | ScaleComp | SpriteComp | AnchorComp | ZComp
  >;
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
      k.area(),
      k.z(2),
      "raccoon",
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
  if (
    gameobjects.includes("trashcanEmpty") ||
    gameobjects.includes("trashcanFilled")
  ) {
    k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
      sliceX: 2,
      sliceY: 1,
      anims: {
        empty: { from: 0, to: 0, loop: false },
        filled: { from: 1, to: 1, loop: false },
      },
    });
  }
  if (gameobjects.includes("trashcanEmpty")) {
    const trashcanEmpty = game.add([
      k.sprite("trashcan", {
        anim: "empty",
      }),
      k.anchor("bot"),
      k.pos(0, 0),
      k.scale(RACCOON_SCALE),
      k.area(),
      k.z(1),
      "trashcanEmpty",
    ]);
    instances.trashcanEmpty = trashcanEmpty;
  }
  if (gameobjects.includes("trashcanFilled")) {
    const trashcanFilled = game.add([
      k.sprite("trashcan", {
        anim: "filled",
      }),
      k.anchor("bot"),
      k.pos(0, 0),
      k.scale(5),
      k.area(),
      k.z(1),
      "trashcanFilled",
    ]);
    instances.trashcanFilled = trashcanFilled;
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
      k.pos(0, 0),
      k.area(),
      k.scale(RACCOON_SCALE),
      k.z(1),
    ]);
    instances.goalFlag = flag;
  }
  return instances;
}

export function addBackgrounds(
  backgrounds: Background[],
  lightOffset: number = 0
) {
  const { k, game } = getKaplayCtx();

  if (backgrounds.includes("background1")) {
    k.loadSprite("background", "/game/backgrounds/background1.png");
    k.loadSprite("backgroundLight", "/game/backgrounds/background1_light.png");
  }
  if (backgrounds.includes("backgroundCalc")) {
    k.loadSprite("background", "/game/backgrounds/background_calculator.png");
    k.loadSprite("backgroundLight", "/game/backgrounds/background1_light.png");
  }

  game.add([
    k.sprite("background"),
    k.anchor("center"),
    k.scale(RACCOON_SCALE),
    k.pos(0, -BACKGROUND_OFFSET),
    k.z(0),
  ]);

  game.add([
    k.sprite("backgroundLight"),
    k.anchor("center"),
    k.scale(RACCOON_SCALE),
    k.pos(lightOffset, -BACKGROUND_OFFSET),
    k.z(100),
    k.opacity(0.75),
  ]);
}

export function animPlayer(
  player: PlayerType,
  k: KAPLAYCtx,
  movementMode: "Node" | "Input" | "Loop" = "Node",
  loopConfig?: { minX: number; maxX: number; speed: number } // For Loop movement mode
) {
  const lastX = player.pos.x;

  //Move
  if (movementMode === "Node") {
    player.pos.x =
      useDataStore.getState().gameObjects.get("raccoon")?.get("xpos")?.value ??
      0;
    player.pos.y =
      useDataStore.getState().gameObjects.get("raccoon")?.get("ypos")?.value ??
      0;
  } else if (movementMode === "Input") {
    if (k.isKeyDown("left")) player.pos.x -= 5;
    if (k.isKeyDown("right")) player.pos.x += 5;
  } else if (movementMode === "Loop" && loopConfig) {
    player.pos.x += loopConfig.speed;
    if (player.pos.x > loopConfig.maxX) {
      player.pos.x = loopConfig.minX;
    }
  }
  k.setCamPos(
    k.lerp(k.getCamPos(), k.vec2(player.pos.x, -BACKGROUND_OFFSET), 0.1)
  );

  //Handle anim change
  const deltaX = player.pos.x - lastX;
  const newState =
    deltaX === 0 ? "idle" : deltaX < 0 ? "walkLeft" : "walkRight";

  if (player.state !== newState) {
    player.enterState(newState);
  }
}

export function handleReset(raccoon: PlayerType, initDirection: number) {
  raccoon?.scaleTo(RACCOON_SCALE * initDirection, RACCOON_SCALE);
  useDataStore.setState({ initData: false });
}
