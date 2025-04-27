import { type Edge, type Node } from "@xyflow/react";

export const debugNodes: Node[] = [
  {
    id: "1",
    type: "GetFromGameobject",
    position: { x: 0, y: 0 },
    data: { value: 0 },
  },
  {
    id: "2",
    type: "Display",
    position: { x: 0, y: 200 },
    data: {},
  },
];

export const debugEdges: Edge[] = [];
