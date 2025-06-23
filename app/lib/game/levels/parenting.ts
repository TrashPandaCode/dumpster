import { createLevelDataHelpers } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplay-ctx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
  moveDirection,
} from "../utils/game-helper";

export const initializeParenting = () => {
  const { k, game } = getKaplayCtx();
  const dataHelper = createLevelDataHelpers("parenting");

  addBackgrounds(["default"]);

  const {
    raccoon,
    goalFlag,
    trashcanFilled: trashcan,
  } = addGameobjects(["raccoon", "goalFlag", "trashcanFilled"]);

  k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
    sliceX: 2,
    sliceY: 1,
    anims: {
      empty: { from: 0, to: 0, loop: false },
      filled: { from: 1, to: 1, loop: false },
    },
  });

  dataHelper.setData("trashcanFilled", "x", 5);

  trashcan.z = 3;
  trashcan.pos.x = 5;

  raccoon.pos.x = -15;

  goalFlag.pos.x = -18;

  let timeParenting = 0;
  let trashCounter = 0;
  let hasEmptiedTrashcan = false;

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const distTrashStart = trashcan.pos.dist(5);
    const distTrashGoal = trashcan.pos.dist(goalFlag!.pos);

    if (moveDirection === -1 && distTrashStart <= 1.5 + 5) {
      // Swap the trashcan sprites
      trashcan.play("filled");
    } else if (moveDirection === 1 && distTrashGoal <= 1.5) {
      trashcan.play("empty");
    }

    animPlayer(raccoon, k, {
      movementMode: "loop",
      loopConfig: {
        speed: 5,
        minX: -17,
        maxX: 5,
      },
    });

    trashcan.pos.x = dataHelper.getData("trashcanFilled", "x");
    trashcan.pos.y = dataHelper.getData("trashcanFilled", "y");

    const distTrashRac = raccoon.pos.dist(trashcan.pos);

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
        useGameStore.getState().setLevelCompleted(true);
      }
    } else {
      timeParenting = 0;
    }

    if (dataHelper.initData()) {
      handleReset(raccoon, 1);
    }
  });
};
