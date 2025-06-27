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

/**
 * The Background type defines the different background styles available in the game.
 */
type Background =
  | "default"
  | "roof"
  | "withEquation"
  | "roofWithoutPerspective";

/**
 * The PlayerType represents the player character in the game, which is a raccoon.
 * It includes various components such as position, rotation, scale, sprite, anchor,
 * z-index, state management, body physics, and area detection.
 * The player can have different states like idle, walking left/right, and holding an item.
 */
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

/**
 * The StandardGameObjectType represents a standard game object in the game.
 * It includes components for position, scale, sprite, anchor, z-index, area detection,
 * and can be used for various objects like trash cans and goal flags.
 */
type StandardGameObjectType = GameObj<
  PosComp | ScaleComp | SpriteComp | AnchorComp | ZComp | AreaComp
>;

/**
 * The Modes available for player movement.
 * - "node": The player position is set directly from the data store.
 * - "keyboard": The player moves based on keyboard input.
 * - "loop": The player moves in a loop between specified min and max x positions.
 */
type MovementMode = "node" | "keyboard" | "loop";

/**
 * The LoopConfig interface defines the configuration for loop movement.
 * - minX: The minimum x position for the player.
 * - maxX: The maximum x position for the player.
 * - speed: The speed at which the player moves in the loop.
 */
interface LoopConfig {
  minX: number;
  maxX: number;
  speed: number;
}

/**
 * The ClampConfig interface defines the configuration for clamping player position.
 * - min: The minimum x position the player can have.
 * - max: The maximum x position the player can have.
 */
interface ClampConfig {
  min: number;
  max: number;
}

/**
 * The GameObjectTypeMap defines the mapping of game object types to their specific implementations.
 * - raccoon: Represents the player character.
 * - trashcanEmpty: Represents an empty trash can.
 * - trashcanFilled: Represents a filled trash can.
 * - goalFlag: Represents the goal flag in the game.
 */
type GameObjectTypeMap = {
  raccoon: PlayerType;
  trashcanEmpty: StandardGameObjectType;
  trashcanFilled: StandardGameObjectType;
  goalFlag: StandardGameObjectType;
};

/**
 * GameObjectInstancesFromArray is a utility type that creates an object type
 * from an array of keys of GameObjectTypeMap.
 * Each key in the array corresponds to a property in the resulting object,
 * where the property type is the corresponding type from GameObjectTypeMap.
 */
type GameObjectInstancesFromArray<
  T extends readonly (keyof GameObjectTypeMap)[],
> = {
  [K in T[number]]: GameObjectTypeMap[K];
};

/**
 * BackgroundConfig defines the configuration for a background.
 * - spriteKey: The key used to identify the background sprite.
 * - imagePath: The path to the background image.
 * - lightPath: Optional path to an overlay image including lighting effects.
 */
interface BackgroundConfig {
  spriteKey: string;
  imagePath: string;
  lightPath?: string;
}

/**
 * Background configurations for different backgrounds.
 */
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

/**
 * Creates a raccoon player character with various animations and states.
 * @param k - The KAPLAY context.
 * @param game - The game object to which the raccoon will be added.
 * @returns The created raccoon player object.
 */
