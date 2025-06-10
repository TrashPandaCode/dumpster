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

const ARM1 = "arm1";
const ARM2 = "arm2";
const PLATFORM = "platform";

export const KINEMATICS_GAME_OBJECTS = [ARM1, ARM2, PLATFORM] as const;

export const initializeKinematics = () => {
    const { k, game } = getKaplayCtx();
    k.setGravity(100);

    addBackgrounds(["background2"]);

    const { raccoon, goalFlag } = addGameobjects(["raccoon", "goalFlag"]);
    k.setCamPos(7.5, -BACKGROUND_OFFSET);
    k.setCamScale((CAM_SCALE * k.height()) / 947);

    goalFlag!.pos.x = 18;

    const floor1 = k.add([
        k.rect(20, 1),
        k.anchor("top"),
        k.pos(-8, 0),
        k.area(),
        k.body({ isStatic: true }),
        k.opacity(0),
    ]);

    const floor2 = k.add([
        k.rect(20, 1),
        k.anchor("top"),
        k.pos(27, 0),
        k.area(),
        k.body({ isStatic: true }),
        k.opacity(0),
    ]);

    const arm1 = k.add([
        "arm1",
        k.rect(0.2, 3),
        k.anchor("bot"),
        k.pos(8, 4),
        k.rotate(0),
        k.area(),
        k.body({ isStatic: true }),
        k.color(255 ,25 ,25),
        k.z(1),
    ]);
    const arm2 = k.add([
        "arm2",
        k.rect(0.2, 3),
        k.anchor("bot"),
        k.pos(8, 1),
        k.rotate(0),
        k.area(),
        k.body({ isStatic: true }),
        k.color(25 ,255 ,25),
        k.z(2),
    ]);
    const platform = k.add([
        k.rect(4, 0.2),
        k.anchor("bot"),
        k.pos(8, -2),
        k.area(),
        k.body({ isStatic: true }),
        k.color(25 ,25 ,255),
        k.z(3),
    ]);


    // Initialize states in the data store
    const arm1State = useDataStore.getState().gameObjects.get("arm1");
    const arm2State = useDataStore.getState().gameObjects.get("arm2");
    const platformState = useDataStore.getState().gameObjects.get("platform");

    arm1State!.get("xpos")!.value = arm1.pos.x;
    arm1State!.get("ypos")!.value = arm1.pos.y;
    arm1State!.get("rotation")!.value = arm1.angle;

    arm2State!.get("xpos")!.value = arm2.pos.x;
    arm2State!.get("ypos")!.value = arm2.pos.y;
    arm2State!.get("rotation")!.value = arm2.angle;

    platformState!.get("xpos")!.value = platform.pos.x;
    platformState!.get("ypos")!.value = platform.pos.y;

    game.onUpdate(() => {
    if (useGameStore.getState().isPaused) return;

    arm1.angle = arm1State!.get("rotation")!.value;

    arm2.pos.x = arm2State!.get("xpos")!.value;
    arm2.pos.y = arm2State!.get("ypos")!.value;
    arm2.angle = arm2State!.get("rotation")!.value;

    platform.pos.x = platformState!.get("xpos")!.value;
    platform.pos.y = platformState!.get("ypos")!.value;

    animPlayer(raccoon!, k, "input", undefined, undefined, { minX: 5, maxX: 15 });

    k.onKeyDown("space", () => {
    if (raccoon!.isGrounded()) {
        raccoon!.jump(20);
    }
    });

    if (raccoon!.pos.y > 10){
        raccoon!.pos.x = 0;
        raccoon!.pos.y = 0;
    }
    if (useDataStore.getState().initData) {
        handleReset(raccoon!, 1);
    }
    });
};