import { getKaplayCtx } from "../core/kaplayCtx"
import { useDebugStore } from "~/lib/zustand/debug";

export const initializePlayground = () => {
    const k = getKaplayCtx();

    k.loadBean();
    const bean = k.add([
        k.sprite("bean"),
        k.color(0, 0, 255),
        k.pos(100, k.height() - 100),
    ]);

    //Create "Floor" Component
    const floor = k.add([
        k.rect(k.width(), 5),
        k.pos(0, k.height() - 5),
        k.color(255, 200, 200),
        k.area(),
        k.body({ isStatic: true }),
        "floor",
    ]);

    k.onUpdate(() => {
        //Move
        const x = useDebugStore.getState().nodeData.get("xpos")?.value ?? 0;
        const y = useDebugStore.getState().nodeData.get("ypos")?.value ?? 0;

        bean.pos.x = x;
        bean.pos.y = y;

        // transfer all node data to game data
        useDebugStore.getState().transferData();
    });
}