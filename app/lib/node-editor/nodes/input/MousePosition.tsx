import { Position, useReactFlow } from "@xyflow/react";
import { memo, useEffect } from "react";

import { useMouseStore } from "~/lib/zustand/mouse";
import LabelHandle from "../../node-components/LabelHandle";
import NodeContent from "../../node-components/NodeContent";
import type { nodeInputs, nodeResults } from "../../node-store/node-store";
import { OUT_HANDLE_1, OUT_HANDLE_2 } from "../constants";

/**
 * React component representing an input node that outputs the current mouse position in the game canvas.
 *
 * - Fetches the current mouse position in the game canvas using the `useMouseStore` Zustand store.
 * - Outputs the x and y coordinates of the mouse.
 *
 * Props:
 * @param {string} id - Unique identifier for this node.
 *
 * React Flow:
 * - Registers a compute function on mount via `updateNodeData`.
 * - This compute function sets the current mouse position into the outputs.
 *
 * Output Handles:
 * - `OUT_HANDLE_1` — x coordinate of the mouse.
 * - `OUT_HANDLE_2` — y coordinate of the mouse.
 *
 * UI:
 * - Displays a labeled node with two output handles (x and y).
 */
const MousePosition = memo(({ id }: { id: string }) => {
  const { updateNodeData } = useReactFlow();

  const getMousePos = useMouseStore((state) => state.getMousePos);

  useEffect(() => {
    updateNodeData(id, {
      compute: (_: nodeInputs, results: nodeResults) => {
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
