import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { BACKGROUND_OFFSET, CAM_SCALE } from "../constants";
import { getKaplayCtx } from "../core/kaplayCtx";
import {
  addBackgrounds,
  addGameobjects,
  animPlayer,
  handleReset,
} from "../utils/gameHelper";

export const initializeParenting = () => {
  const { k, game } = getKaplayCtx();

  addBackgrounds(["background1"]);

  const { raccoon, trashcanFilled, goalFlag } = addGameobjects([
    "raccoon",
    "trashcanFilled",
    "goalFlag",
  ]);
  k.setCamPos(0, -BACKGROUND_OFFSET);
  k.setCamScale((CAM_SCALE * k.height()) / 947);

  trashcanFilled!.pos.x = 5;
  trashcanFilled!.pos.y = -0.5;

  goalFlag!.pos.x = -22;

  // const spacePrompt = game.add([
  //   k.rect(1, 0.5, { radius: 0.1 }),
  //   k.pos(trashcanFilled!.pos.x, trashcanFilled!.pos.y - 3),
  //   k.z(10),
  //   k.anchor("center"),
  //   k.opacity(0),
  //   "spacePrompt",
  // ]);

  // const spaceText = game.add([
  //   k.text("SPACE", { size: 0.25 }),
  //   k.color(0, 0, 0),
  //   k.pos(trashcanFilled!.pos.x, trashcanFilled!.pos.y - 3),
  //   k.z(11),
  //   k.anchor("center"),
  //   k.opacity(0),
  //   "spaceText",
  // ]);

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    animPlayer(raccoon!, k, "input");

    // useDataStore.getState().gameObjects.set(
    //   "raccoon",
    //   new Map([
    //     ["xpos", { access: "get", value: raccoon!.pos.x }],
    //     ["ypos", { access: "get", value: raccoon!.pos.y }],
    //   ])
    // );

    // const trashcanObj = useDataStore
    //   .getState()
    //   .gameObjects.get("trashcanFilled");

    // let keyPressed = trashcanObj?.get("keyPressed")?.value ?? 0;

    // //Distance between raccoon and trashcan on the x-axis
    // const dist = raccoon!.pos.dist(trashcanFilled!.pos.x, raccoon!.pos.y);

    // if (dist >= 3 && keyPressed !== 0) {
    //   useDataStore
    //     .getState()
    //     .gameObjects.set(
    //       "trashcanFilled",
    //       new Map([
    //         ...(trashcanObj || []),
    //         ["keyPressed", { access: "get", value: 0 }],
    //       ])
    //     );
    //   keyPressed = 0;
    // }

    // //NOTE: Only fixed parenting works for now. For some reason youre not able to add an offset yet.
    // if (dist < 3) {
    //   if (keyPressed === 1) {
    //     trashcanFilled!.pos.x =
    //       (useDataStore.getState().gameObjects.get("raccoon")?.get("xpos")
    //         ?.value ?? 0) + 1.5;
    //     trashcanFilled!.pos.y =
    //       useDataStore.getState().gameObjects.get("raccoon")?.get("ypos")
    //         ?.value ?? 0;
    //     spacePrompt.opacity = 0;
    //     spaceText.opacity = 0;
    //   } else {
    //     spacePrompt.opacity = 1;
    //     spaceText.opacity = 1;
    //     spacePrompt.pos.x = trashcanFilled!.pos.x;
    //     spacePrompt.pos.y = trashcanFilled!.pos.y - 3;
    //     spaceText.pos.x = trashcanFilled!.pos.x;
    //     spaceText.pos.y = trashcanFilled!.pos.y - 3;
    //   }
    // } else {
    //   spacePrompt.opacity = 0;
    //   spaceText.opacity = 0;
    // }

    const distGoal = trashcanFilled!.pos.dist(goalFlag!.pos);

    if (distGoal <= 1 && !useGameStore.getState().levelCompleted) {
      //TODO: Raccoon continues walking after "Continue Playing" is clicked
      useGameStore.getState().setLevelCompleteDialogOpen(true);
      useGameStore.getState().setLevelCompleted(true);
    }

    if (useDataStore.getState().initData) {
      handleReset(raccoon!, 1);
    }
  });
};
