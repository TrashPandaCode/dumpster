import { useGameStore } from "~/lib/zustand/game";
import { getKaplayCtx } from "../core/kaplayCtx";
import { useDataStore } from "~/lib/zustand/data";

export const initialize2_1 = () => {
    const { k, game } = getKaplayCtx();

    //Load Sprites
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
    k.loadSprite("trashcan", "/game/sprites/trashcan_spritesheet.png", {
        sliceX: 2,
        sliceY: 1,
        anims: {
            empty: { from: 0, to: 0, loop: false },
            filled: { from: 1, to: 1, loop: false },
        },
    });
    k.loadSprite("flag", "/game/sprites/flag_spritesheet.png", {
        sliceX: 2,
        sliceY: 2,
        anims: {
            default: { from: 0, to: 3, loop: true },
        },
    });

    k.setGravity(2000);

    //Create Basic Game Objects
    const raccoon = game.add([
        k.sprite("raccoon", {
            anim: "walkHolding",
        }),
        k.pos(100, k.height() - 100),
        k.scale(5),
        k.area(),
        k.body(),
        "raccoon",
    ]);

    const flag = game.add([
        k.sprite("flag", {
            anim: "default",
        }),
        k.pos(800, 125),
        k.scale(5),
        k.area(),
        "flag",
    ]);

    const floor = game.add([
        k.rect(k.width(), 5),
        k.pos(0, k.height() - 5),
        k.color(255, 200, 200),
        k.area(),
        k.body({ isStatic: true }),
        "floor",
    ]);

    //Create Level Based Game Objects
    const ladderRight = game.add([
        k.rect(100, 300),
        k.pos(k.width() - 200, k.height() - 325),
        k.color(50, 50, 50),
        k.area(),
        "ladderRight",
    ]);

    const platformMiddle = game.add([
        k.rect(k.width() - 50, 40),
        k.pos(25, k.height() - 345),
        k.color(100, 100, 100),
        k.area(),
        k.body({ isStatic: true }),
        k.platformEffector(),
        "platformMiddle",
    ]);

    const ladderLeft = game.add([
        k.rect(100, 300),
        k.pos(50, k.height() - 665),
        k.color(50, 50, 50),
        k.area(),
        "ladderLeft",
    ]);

    const platformTop = game.add([
        k.rect(k.width() - 50, 40),
        k.pos(25, k.height() - 690),
        k.color(100, 100, 100),
        k.area(),
        k.body({ isStatic: true }),
        k.platformEffector(),
        "platformTop",
    ]);

    k.onCollide("raccoon", "flag", (raccoon, flag) => {
        raccoon.pos.x = 100;
        raccoon.pos.y = k.height() - 100;
        raccoon.vel.x = 0;
        raccoon.vel.y = 0;
        console.log("Collided with finish line");
    });

    game.onUpdate(() => {
        if (useGameStore.getState().isPaused) return;

        // //Move raccoon
        // raccoon.vel.x =
        //   useDataStore.getState().gameObjects.get("raccoon")?.get("xpos")?.value ?? 0;
        // raccoon.vel.y =
        //   useDataStore.getState().gameObjects.get("raccoon")?.get("ypos")?.value ?? 0;

        if (raccoon.isOverlapping(ladderRight || ladderLeft)) {
            raccoon.gravityScale = 0;

        } else {
            raccoon.gravityScale = 1;
        }

        // Only for testing of the level complete dialog
            const value = useDataStore.getState().gameObjects.get("raccoon")?.get("value")?.value ?? 0;
            const levelCompleted = useGameStore.getState().levelCompleted;

            if (value == 16 && !levelCompleted) {
              raccoon.pos.x = 0.5 * k.width();
        
              useGameStore.getState().setLevelCompleteDialogOpen(true);
              useGameStore.getState().setLevelCompleted(true);
            }
    });
};