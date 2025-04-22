import { Background, Controls, ReactFlow } from "@xyflow/react";
import React from "react";

import Add from "~/lib/node-editor/nodes/math-float/Add";
import Value from "~/lib/node-editor/nodes/math-float/Value";

import "@xyflow/react/dist/style.css";

import { nodeTypes } from "./nodes/node-types";
import { debugNodes } from "./solutions/debug";

const NodeEditor = () => {
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow nodes={debugNodes} nodeTypes={nodeTypes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default NodeEditor;
