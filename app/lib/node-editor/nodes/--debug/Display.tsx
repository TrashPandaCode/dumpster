import { Position, useNodeConnections, useNodesData } from "@xyflow/react";
import { memo } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";

const Display = memo(() => {
  const connection = useNodeConnections({
    handleId: "in-one",
    handleType: "target",
  });

  return (
    <div>
      <NodeContent label="Debug-Display" type="float">
        <div className="flex gap-2">
          <LabelHandle
            id="in-one"
            position={Position.Left}
            isConnectable={connection.length < 1}
          />
          <p>DATA</p>
        </div>
      </NodeContent>
    </div>
  );
});

export default Display;
