import { Handle, Position, useReactFlow } from "@xyflow/react";
import React, { memo, useCallback, useEffect, useState } from "react";

import Body from "../../node-components/Body";
import CustomHandle from "../../node-components/CustomHandle";
import Header from "../../node-components/Header";
import NumberInput from "../../node-components/NumberInput";

const Value = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState(0);

  useEffect(() => {
    updateNodeData(id, { value: value });
  }, [value]);

  return (
    <div>
      <Header>Float Value</Header>
      <Body>
        <CustomHandle
          id="result-handle"
          label="Value"
          position={Position.Right}
        />
        <NumberInput setValue={setValue} />
      </Body>
    </div>
  );
});

export default Value;
