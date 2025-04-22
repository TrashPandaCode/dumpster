import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";

import Body from "../../node-components/Body";
import Footer from "../../node-components/Footer";
import Header from "../../node-components/Header";

const Display = () => {
  const incomingConnections = useNodeConnections({
    handleId: "in",
    handleType: "target",
  });
  const incomingData = useNodesData(incomingConnections?.[0]?.source);

  return (
    <div>
      <Header>Debug-Display</Header>
      <Body>
        <div className="flex gap-2">
          <Handle
            id="in1"
            type="target"
            position={Position.Left}
            className="!relative !top-3"
          />
          <label htmlFor="in1">OF</label>
          <p>{String(incomingData?.data.value)}</p>
        </div>
        <div className="flex gap-2">
          <Handle
            id="in2"
            type="target"
            position={Position.Left}
            className="!relative !top-3"
          />
          <label htmlFor="in2">OOF</label>

          <p>{String(incomingData?.data.value)}</p>
        </div>
        <div className="flex gap-2">
          <Handle
            id="in3"
            type="target"
            position={Position.Left}
            className="!relative !top-3"
          />
          <label htmlFor="in3">OOOF</label>
          <p>{String(incomingData?.data.value)}</p>
        </div>
      </Body>
    </div>
  );
};

export default Display;
