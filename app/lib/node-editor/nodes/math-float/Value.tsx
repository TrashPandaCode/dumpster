import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useMemo, useState } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";

const Value = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState(0);

  useEffect(() => {
    updateNodeData(id, { value: value });
  }, [value]);

  // TODO: this remove unnecessary rerender but initial value has to be set when spawing node
  // const setValue = (val: number) => {
  //   updateNodeData(id, { value: val });
  // };

  return (
    <div className="min-w-48">
      <NodeContent label="Value" type="float">
        <div className="flex w-full justify-end gap-2">
          <NumberInput setValue={setValue} defaultValue={0} />
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

export default Value;