export function createRaccoon(k: KAPLAYCtx, game: any): PlayerType {
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

/**
 * Loads the trashcan sprite and its animations.
 * @param k - The KAPLAY context.
 */
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

/**
 * Creates a trashcan game object with specified type and tag.
 * @param k - The KAPLAY context.
 * @param game - The game object to which the trashcan will be added.
 * @param type - The type of trashcan ("empty" or "filled").
 * @param tag - The tag to identify the trashcan.
 * @returns The created trashcan game object.
 */
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

/**
 * Creates a goal flag game object with animations and an off-screen indicator.
 * @param k - The KAPLAY context.
 * @param game - The game object to which the flag will be added.
 * @returns The created goal flag game object.
 */
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

/**
 * Adds game objects to the game based on the provided array of game object types.
 * It loads necessary sprites and creates instances of the specified game objects.
 * @param gameobjects - An array of game object types to add.
 * @returns An object containing instances of the specified game objects.
 */
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

/**
 * Adds backgrounds to the game based on the provided array of Background types.
 * It loads necessary sprites and creates background instances with optional lighting effects.
 * @param backgrounds - An array of Background types to add.
 * @param lightOffset - Optional offset for the background light position.
 */
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

/**
 * Sets the player position based on data from the data store. (assuming the "raccoon" GameObject exists in the level!)
 */
function handleNodeMovement(player: PlayerType): void {
  player.pos.x = useDataStore.getState().getData("raccoon", "x");
  player.pos.y = useDataStore.getState().getData("raccoon", "y");
}

/**
 * Updates the data store with the current player position.
 */
function updateDataStore(player: PlayerType): void {
  useDataStore.getState().setData("raccoon", "x", player.pos.x);
  useDataStore.getState().setData("raccoon", "y", player.pos.y);
}

/**
 * Handles player movement based on keyboard input.
 * The player can move left and right using 'a' and 'd' keys, and jump using the spacebar.
 * @param player - The player character object.
 * @param k - The KAPLAY context.
 */
function handleKeyboardMovement(player: PlayerType, k: KAPLAYCtx): void {
  const SPEED = 5;
  const moveLeft = globalKeyTracker.isKeyDown("a");
  const moveRight = globalKeyTracker.isKeyDown("d");

  if (moveLeft) {
    player.pos.x -= SPEED * k.dt();
  }
  if (moveRight) {
    player.pos.x += SPEED * k.dt();
  }

  if (globalKeyTracker.isKeyPressed("space")) {
    if (player.isGrounded()) {
      player.jump(20);
    }
  }
}

export let loopMoveDirection = 1;

/**
 * Handles loop movement for the player character.
 * The player moves back and forth between specified min and max x positions.
 * @param player - The player character object.
 * @param k - The KAPLAY context.
 * @param config - The configuration for loop movement, including minX, maxX, and speed.
 */
function handleLoopMovement(
  player: PlayerType,
  k: KAPLAYCtx,
  config: LoopConfig
): void {
  player.pos.x += config.speed * loopMoveDirection * k.dt();

  if (player.pos.x >= config.maxX) {
    loopMoveDirection = -1;
  } else if (player.pos.x <= config.minX) {
    loopMoveDirection = 1;
  }
}

/**
 * Updates the camera position based on the player's position.
 * The camera follows the player, clamping its position within specified limits if provided.
 * @param player - The player character object.
 * @param k - The KAPLAY context.
 * @param camClampX - Optional configuration for clamping the camera's x position.
 */
function updateCamera(
  player: PlayerType,
  k: KAPLAYCtx,
  camClampX?: ClampConfig
): void {
  const camX = camClampX
    ? Math.max(camClampX.min, Math.min(camClampX.max, player.pos.x))
    : player.pos.x;
  k.setCamPos(k.lerp(k.getCamPos(), k.vec2(camX, -BACKGROUND_OFFSET), 0.1));
}

/**
 * Updates the player's animation state based on their movement.
 * If the player is not moving, they enter the "idle" state.
 * If they are moving left or right, they enter the corresponding walking state.
 * @param player - The player character object.
 * @param lastX - The player's last x position before movement.
 */
function updatePlayerAnimation(player: PlayerType, lastX: number): void {
  const deltaX = player.pos.x - lastX;
  const newState =
    deltaX === 0 ? "idle" : deltaX < 0 ? "walkLeft" : "walkRight";

  if (player.state !== newState) {
    player.enterState(newState);
  }
}

/**
 * AnimPlayerConfig defines the configuration options for the animPlayer function.
 * - movementMode: The mode of movement for the player (node, keyboard, or loop
 * movement).
 * - loopConfig: Optional configuration for loop movement, including minX, maxX, and speed.
 * - playerClampX: Optional configuration for clamping the player's x position.
 * - camClampX: Optional configuration for clamping the camera's x position.
 * - enableCameraUpdate: Whether to update the camera position based on the player's position.
 * - updateStoreData: Whether to update the data store with the player's position.
 */
interface AnimPlayerConfig {
  movementMode?: MovementMode;
  loopConfig?: LoopConfig;
  playerClampX?: ClampConfig;
  camClampX?: ClampConfig;
  enableCameraUpdate?: boolean;
  updateStoreData?: boolean;
}

/**
 * Applies movement to the player based on the specified movement mode.
 * It handles node-based movement, keyboard input, or loop movement.
 * @param player - The player character object.
 * @param k - The KAPLAY context.
 * @param movementMode - The mode of movement for the player (node, keyboard, or loop).
 * @param updateStoreData - Whether to update the data store with the player's position.
 * @param loopConfig - Optional configuration for loop movement, including minX, maxX, and speed.
 */
function applyMovement(
  player: PlayerType,
  k: KAPLAYCtx,
  movementMode: MovementMode,
  updateStoreData: boolean,
  loopConfig?: LoopConfig
): void {
  switch (movementMode) {
    case "node":
      handleNodeMovement(player);
      return;
    case "keyboard":
      handleKeyboardMovement(player, k);
      break;
    case "loop":
      if (loopConfig) {
        handleLoopMovement(player, k, loopConfig);
      }
      break;
  }
  if (updateStoreData) updateDataStore(player);
}

/**
 * Clamps the player's x position within specified limits.
 * If no clampConfig is provided, the player's position remains unchanged.
 * @param player - The player character object.
 * @param clampConfig - Optional configuration for clamping the player's x position.
 */
function clampPlayerPosition(
  player: PlayerType,
  clampConfig?: ClampConfig
): void {
  if (!clampConfig) return;
  player.pos.x = Math.max(
    clampConfig.min,
    Math.min(clampConfig.max, player.pos.x)
  );
}

/**
 * The main function that animates the player character.
 * It applies movement, clamps the player's position, updates the camera,
 * and updates the player's animation state based on their movement.
 * @param player - The player character object.
 * @param k - The KAPLAY context.
 * @param config - Configuration options for the animation player.
 */
export function animPlayer(
  player: PlayerType,
  k: KAPLAYCtx,
  config: AnimPlayerConfig = {}
): void {
  const {
    movementMode = "node",
    loopConfig,
    playerClampX,
    camClampX,
    enableCameraUpdate = true,
    updateStoreData = true,
  } = config;

  const lastX = player.pos.x;

  applyMovement(player, k, movementMode, updateStoreData, loopConfig);

  clampPlayerPosition(player, playerClampX);

  if (enableCameraUpdate) {
    updateCamera(player, k, camClampX);
  }

  updatePlayerAnimation(player, lastX);
}

export function handleReset(raccoon: PlayerType, initDirection: number): void {
  if (raccoon) {
    raccoon?.scaleTo(SPRITE_SCALE * initDirection, SPRITE_SCALE);
    raccoon!.pos.x = 0;
    raccoon!.pos.y = 0;
  }
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
