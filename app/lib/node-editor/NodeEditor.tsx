import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  ReactFlow,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { useCallback, useState } from "react";

import "@xyflow/react/dist/style.css";

import AddNodePanel from "./editor-components/AddNode";
import { useNodeStore } from "./node-store/node-store";
import { nodeTypes } from "./nodes/node-types";
import { debugEdges, debugNodes } from "./solutions/debug";

const NodeEditor = () => {
  const [nodes, setNodes] = useState<Node[]>(debugNodes);
  const [edges, setEdges] = useState<Edge[]>(debugEdges);

  const replaceNode = useNodeStore((state) => state.replaceNode);
  const removeNode = useNodeStore((state) => state.removeNode);
  const addEdgeStore = useNodeStore((state) => state.addEdge);
  const removeEdge = useNodeStore((state) => state.removeEdge);
  const nodeStateDebugPrint = useNodeStore((state) => state.debugPrint);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((element) => {
        switch (element.type) {
          case "add":
            break;
          case "remove":
            removeNode(element.id);
            break;
          case "replace":
            replaceNode(element.item);
            break;
        }
      });

      setNodes((nds) => applyNodeChanges(changes, nds));
    },
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((element) => {
        switch (element.type) {
          case "remove":
            removeEdge(element.id);
            break;
        }
      });

      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => {
      addEdgeStore(connection);
      setEdges((eds) => addEdge(connection, eds));
    },
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
        deleteKeyCode={["Delete", "Backspace"]}
      >
        <Background bgColor="#14141d" color="#a7abc2" />
        {/* <Controls className="text-white !bg-slate-800" /> sind kacke zu stylen */}
        <AddNodePanel />
        <Panel position="top-right">
          <button onClick={nodeStateDebugPrint} className="bg-white p-2">
            Print Map
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default NodeEditor;
