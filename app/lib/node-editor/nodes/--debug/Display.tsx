import { Position, useNodeConnections, useNodesData } from "@xyflow/react";
import { memo } from "react";

import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";

const Display = memo(() => {
  const connection = useNodeConnections({
    handleId: "in-one",
    handleType: "target",
  });
  const data = useNodesData(connection[0]?.source)?.data[
    connection[0]?.sourceHandle ?? ""
  ];

  return (
    <div>
      <NodeContent label="Debug-Display" type="float">
        <div className="flex gap-2">
          <LabelHandle
            id="in-one"
            position={Position.Left}
            isConnectable={connection.length < 1}
          />
          <p>{String(data)}</p>
        </div>
      </NodeContent>
    </div>
  );
});

export default Display;
