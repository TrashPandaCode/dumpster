import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
} from "@xyflow/react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";

const Display = () => {
  const incomingConnection = useNodeConnections({
    handleId: "in-one",
    handleType: "target",
  });
  const incomingData = useNodesData(incomingConnection?.[0]?.source);

  return (
    <div>
      <Header>Debug-Display</Header>
      <Body>
        <div className="flex gap-2">
          <Handle
            id="in-one"
            type="target"
            position={Position.Left}
            className="!relative !top-3"
          />
          <p>{String(incomingData?.data.value)}</p>
        </div>
      </Body>
    </div>
  );
};

export default Display;
