import { type Edge, type Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

export const debugNodes: Node[] = [
  // {
  //   id: uuidv4(),
  //   type: "Value",
  //   position: { x: 0, y: 0 },
  //   data: {},
  // },
  // {
  //   id: uuidv4(),
  //   type: "MathFloat",
  //   position: { x: 0, y: 200 },
  //   data: { initialComputeType: "Addition" },
  // },
  // {
  //   id: uuidv4(),
  //   type: "Display",
  //   position: { x: 0, y: 500 },
  //   data: {},
  // },
  {
    id: uuidv4(),
    type: "ForStart",
    position: { x: 0, y: 0 },
    data: { loopId: 1 }, // the end node woudle have to have the same loop id, this needs to be inforced from the add menus as well
  },
  {
    id: uuidv4(),
    type: "ForEnd",
    position: { x: 300, y: 0 },
    data: { loopId: 1 }, // the end node woudle have to have the same loop id, this needs to be inforced from the add menus as well
  },
];

export const debugEdges: Edge[] = [];
