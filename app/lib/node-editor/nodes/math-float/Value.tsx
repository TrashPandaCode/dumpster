import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import type { nodeInputs, nodeResults } from "../../node-store/node-store";
import { OUT_HANDLE_1 } from "../constants";

/**
 * React component representing a node that outputs a constant numerical value.
 *
 * Props:
 * @param {string} id - The unique identifier for this node.
 * @param {any} data - The data object for this node, including the initial value.
 */
const Value = memo(({ id, data }: { id: string; data: any }) => {
  const { updateNodeData } = useReactFlow();
  const [value, setValue] = useState<number>(data.value ?? 0);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeResults) => {
        results.set(OUT_HANDLE_1, value);
      },
      value,
    });
  }, [value]);

  return (
    <div className="min-w-48">
      <NodeContent label="Value" type="float" docsName="value">
        <div className="flex w-full justify-end gap-2">
          <NumberInput
            setValue={(v) => setValue(v)}
            defaultValue={value}
            handleId={OUT_HANDLE_1}
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

export default Value;
