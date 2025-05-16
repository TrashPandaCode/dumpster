import { useDataStore } from "~/lib/zustand/data";
import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";

const RACOON_SPEED = 3000;

export const initialize1_1 = () => {
  const { k, game } = getKaplayCtx();

  k.loadBean();
  const racoon = game.add([k.sprite("bean"), k.pos(20, 130)]);

  const trashCan = game.add([
    k.sprite("bean"),
    k.color(0, 0, 0),
    k.pos(400, 400), // this is overridden by the node data
    k.scale(0.5),
    k.area(),
  ]);
  trashCan.tag("trashCan");

  const finishLine = game.add([
    k.sprite("bean"),
    k.color(255, 0, 0),
    k.pos(600, 100), // this is overridden by the node data
    k.scale(4, 0.5),
    k.area(),
  ]);
  finishLine.tag("finishLine");

  k.onCollide("trashCan", "finishLine", (trashCan, finishLine) => {
    console.log("Collided with finish line");
  });

  game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    const gameObjects = useDataStore.getState().gameObjects;

    // racoon.move(RACOON_SPEED * k.dt(), 0);
    racoon.pos.x = (racoon.pos.x + 1) % 1000;
    // Write racoon position to store
    const { handleId, access } = gameObjects.get("racoon")!.get("xpos")!;
    gameObjects.get("racoon")!.set("xpos", {
      handleId,
      access,
      value: racoon.pos.x,
    });

    //Move TrashCan
    trashCan.pos.x = gameObjects.get("trashCan")?.get("xpos")?.value ?? 0;
    trashCan.pos.y = gameObjects.get("trashCan")?.get("ypos")?.value ?? 0;
  });
};
