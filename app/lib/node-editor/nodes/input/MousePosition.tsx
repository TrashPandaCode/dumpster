import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useMouseStore } from "~/lib/zustand/mouse";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeData, nodeInputs } from "../../node-store/node-store";
import { OUT_HANDLE_1, OUT_HANDLE_2 } from "../constants";

const MousePosition = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();

  const getMousePos = useMouseStore((state) => state.getMousePos);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeData) => {
        const mousePos = getMousePos();
        results.set(OUT_HANDLE_1, mousePos.x);
        results.set(OUT_HANDLE_2, mousePos.y);
      },
    });
  }, []);

  return (
    <div className="min-w-48">
      <NodeContent label="Mouse Position" type="input" docsName="mousepos">
        <LabelHandle id={OUT_HANDLE_1} position={Position.Right} label="x" />
        <LabelHandle id={OUT_HANDLE_2} position={Position.Right} label="y" />
      </NodeContent>
    </div>
  );
});

export default MousePosition;
