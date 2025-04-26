import { Position, useReactFlow } from "@xyflow/react";
import React, { memo, useEffect, useState } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";

const GetFromGameobject = memo(({ id }: { id: string }) => {
  const xPos = useDebugStore((state) => state.xpos);
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(xPos);
    updateNodeData(id, { value: value });
  }, [xPos]);

  return (
    <div className="min-w-48">
      <NodeContent label="XPOS TEST" type="float">
        <div className="flex w-full justify-end gap-2">
          <NumberInput
            value={value}
            setValue={setValue}
            defaultValue={0}
            disabled
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

export default GetFromGameobject;
