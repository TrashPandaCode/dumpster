import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE, SPRITE_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
  moveDirection,
} from "../utils/gameHelper";

const TRASHCANP = "trashcanP";

export const PARENTING_GAME_OBJECTS = [TRASHCANP] as const;

export const initializeParenting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, goalFlag } = addGameobjects(["raccoon", "goalFlag"]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });
  const trashcanP = game.add([
    k.sprite("trashcan", {
      anim: "filled",
    }),
    k.anchor("bot"),
    k.pos(0, 0),
    k.scale(SPRITE_SCALE),
    k.area(),
    k.z(1),
    "trashcanP",
  ]);

  const trashcanPState = useDataStore.getState().gameObjects.get("trashcanP");

  trashcanPState!.get("xpos")!.value = 5;

  trashcanP!.z = 3;
  trashcanP!.pos.x = 5;

  raccoon!.pos.x = -15;

  goalFlag!.pos.x = -22;

  let timeParenting = 0;
  let trashCounter = 0;
  let hasEmptiedTrashcan = false;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const distTrashStart = trashcanP!.pos.dist(5);
    const distTrashGoal = trashcanP!.pos.dist(goalFlag!.pos);

    if (moveDirection === -1 && distTrashStart <= 1.5 + 5) {
      // Swap the trashcan sprites
      trashcanP!.play("filled");
    } else if (moveDirection === 1 && distTrashGoal <= 1.5) {
      trashcanP!.play("empty");
    }

    animPlayer(raccoon!, k, "loop", {
      speed: 5,
      minX: -21,
      maxX: 5,
    });

    trashcanP!.pos.x = trashcanPState!.get("xpos")!.value;

    const distTrashRac = raccoon!.pos.dist(trashcanP!.pos);

    if (distTrashRac <= 1.5) {
      timeParenting += k.dt();

      if (distTrashGoal <= 2 && !hasEmptiedTrashcan) {
        console.log("trashcan emptied");
        trashCounter += 1;
        hasEmptiedTrashcan = true;
      }
      if (distTrashGoal > 2 && hasEmptiedTrashcan) {
        hasEmptiedTrashcan = false;
      }

      if (timeParenting >= 5 && trashCounter === 3) {
        useGameStore.getState().setLevelCompleteDialogOpen(true);
        useGameStore.getState().setLevelCompleted(true);
      }
    } else {
      timeParenting = 0;
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
