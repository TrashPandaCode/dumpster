import { Position, useKeyPress, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1 } from "../constants";

const KeyPress = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [curKey, setCurKey] = useState("");
  const keyPressed = useDebugStore(
    (state) => state.keysPressed[curKey] ?? false
  );

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        results.set(OUT_HANDLE_1, +keyPressed);
      },
    });
  }, [keyPressed]);

  return (
    <div className="min-w-48">
      <NodeContent label="KeyPress" type="float" highlight={keyPressed}>
        <div className="flex w-full justify-end gap-2">
          <SelectDropDown
            setSelected={setCurKey}
            items={{ keys: ["w", "a", "s", "d"], other: ["Space", "Enter"] }}
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
