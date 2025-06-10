import type {
  AnchorComp,
  GameObj,
  KAPLAYCtx,
  PosComp,
  RotateComp,
  ScaleComp,
  SpriteComp,
  StateComp,
  ZComp,
} from "kaplay";

import { useDataStore } from "~/lib/zustand/data";
import {
  BACKGROUND_OFFSET,
  SMALL_FLAG_OFFSET,
  SPRITE_SCALE,
} from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import { type GameObject } from "../gameObjects";

type Background = "background1" | "background2" | "backgroundCalc";
type PlayerType = GameObj<
  | PosComp
  | RotateComp
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
      k.rotate(0),
      k.scale(SPRITE_SCALE),
      k.anchor("bot"),
      k.area(),
      k.z(2),
      k.opacity(1),
      "raccoon",
      k.state("idle", ["idle", "walkLeft", "walkRight"]),
    ]);
    raccoon.onStateEnter("idle", () => {
      raccoon.play("idle");
    });
    raccoon.onStateEnter("walkLeft", () => {
      raccoon.play("walk");
      raccoon.scaleTo(k.vec2(-SPRITE_SCALE, SPRITE_SCALE));
    });
    raccoon.onStateEnter("walkRight", () => {
      raccoon.play("walk");
      raccoon.scaleTo(k.vec2(SPRITE_SCALE, SPRITE_SCALE));
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
      k.scale(SPRITE_SCALE),
      k.area(),
      k.z(1),
      k.opacity(1),
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
      k.scale(SPRITE_SCALE),
      k.area(),
      k.z(1),
      k.opacity(1),
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
      k.scale(SPRITE_SCALE),
      k.z(1),
      k.opacity(1),
      k.offscreen({ distance: 10 }),
      "goalFlag",
    ]);

    const smallFlag = game.add([
      k.sprite("flag", {
        anim: "default",
      }),
      k.anchor("bot"),
      k.pos(0, 0),
      k.scale(SPRITE_SCALE * 0.25),
      k.z(100),
      k.opacity(1),
    ]);

    flag.onUpdate(() => {
      if (flag.isOffScreen()) {
        smallFlag.opacity = 1;
        const screenPos = flag.screenPos()!;
        smallFlag.screenPos(
          k.vec2(
            k.clamp(
              screenPos.x,
              SMALL_FLAG_OFFSET,
              k.width() - SMALL_FLAG_OFFSET
            ),
            k.clamp(
              screenPos.y,
              SMALL_FLAG_OFFSET,
              k.height() - SMALL_FLAG_OFFSET
            )
          )
        );
      } else {
        smallFlag.opacity = 0;
      }
    });

    instances.goalFlag = flag;
  }
  return instances;
}

export function addBackgrounds(
  backgrounds: Background[],
  lightOffset: number = 0
) {
  const { k, game } = getKaplayCtx();
  let light = false;

  if (backgrounds.includes("background1")) {
    k.loadSprite("background", "/game/backgrounds/background1.png");
    k.loadSprite("backgroundLight", "/game/backgrounds/background1_light.png");
    light = true;
  }
  if (backgrounds.includes("background2")) {
    k.loadSprite("background", "/game/backgrounds/background2.png");
  }
  if (backgrounds.includes("backgroundCalc")) {
    k.loadSprite("background", "/game/backgrounds/background_calculator.png");
    k.loadSprite("backgroundLight", "/game/backgrounds/background1_light.png");
    light = true;
  }

  game.add([
    k.sprite("background"),
    k.anchor("center"),
    k.scale(SPRITE_SCALE),
    k.pos(0, -BACKGROUND_OFFSET),
    k.z(0),
  ]);
  if (light) {
    game.add([
      k.sprite("backgroundLight"),
      k.anchor("center"),
      k.scale(SPRITE_SCALE),
      k.pos(lightOffset, -BACKGROUND_OFFSET),
      k.z(100),
      k.opacity(0.75),
    ]);
  }
}
export let moveDirection = 1;

export function animPlayer(
  player: PlayerType,
  k: KAPLAYCtx,
  movementMode: "node" | "input" | "loop" = "node",
  loopConfig?: { minX: number; maxX: number; speed: number }, // For Loop movement mode
  playerClampX: { minX: number; maxX: number } = {
    minX: -22.7,
    maxX: 22.7,
  },
  camClampX: { minX: number; maxX: number } = {
    minX: -15,
    maxX: 15,
  }
) {
  const playerState = useDataStore.getState().gameObjects.get("raccoon");
  const lastX = player.pos.x;

  //Move
  if (movementMode === "node") {
    player.pos.x = playerState!.get("xpos")!.value;
    player.pos.y = playerState!.get("ypos")!.value;
  } else if (movementMode === "input") {
    if (k.isKeyDown("a") || k.isKeyDown("left")) player.pos.x -= 5 * k.dt();
    if (k.isKeyDown("d") || k.isKeyDown("right")) player.pos.x += 5 * k.dt();
  } else if (movementMode === "loop" && loopConfig) {
    // walks infinitely if speed is < 0

    player.pos.x += loopConfig.speed * moveDirection * k.dt();
    if (player.pos.x >= loopConfig.maxX) {
      moveDirection = -1;
    } else if (player.pos.x <= loopConfig.minX) {
      moveDirection = 1;
    }
  }

  //Clamp player position
  player.pos.x = Math.max(
    playerClampX.minX,
    Math.min(playerClampX.maxX, player.pos.x)
  );

  //Clamp camera position
  const camX = Math.max(camClampX.minX, Math.min(camClampX.maxX, player.pos.x));
  k.setCamPos(k.lerp(k.getCamPos(), k.vec2(camX, -BACKGROUND_OFFSET), 0.1));

  //Handle anim change
  const deltaX = player.pos.x - lastX;
  const newState =
    deltaX === 0 ? "idle" : deltaX < 0 ? "walkLeft" : "walkRight";

  if (player.state !== newState) {
    player.enterState(newState);
  }
}

export function handleReset(raccoon: PlayerType, initDirection: number) {
  raccoon?.scaleTo(SPRITE_SCALE * initDirection, SPRITE_SCALE);
  useDataStore.setState({ initData: false });
}
