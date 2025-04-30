import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";

const Display = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [displaNumber, setDisplayNumber] = useState(0);

  const connection = useNodeConnections({
    handleId: "input-handle",
    handleType: "target",
  });

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, results: nodeData) => {
        setDisplayNumber(getInput(inputs, "input-handle", 0));
      },
    });
  }, []);

  return (
    <div>
      <NodeContent label="Debug-Display" type="float">
        <div className="flex gap-2">
          <LabelHandle
            id="input-handle"
            position={Position.Left}
            isConnectable={connection.length < 1}
          />
          <p>{displaNumber}</p>
        </div>
      </NodeContent>
    </div>
  );
});

export default Display;
