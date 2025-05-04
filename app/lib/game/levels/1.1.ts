import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx"
import { useDebugStore } from "~/lib/zustand/debug";

const RACOON_SPEED = 3000;

export const initialize1_1 = () => {
    const k = getKaplayCtx();

    k.loadBean();
    const racoon = k.add([
        k.sprite("bean"),
        k.pos(20, 130),
    ]);

    const trashCan = k.add([
        k.sprite("bean"),
        k.color(0, 0, 0),
        k.pos(400, 400), // this is overridden by the node data
        k.scale(0.5),
        k.area(),
    ]);
    trashCan.tag("trashCan");

    const finishLine = k.add([
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

    k.onUpdate(() => {
        if (useGameStore.getState().isPaused) return;
        
        racoon.move(RACOON_SPEED * k.dt(), 0);

        //Move
        const x = useDebugStore.getState().nodeData.get("xpos")?.value ?? 0;
        const y = useDebugStore.getState().nodeData.get("ypos")?.value ?? 0;

        trashCan.pos.x = x;
        trashCan.pos.y = y;


        // transfer all node data to game data
        useDebugStore.getState().transferData();
    });
}