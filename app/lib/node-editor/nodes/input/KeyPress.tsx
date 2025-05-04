import { Position, useReactFlow } from "@xyflow/react";
import classnames from "classnames";
import { memo, useEffect, useState } from "react";

import { useKeyStore } from "~/lib/zustand/key";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1 } from "../constants";

const KeyPress = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [curKey, setCurKey] = useState("");
  const [keyPressType, setKeyPressType] = useState<
    "down" | "press" | "release"
  >("down");

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
            active = keyDown(curKey);
            results.set(OUT_HANDLE_1, +active);
            break;
          case "press":
            active = keyPressed(curKey);
            results.set(OUT_HANDLE_1, +active);
            break;
          case "release":
            active = keyReleased(curKey);
            results.set(OUT_HANDLE_1, +active);
            break;
        }
        setActive(active);
      },
    });
  }, [curKey, keyPressType]);

  return (
    <div className="min-w-48">
      <NodeContent label="KeyPress" type="float" active={active}>
        <div className="mb-2 flex w-full flex-row">
          <button
            className={classnames(
              "nodrag m-auto rounded px-2 hover:cursor-pointer",
              keyPressType == "down" ? "bg-slate-600" : "bg-slate-900"
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
              keyPressType == "press" ? "bg-slate-600" : "bg-slate-900"
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
              keyPressType == "release" ? "bg-slate-600" : "bg-slate-900"
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
            setSelected={setCurKey}
            items={{ keys: ["w", "a", "s", "d"], other: ["space", "enter"] }}
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
