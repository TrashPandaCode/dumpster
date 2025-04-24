import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import React, { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import AddNodePanel from "./editor-components/AddNode";
import { nodeTypes } from "./nodes/node-types";
import { debugEdges, debugNodes } from "./solutions/debug";

const NodeEditor = () => {
  const [nodes, setNodes] = useState<Node[]>(debugNodes);
  const [edges, setEdges] = useState<Edge[]>(debugEdges);

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

  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background bgColor="#14141d" color="#a7abc2" />
        {/* <Controls className="text-white !bg-slate-800" /> sind kacke zu stylen */}
        <AddNodePanel />
      </ReactFlow>
    </div>
  );
};

export default NodeEditor;
