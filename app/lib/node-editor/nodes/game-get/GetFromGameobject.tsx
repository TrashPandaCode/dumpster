import { Position, useReactFlow } from "@xyflow/react";
import React, { memo, useEffect, useState } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";

const GetFromGameobject = memo(({ id }: { id: string }) => {
  // const xPos = useDebugStore((state) => state.xpos);
  const { updateNodeData } = useReactFlow();
  // const [value, setValue] = useState(0);

  // useEffect(() => {
  //   setValue(xPos);
  //   updateNodeData(id, { value: value });
  // }, [xPos]);

  useEffect(() => {
    updateNodeData(id, { "result-handle": 1, "result-two-handle": 2 });
  }, []);

  return (
    <div className="min-w-48">
      <NodeContent label="XPOS TEST" type="float">
        {/* <NumberInput
            value={value}
            setValue={setValue}
            defaultValue={0}
            disabled
          /> */}
        <LabelHandle
          id="result-handle"
          position={Position.Right}
          label="Value"
        />
        <LabelHandle
          id="result-two-handle"
          position={Position.Right}
          label="Value"
        />
      </NodeContent>
    </div>
  );
});

export default GetFromGameobject;
