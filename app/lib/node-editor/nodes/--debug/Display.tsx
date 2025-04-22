import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";

const Display = () => {
  // const incomingData = useNodesData(
  //   useNodeConnections({
  //     handleId: "in",
  //     handleType: "target",
  //   })?.[0].source
  // );

  return (
    <div>
      <Handle
        id="in"
        type="target"
        position={Position.Left}
        isConnectable={true}
      />
      <p>I am a Display-Node</p>
      {/* <p>{incomingData?.data ? String(incomingData.data.value) : ""}</p> */}
    </div>
  );
};

export default Display;
