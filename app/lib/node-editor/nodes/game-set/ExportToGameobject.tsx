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

  const handles: Map<string, string> = new Map([
    [IN_HANDLE_1, "xpos"],
    [IN_HANDLE_2, "ypos"],
  ]); //TODO: load this level based
  const setXPos = useDebugStore((state) => state.setnew_xpos);
  const setYPos = useDebugStore((state) => state.setnew_ypos);

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
        {Array.from(handles).map(([handle, value]) => (
          <LabelHandle
            key={handle}
            id={handle}
            position={Position.Left}
            label={value}
            isConnectable={
              useNodeConnections({
                handleId: handle,
                handleType: "target",
              }).length < 1
            }
          />
        ))}
      </NodeContent>
    </div>
  );
});

export default ExportToGameobject;
