import { Position, useKeyPress, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import SelectDropDown from "../../node-components/SelectDropDown";

const KeyPress = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [curKey, setCurKey] = useState("");
  const keyPressed = useKeyPress(curKey);

  useEffect(() => {
    updateNodeData(id, { value: +keyPressed });
  }, [keyPressed]);

  return (
    <div className="min-w-48">
      <NodeContent label="KeyPress" type="float" highlight={keyPressed}>
        <div className="flex w-full justify-end gap-2">
          <SelectDropDown
            setSelected={setCurKey}
            items={{ keys: ["w", "a", "s", "d"], other: ["space", "enter"] }}
          />
          <LabelHandle
            id="result-handle"
            position={Position.Right}
            label="Value"
          />
        </div>
      </NodeContent>
    </div>
  );
});

export default KeyPress;
