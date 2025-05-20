import {
  
  Background,
  ReactFlow,
  type Node,
  type OnNodesChange,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "@xyflow/react/dist/style.css";

import { TooltipProvider } from "../node-editor/editor-components/Tooltip";
import { nodeTypes } from "../node-editor/nodes/node-types";
import { applyNodeChanges } from "../node-editor/utils";

const DocsNodeEditor: React.FC<{ type: string }> = ({ type }) => {
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: uuidv4(),
      type: type,
      position: { x: 0, y: 0 },
      data: {},
    },
  ]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  return (
    <TooltipProvider>
      {/* we need a provider here because we use tooltips in the nodes */}
      <div className="block h-[500px]">
        <ReactFlow
          className="not-prose rounded"
          id="node-editor"
          nodeTypes={nodeTypes}
          nodes={nodes}
          onNodesChange={onNodesChange}
          disableKeyboardA11y={true}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Delete", "Backspace"]}
        >
          <Background bgColor="#14141d" color="#a7abc2" />
        </ReactFlow>
      </div>
    </TooltipProvider>
  );
};

export default DocsNodeEditor;
