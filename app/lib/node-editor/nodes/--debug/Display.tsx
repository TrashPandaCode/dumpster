import {
  Handle,
  Position,
  useNodeConnections,
  useNodesData,
} from "@xyflow/react";
import { memo } from "react";

import Body from "../../node-components/Body";
import Header from "../../node-components/Header";
import LabelHandle from "../../node-components/LabelHandle";

const Display = memo(() => {
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
          <LabelHandle id="in-one" position={Position.Left} />
          <p>{String(incomingData?.data.value)}</p>
        </div>
      </Body>
    </div>
  );
});

export default Display;
