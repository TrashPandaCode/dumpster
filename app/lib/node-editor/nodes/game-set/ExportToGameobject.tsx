import { Position, useNodeConnections, useNodesData } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";

const ExportToGameobject = memo(() => {
  const setXPos = useDebugStore((state) => state.setxpos);
  const setYPos = useDebugStore((state) => state.setypos);

  const xConnection = useNodeConnections({
    handleId: "x-handle",
    handleType: "target",
  });
  const xData = useNodesData(xConnection[0]?.source);

  const yConnection = useNodeConnections({
    handleId: "y-handle",
    handleType: "target",
  });
  const yData = useNodesData(yConnection[0]?.source);

  useEffect(() => {
    const x = Number(xData?.data.value);
    const y = Number(yData?.data.value);
    setXPos(!isNaN(x) ? x : 0);
    setYPos(!isNaN(y) ? y : 0);
  }, [xData, yData]);

  return (
    <div>
      <NodeContent label="Export To Gameobject" type="export">
        <LabelHandle
          id="x-handle"
          position={Position.Left}
          label="x position"
          isConnectable={xConnection.length < 1}
        />
        <LabelHandle
          id="y-handle"
          position={Position.Left}
          label="y position"
          isConnectable={yConnection.length < 1}
        />
      </NodeContent>
    </div>
  );
});

export default ExportToGameobject;
