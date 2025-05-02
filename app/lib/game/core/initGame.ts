import { useNodeStore } from "~/lib/node-editor/node-store/node-store";
import { useDebugStore } from "~/lib/zustand/debug";
import { useKeyStore } from "~/lib/zustand/key";
import { useTimeStore } from "~/lib/zustand/time";
import { getKaplayCtx } from "./kaplayCtx";

let first = true; //TODO: remove just for react strict mode

/**
 * Initializes the game with a canvas element and sets up the game loop.
 * Is ALWAYS called before a level is loaded.
 * @param canvas The canvas element to use for rendering the game.
 * @returns Kaplay context
 */
export default function initGame(canvas: HTMLCanvasElement) {
  if (!first) return; //TODO: remove just for react strict mode
  first = false; //TODO: remove just for react strict mode

  const k = getKaplayCtx(canvas);
  const setKeyPressed = useKeyStore.getState().setKeyPressed;

  k.setBackground(100, 100, 100);

  k.loadBean(); //Load Bean sprite
  const bean = k.add([
    k.sprite("bean"),
    k.pos(100, k.height() - 100),
    k.area(),
    k.body({ mass: 2 }),
    "playerBean",
  ]);
  const beanState = {
    isGrounded: false,
    canJump: true,
    jumpForce: 500,
  };

  // Key Presses for multiple keys at once. Maybe better in another file or at another place?
  k.onKeyDown((key) => {
    setKeyPressed(key, true);
  });

  k.onKeyRelease((key) => {
    setKeyPressed(key, false);
  });


  //Game Loop, runs at 60 frames per second
  const setTime = useTimeStore.getState().setTime;
  const setDeltaTime = useTimeStore.getState().setDeltaTime;
  k.onUpdate(() => {
    const time = k.time();
    const deltaTime = k.dt();
    setTime(time);
    setDeltaTime(deltaTime);

    // compute node map
    useNodeStore.getState().compute();

    //Move
    const x = useDebugStore.getState().nodeData.get("xpos")?.value ?? 0;
    const y = useDebugStore.getState().nodeData.get("ypos")?.value ?? 0;

    bean.pos.x = x;
    bean.pos.y = y;

    //bean.addForce(k.vec2(x, 0)); //scuffed, needs max velocity function

    //Jump
    // if (y > 0 && beanState.canJump == true) {
    //   //Provisionary input until we have proper export nodes
    //   bean.jump(beanState.jumpForce);
    //   beanState.canJump = false;
    //   beanState.isGrounded = false;
    // }

    // if (bean.pos.x > k.width()) {
    //   bean.pos.x = 0;
    // }
    // if (bean.isColliding(floor)) {
    //   beanState.isGrounded = true;
    //   beanState.canJump = true;
    // }

    // transfer all node data to game data
    useDebugStore.getState().transferData();
  });

  return k;
}
