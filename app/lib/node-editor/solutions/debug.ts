import { type Edge, type Node } from "@xyflow/react";

export const debugNodes: Node[] = [
  {
    id: "1",
    type: "Value",
    position: { x: 0, y: 0 },
    data: { value: 0 },
  },
  {
    id: "2",
    type: "MathFloatNode",
    position: { x: 0, y: 200 },
    data: {},
  },
  {
    id: "3",
    type: "ExportToGameobject",
    position: { x: 600, y: 0 },
    data: {},
  },
];

export const debugEdges: Edge[] = [];
