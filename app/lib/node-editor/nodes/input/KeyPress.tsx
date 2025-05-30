import { Position, useReactFlow } from "@xyflow/react";
import classnames from "classnames";
import { memo, useEffect, useRef, useState } from "react";

import { useKeyStore } from "~/lib/zustand/key";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1 } from "../constants";

type KeyState = "down" | "press" | "release";

const KeyPress = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const curKey = useRef(data.curKey ? data.curKey.current : "");
  const [keyPressType, setKeyPressType] = useState<KeyState>(
    data.keyPressType ?? "down"
  );

  const keyDown = useKeyStore((state) => state.isKeyDown);
  const keyPressed = useKeyStore((state) => state.isKeyPressed);
  const keyReleased = useKeyStore((state) => state.isKeyReleased);
  const [active, setActive] = useState(false);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        let active = false;
        switch (keyPressType) {
          case "down":
            active = keyDown(curKey.current);
            results.set(OUT_HANDLE_1, +active);
            break;
          case "press":
            active = keyPressed(curKey.current);
            results.set(OUT_HANDLE_1, +active);
            break;
          case "release":
            active = keyReleased(curKey.current);
            results.set(OUT_HANDLE_1, +active);
            break;
        }
        setActive(active);
      },
      curKey,
      keyPressType,
    });
  }, [keyPressType]);

  return (
    <div className="min-w-60">
      <NodeContent
        label="KeyPress"
        type="input"
        active={active}
        docsName="keypress"
      >
        <div className="mb-2 flex w-full flex-row">
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "down"
                ? "outline outline-blue-300"
                : "bg-slate-900"
            )}
            onClick={() => {
              setKeyPressType("down");
            }}
          >
            Down
          </button>
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "press"
                ? "outline outline-blue-300"
                : "bg-slate-900"
            )}
            onClick={() => {
              setKeyPressType("press");
            }}
          >
            Press
          </button>
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "release"
                ? "outline outline-blue-300"
                : "bg-slate-900"
            )}
            onClick={() => {
              setKeyPressType("release");
            }}
          >
            Release
          </button>
        </div>
        <div className="flex w-full justify-end gap-2">
          <SelectDropDown
            setSelected={(v) => (curKey.current = v)}
            items={{ Keys: ["w", "a", "s", "d"], Other: ["space", "enter"] }}
            defaultValue={curKey.current}
          />
          <LabelHandle
            id={OUT_HANDLE_1}
            position={Position.Right}
            label="Value"
          />
        </div>
      </NodeContent>
    </div>
  );
});

export default KeyPress;
