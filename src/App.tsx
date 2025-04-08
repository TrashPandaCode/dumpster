import { useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  OnNodesChange,
  OnConnect,
  OnEdgesChange,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

function App() {
  const initialNodes: Node[] = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Hello" },
    },
    {
      id: "2",
      position: { x: 100, y: 100 },
      data: { label: "World" },
    },
  ];
  const initialEdges = [{ id: "1-2", source: "1", target: "2" }];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
    },
    [],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (params) => 
      setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <>
      <div className="w-full h-screen">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </>
  );
}

export default App;
