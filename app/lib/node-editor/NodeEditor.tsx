import { Background, Controls, ReactFlow } from "@xyflow/react";
import React from "react";

import Add from "~/lib/node-editor/nodes/math-float/Add";
import Value from "~/lib/node-editor/nodes/math-float/Value";

import "@xyflow/react/dist/style.css";

const NodeEditor = () => {
  const nodes = [
    {
      id: "1",
      type: "Add",
      position: { x: 0, y: 0 },
      data: { label: "" },
    },
  ];
  const nodeTypes = { Value, Add }; // Define your custom node types here
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow nodes={nodes} nodeTypes={nodeTypes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default NodeEditor;
