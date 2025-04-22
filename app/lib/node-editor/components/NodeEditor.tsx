import { Background, Controls, ReactFlow } from "@xyflow/react";
import React from "react";

import "@xyflow/react/dist/style.css";

const NodeEditor = () => {
  const nodes = [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Hello" },
    },
  ];
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow nodes={nodes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default NodeEditor;
