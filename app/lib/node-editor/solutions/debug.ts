import { type Edge, type Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

export const debugNodes: Node[] = [
  {
    id: uuidv4(),
    type: "Value",
    position: { x: 0, y: 0 },
    data: { value: 0 },
  },
  {
    id: uuidv4(),
    type: "MathFloatNode",
    position: { x: 0, y: 200 },
    data: {},
  },
];

export const debugEdges: Edge[] = [];
