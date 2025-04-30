import { Position, useKeyPress, useReactFlow } from "@xyflow/react";
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
  const keyPressed = useKeyStore((state) => state.keysPressed[curKey] ?? false);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        results.set(OUT_HANDLE_1, +keyPressed);
      },
    });
  }, [keyPressed]);

  return (
    <div className="min-w-48">
      <NodeContent label="KeyPress" type="float" active={keyPressed}>
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
