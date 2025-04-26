import { Position, useNodeConnections, useNodesData } from "@xyflow/react";
import { memo } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";

const Display = memo(() => {
  const incomingConnection = useNodeConnections({
    handleId: "in-one",
    handleType: "target",
  });
  const incomingData = useNodesData(incomingConnection[0]?.source);

  return (
    <div>
      <NodeContent label="Debug-Display" type="float">
        <div className="flex gap-2">
          <LabelHandle
            id="in-one"
            position={Position.Left}
            isConnectable={incomingConnection.length < 1}
          />
          <p>{String(incomingData?.data.value)}</p>
        </div>
      </NodeContent>
    </div>
  );
});

export default Display;
