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
        <div className="flex items-center justify-center">
          <Handle
            id="in"
            type="target"
            position={Position.Left}
            isConnectable={true}
          />
          <p>{String(incomingData?.data.value)}</p>
        </div>
      </Body>
      <Footer>This is the Footer ????</Footer>
    </div>
  );
};

export default Display;
