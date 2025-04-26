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
    type: "Add",
    position: { x: 0, y: 200 },
    data: {},
  },
  {
    id: "3",
    type: "Display",
    position: { x: 0, y: 500 },
    data: {},
  },
  {
    id: "4",
    type: "KeyPress",
    position: { x: 200, y: 0 },
    data: {},
  },
  {
    id: "5",
    type: "Multiply",
    position: { x: 300, y: 200 },
    data: {},
  },
  {
    id: "6",
    type: "MathFloatNode",
    position: { x: 200, y: 500 },
    data: {},
  },
];

export const debugEdges: Edge[] = [];
