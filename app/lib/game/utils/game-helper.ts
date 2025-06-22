import type {
  AnchorComp,
  AreaComp,
  BodyComp,
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
import { getKaplayCtx } from "../core/kaplay-ctx";
import { globalKeyTracker } from "./global-keytracker";

// Type definitions
type Background =
  | "default"
  | "roof"
  | "withEquation"
  | "roofWithoutPerspective";

type PlayerType = GameObj<
  | PosComp
  | RotateComp
  | ScaleComp
  | SpriteComp
  | AnchorComp
  | ZComp
  | StateComp<
      | "idle"
      | "idleHolding"
      | "walkLeft"
      | "walkRight"
      | "walkLeftHolding"
      | "walkRightHolding"
    >
  | BodyComp
  | AreaComp
>;

type StandardGameObjectType = GameObj<
  PosComp | ScaleComp | SpriteComp | AnchorComp | ZComp | AreaComp
>;

type MovementMode = "node" | "input" | "loop";

interface LoopConfig {
  minX: number;
  maxX: number;
  speed: number;
}

interface ClampConfig {
  min: number;
  max: number;
}

// Type mapping for game objects to their instance types
type GameObjectTypeMap = {
  raccoon: PlayerType;
  trashcanEmpty: StandardGameObjectType;
  trashcanFilled: StandardGameObjectType;
  goalFlag: StandardGameObjectType;
};

// Utility type to create return type based on input array
type GameObjectInstancesFromArray<
  T extends readonly (keyof GameObjectTypeMap)[],
> = {
  [K in T[number]]: GameObjectTypeMap[K];
};

interface BackgroundConfig {
  spriteKey: string;
  imagePath: string;
  lightPath?: string;
}

// Constants
const BACKGROUND_CONFIGS: Record<Background, BackgroundConfig> = {
  default: {
    spriteKey: "background",
    imagePath: "/game/backgrounds/background1.png",
    lightPath: "/game/backgrounds/background1_light.png",
  },
  roof: {
    spriteKey: "background",
    imagePath: "/game/backgrounds/background2.png",
  },
  roofWithoutPerspective: {
    spriteKey: "background",
    imagePath: "/game/backgrounds/background2pers2.png",
  },
  withEquation: {
    spriteKey: "background",
    imagePath: "/game/backgrounds/background_calculator.png",
    lightPath: "/game/backgrounds/background1_light.png",
  },
};

const DEFAULT_PLAYER_CLAMP: ClampConfig = {
  min: -22.7,
  max: 22.7,
};

const DEFAULT_CAMERA_CLAMP: ClampConfig = {
  min: -15,
  max: 15,
};

function createRaccoon(k: KAPLAYCtx, game: any): PlayerType {
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
    k.sprite("raccoon", { anim: "walkHolding" }),
    k.pos(0, 0),
    k.rotate(0),
    k.scale(SPRITE_SCALE),
    k.anchor("bot"),
    k.area({
      shape: new k.Rect(k.vec2(0, 0), 10, 20),
      offset: k.vec2(0, 0),
    }),
    k.z(2),
    k.opacity(1),
    k.body(),
    "raccoon",
    k.state("idle", [
      "idle",
      "walkLeft",
      "walkRight",
      "idleHolding",
      "walkLeftHolding",
      "walkRightHolding",
    ]),
  ]);

  raccoon.onStateEnter("idle", () => {
    raccoon.play("idle");
  });

  raccoon.onStateEnter("idleHolding", () => {
    raccoon.play("idleHolding");
  });

  raccoon.onStateEnter("walkLeft", () => {
    raccoon.play("walk");
    raccoon.scaleTo(k.vec2(-SPRITE_SCALE, SPRITE_SCALE));
  });

  raccoon.onStateEnter("walkRight", () => {
    raccoon.play("walk");
    raccoon.scaleTo(k.vec2(SPRITE_SCALE, SPRITE_SCALE));
  });

  raccoon.onStateEnter("walkLeftHolding", () => {
    raccoon.play("walkHolding");
    raccoon.scaleTo(k.vec2(-SPRITE_SCALE, SPRITE_SCALE));
  });

  raccoon.onStateEnter("walkRightHolding", () => {
    raccoon.play("walkHolding");
    raccoon.scaleTo(k.vec2(SPRITE_SCALE, SPRITE_SCALE));
  });

  return raccoon;
}

function loadTrashcanSprite(k: KAPLAYCtx): void {
  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });
}

