/*
 * Authors: Leo Kling, Jonathan Kron
 *
 * Purpose: Node editor for the documentation, allowing users to create and manipulate nodes and edges.
 */
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import React, { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import "@xyflow/react/dist/style.css";

import { TooltipProvider } from "~/lib/node-editor/editor-components/Tooltip";
import { createForLoop } from "~/lib/node-editor/utils/loops";
import { docsNodeTypes } from "./nodes/docs-node-types";

const Editor: React.FC<{ type: string }> = ({ type }) => {
  const [nodes, setNodes] = useState<Node[]>(
    type !== "ForLoop"
      ? [
          {
            id: uuidv4(),
            type: type,
            position: { x: 0, y: 0 },
            data: {},
          },
        ]
      : []
  );

  const [edges, setEdges] = useState<Edge[]>([]);
  const { addNodes, addEdges } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );

  useEffect(() => {
    if (type === "ForLoop") {
      const loopBox = createForLoop({ x: 0, y: 0 }, { x: 300, y: 0 });
      addNodes(loopBox.nodes);
      addEdges(loopBox.mainConnectorEdge);
    }
  }, []);

  return (
    <TooltipProvider>
      {/* we need a provider here because we use tooltips in the nodes */}
      <div className="block h-[500px]">
        <ReactFlow
          className="not-prose rounded"
          id="node-editor"
          nodeTypes={docsNodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          disableKeyboardA11y={true}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={[]}
        >
          <Background bgColor="#14141d" color="#a7abc2" />
        </ReactFlow>
      </div>
    </TooltipProvider>
  );
};

const DocsNodeEditor: React.FC<{ type: string }> = ({ type }) => (
  <ReactFlowProvider>
    <Editor type={type} />
  </ReactFlowProvider>
);

export default DocsNodeEditor;
