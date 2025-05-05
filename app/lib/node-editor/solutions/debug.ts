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
    id: "2",
    type: "group",
    position: { x: 0, y: 100 },
    style: { width: 300, height: 400 },
    data: {},
  },
  {
    id: uuidv4(),
    parentId: "2",
    type: "MathFloat",
    position: { x: 0, y: 200 },
    data: { initialComputeType: "Addition" },
  },
  {
    id: uuidv4(),
    parentId: "2",
    type: "Display",
    position: { x: 0, y: 500 },
    data: {},
  },
];

export const debugEdges: Edge[] = [];
