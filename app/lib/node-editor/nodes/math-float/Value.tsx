import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useRef } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import NumberInput from "../../node-components/NumberInput";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1 } from "../constants";

const Value = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const value = useRef(0);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        results.set(OUT_HANDLE_1, value.current);
      },
    });
  }, []);

  return (
    <div className="min-w-48">
      <NodeContent label="Value" type="float">
        <div className="flex w-full justify-end gap-2">
          <NumberInput setValue={(v) => (value.current = v)} defaultValue={0} />
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
