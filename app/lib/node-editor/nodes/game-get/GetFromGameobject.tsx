import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1, OUT_HANDLE_2 } from "../constants";

const GetFromGameobject = memo(({ id }: { id: string }) => {
  const xPos = useDebugStore((state) => state.xpos);
  const yPos = useDebugStore((state) => state.ypos);

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        results.set(OUT_HANDLE_1, xPos);
        results.set(OUT_HANDLE_2, yPos);
      },
    });
  }, [xPos, yPos]);

  return (
    <div className="min-w-48">
      <NodeContent label="XPOS TEST" type="float">
        <LabelHandle id={OUT_HANDLE_1} position={Position.Right} label="XPOS" />
        <LabelHandle id={OUT_HANDLE_2} position={Position.Right} label="YPOS" />
      </NodeContent>
    </div>
  );
});

export default GetFromGameobject;
