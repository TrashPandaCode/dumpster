import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useDebugStore } from "~/lib/zustand/debug";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";

const GetFromGameobject = memo(({ id }: { id: string }) => {
  const data = useDebugStore((state) => state.data);
  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        data.forEach(({ handleId, value }) => {
          results.set(handleId, value);
        });
      },
    });
  }, [data]);

  return (
    <div className="min-w-48">
      <NodeContent label="XPOS TEST" type="float">
        {Array.from(data).map(([label, { handleId }]) => (
          <LabelHandle
            key={handleId}
            id={handleId}
            position={Position.Right}
            label={label}
          />
        ))}
      </NodeContent>
    </div>
  );
});

export default GetFromGameobject;
