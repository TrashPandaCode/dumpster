import { getKaplayCtx } from "../core/kaplayCtx"

export const initializePlayground = () => {
    const k = getKaplayCtx();

    k.loadBean();
    k.add([
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
}