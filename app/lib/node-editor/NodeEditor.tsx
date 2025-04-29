import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import AddNodePanel from "./editor-components/AddNode";
import ContextMenu from "./editor-components/ContextMenu";
import { nodeTypes } from "./nodes/node-types";
import { debugEdges, debugNodes } from "./solutions/debug";

const NodeEditor = () => {
  const [nodes, setNodes] = useState<Node[]>(debugNodes);
  const [edges, setEdges] = useState<Edge[]>(debugEdges);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const handlePaneContextMenu = (event: MouseEvent | React.MouseEvent) => {
    event.preventDefault();
    setContextMenu({
      x: (event as React.MouseEvent).clientX,
      y: (event as React.MouseEvent).clientY,
    });
  };
  const handleClick = () => {
    setContextMenu(null);
  };

  return (
    <div style={{ height: "100%" }} onClick={handleClick}>
      <ReactFlowProvider>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onPaneContextMenu={handlePaneContextMenu}
          onConnect={onConnect}
          fitView
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Delete", "Backspace"]}
        >
          <Background bgColor="#14141d" color="#a7abc2" />
          {/* <Controls className="text-white !bg-slate-800" /> sind kacke zu stylen */}
          <AddNodePanel />
        </ReactFlow>
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
          />
        )}
      </ReactFlowProvider>
    </div>
  );
};

export default NodeEditor;
