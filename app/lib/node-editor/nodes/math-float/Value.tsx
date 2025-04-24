import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

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
        <div className="flex w-full justify-end gap-2">
          <NumberInput setValue={setValue} defaultValue={0} />
          <LabelHandle
            id="result-handle"
            position={Position.Right}
            label="Value"
          />
        </div>
      </Body>
    </div>
  );
});

export default Value;
