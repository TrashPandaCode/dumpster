import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect, useState } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import { IN_HANDLE_1 } from "../constants";

const Display = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const [displaNumber, setDisplayNumber] = useState(0);

  const connection = useNodeConnections({
    handleId: IN_HANDLE_1,
    handleType: "target",
  });

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, _: nodeData) => {
        setDisplayNumber(getInput(inputs, IN_HANDLE_1, 0));
      },
    });
  }, []);

  return (
    <div className="min-w-48">
      <NodeContent label="Debug-Display" type="float">
        <div className="flex gap-2">
          <LabelHandle
            id={IN_HANDLE_1}
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
