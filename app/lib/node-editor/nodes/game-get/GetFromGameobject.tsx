import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";

const GetFromGameobject = memo(({ id }: { id: string }) => {
  const xPos = useDebugStore((state) => state.xpos);
  const yPos = useDebugStore((state) => state.ypos);

  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, { "result-xpos": xPos, "result-ypos": yPos });
  }, [xPos, yPos]);

  return (
    <div className="min-w-48">
      <NodeContent label="XPOS TEST" type="float">
        <LabelHandle id="result-xpos" position={Position.Right} label="XPOS" />
        <LabelHandle id="result-ypos" position={Position.Right} label="YPOS" />
      </NodeContent>
    </div>
  );
});

export default GetFromGameobject;