function createTrashcan(
  k: KAPLAYCtx,
  game: any,
  type: "empty" | "filled",
  tag: string
): StandardGameObjectType {
  return game.add([
    k.sprite("trashcan", { anim: type }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(SPRITE_SCALE),
    k.area(),
    k.z(1),
    k.opacity(1),
    tag,
  ]);
}

function createGoalFlag(k: KAPLAYCtx, game: any): StandardGameObjectType {
  k.loadSprite("flag", "/game/sprites/flag_spritesheet.png", {
    sliceX: 2,
    sliceY: 2,
    anims: {
      default: { from: 0, to: 3, loop: true },
    },
  });
  k.loadSprite("smallFlag", "/game/sprites/small_flag.png");

  const flag = game.add([
    k.sprite("flag", { anim: "default" }),
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
    k.sprite("smallFlag"),
    k.anchor("center"),
    k.pos(0, 0),
    k.scale(SPRITE_SCALE * 0.5),
    k.z(100),
    k.opacity(1),
  ]);

  // Set up off-screen indicator
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

  return flag;
}

export function addGameobjects<T extends readonly (keyof GameObjectTypeMap)[]>(
  gameobjects: T
): GameObjectInstancesFromArray<T> {
  const { k, game } = getKaplayCtx();
  const instances = {} as GameObjectInstancesFromArray<T>;

  if (
    gameobjects.includes("trashcanEmpty") ||
    gameobjects.includes("trashcanFilled")
  ) {
    loadTrashcanSprite(k);
  }

  if (gameobjects.includes("raccoon")) {
    (instances as any).raccoon = createRaccoon(k, game);
  }

  if (gameobjects.includes("trashcanEmpty")) {
    (instances as any).trashcanEmpty = createTrashcan(
      k,
      game,
      "empty",
      "trashcanEmpty"
    );
  }

  if (gameobjects.includes("trashcanFilled")) {
    (instances as any).trashcanFilled = createTrashcan(
      k,
      game,
      "filled",
      "trashcanFilled"
    );
  }

  if (gameobjects.includes("goalFlag")) {
    (instances as any).goalFlag = createGoalFlag(k, game);
  }

  return instances;
}

// Background management
export function addBackgrounds(
  backgrounds: readonly Background[],
  lightOffset: number = 0
): void {
  const { k, game } = getKaplayCtx();
  let hasLight = false;

  // Load sprites for requested backgrounds
  for (const background of backgrounds) {
    const config = BACKGROUND_CONFIGS[background];
    k.loadSprite(config.spriteKey, config.imagePath);

    if (config.lightPath) {
      k.loadSprite("backgroundLight", config.lightPath);
      hasLight = true;
    }
  }

  game.add([
    k.sprite("background"),
    k.anchor("center"),
    k.scale(SPRITE_SCALE),
    k.pos(0, -BACKGROUND_OFFSET),
    k.z(0),
  ]);

  if (hasLight) {
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

export function removeBackgrounds(): void {
  const { game } = getKaplayCtx();
  game.get("background").forEach((bg) => bg.destroy());
  game.get("backgroundLight").forEach((bg) => bg.destroy());
}

// Player movement and animation
export let moveDirection = 1;

function handleNodeMovement(player: PlayerType): void {
  player.pos.x = useDataStore.getState().getData("raccoon", "x");
  player.pos.y = useDataStore.getState().getData("raccoon", "y");
}

function updateDataStore(player: PlayerType): void {
  useDataStore.getState().setData("raccoon", "x", player.pos.x);
  useDataStore.getState().setData("raccoon", "y", player.pos.y);
}

function handleInputMovement(player: PlayerType, k: KAPLAYCtx): void {
  const SPEED = 5;
  const moveLeft = globalKeyTracker.isKeyDown("a");
  const moveRight = globalKeyTracker.isKeyDown("d");

  if (moveLeft) {
    player.pos.x -= SPEED * k.dt();
  }
  if (moveRight) {
    player.pos.x += SPEED * k.dt();
  }
}

function handleLoopMovement(
  player: PlayerType,
  k: KAPLAYCtx,
  config: LoopConfig
): void {
  player.pos.x += config.speed * moveDirection * k.dt();

  if (player.pos.x >= config.maxX) {
    moveDirection = -1;
  } else if (player.pos.x <= config.minX) {
    moveDirection = 1;
  }
}

function updateCamera(
  player: PlayerType,
  k: KAPLAYCtx,
  camClampX: ClampConfig
): void {
  const camX = Math.max(camClampX.min, Math.min(camClampX.max, player.pos.x));
  k.setCamPos(k.lerp(k.getCamPos(), k.vec2(camX, -BACKGROUND_OFFSET), 0.1));
}

function updatePlayerAnimation(player: PlayerType, lastX: number): void {
  const deltaX = player.pos.x - lastX;
  const newState =
    deltaX === 0 ? "idle" : deltaX < 0 ? "walkLeft" : "walkRight";

  if (player.state !== newState) {
    player.enterState(newState);
  }
}

interface AnimPlayerConfig {
  movementMode?: MovementMode;
  loopConfig?: LoopConfig;
  playerClampX?: ClampConfig;
  camClampX?: ClampConfig;
  enableCameraUpdate?: boolean;
}

function applyMovement(
  player: PlayerType,
  k: KAPLAYCtx,
  movementMode: MovementMode,
  loopConfig?: LoopConfig
): void {
  switch (movementMode) {
    case "node":
      handleNodeMovement(player);
      return;
    case "input":
      handleInputMovement(player, k);
      break;
    case "loop":
      if (loopConfig) {
        handleLoopMovement(player, k, loopConfig);
      }
      break;
  }
  updateDataStore(player);
}

function clampPlayerPosition(
  player: PlayerType,
  clampConfig: ClampConfig
): void {
  player.pos.x = Math.max(
    clampConfig.min,
    Math.min(clampConfig.max, player.pos.x)
  );
}

export function animPlayer(
  player: PlayerType,
  k: KAPLAYCtx,
  config: AnimPlayerConfig = {}
): void {
  const {
    movementMode = "node",
    loopConfig,
    playerClampX = DEFAULT_PLAYER_CLAMP,
    camClampX = DEFAULT_CAMERA_CLAMP,
    enableCameraUpdate = true,
  } = config;

  const lastX = player.pos.x;

  applyMovement(player, k, movementMode, loopConfig);

  clampPlayerPosition(player, playerClampX);

  if (enableCameraUpdate) {
    updateCamera(player, k, camClampX);
  }

  updatePlayerAnimation(player, lastX);
}

export function handleReset(raccoon: PlayerType, initDirection: number): void {
  raccoon?.scaleTo(SPRITE_SCALE * initDirection, SPRITE_SCALE);
  useDataStore.setState({ initData: false });
}

export type {
  PlayerType,
  StandardGameObjectType,
  GameObjectInstancesFromArray,
  MovementMode,
  LoopConfig,
  ClampConfig,
  Background,
};
