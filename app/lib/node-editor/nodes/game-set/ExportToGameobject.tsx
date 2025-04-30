import { Position, useNodeConnections, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { getInput } from "../../node-store/utils";
import { IN_HANDLE_1, IN_HANDLE_2 } from "../constants";

const ExportToGameobject = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();
  const setXPos = useDebugStore((state) => state.setnew_xpos);
  const setYPos = useDebugStore((state) => state.setnew_ypos);

  const xConnection = useNodeConnections({
    handleId: IN_HANDLE_1,
    handleType: "target",
  });

  const yConnection = useNodeConnections({
    handleId: IN_HANDLE_2,
    handleType: "target",
  });

  useEffect(() => {
    updateNodeData(id, {
      compute: (inputs: nodeInputs, _: nodeData) => {
        setXPos(getInput(inputs, IN_HANDLE_1, 0));
        setYPos(getInput(inputs, IN_HANDLE_2, 0));
      },
    });
  }, []);

  return (
    <div>
      <NodeContent label="Export To Gameobject" type="export">
        <LabelHandle
          id={IN_HANDLE_1}
          position={Position.Left}
          label="x position"
          isConnectable={xConnection.length < 1}
        />
        <LabelHandle
          id={IN_HANDLE_2}
          position={Position.Left}
          label="y position"
          isConnectable={yConnection.length < 1}
        />
      </NodeContent>
    </div>
  );
});

export default ExportToGameobject;
