import { Position, useReactFlow } from "@xyflow/react";
import React, { memo, useEffect, useState } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";
import LabelHandle from "../../node-components/LabelHandle";
import NumberInput from "../../node-components/NumberInput";

const Value = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState(0);

  useEffect(() => {
    updateNodeData(id, { value: value });
  }, [value]);

  return (
    <div className="min-w-48">
      <Header>Value</Header>
      <Body>
        <LabelHandle
          id="result-handle"
          position={Position.Right}
          label="Value"
        />
        <NumberInput setValue={setValue} defaultValue={0} />
      </Body>
    </div>
  );
});

export default Value;
