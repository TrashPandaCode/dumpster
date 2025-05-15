import { type Edge, type Node } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

import { LOOP_CONNECTOR_IN, LOOP_CONNECTOR_OUT } from "../nodes/constants";

const FORSTART = uuidv4();
const FOREND = uuidv4();

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
    id: FORSTART,
    type: "ForStart",
    position: { x: 0, y: 0 },
    data: { loopId: 1 }, // the end node woudle have to have the same loop id, this needs to be inforced from the add menus as well
  },
  {
    id: FOREND,
    type: "ForEnd",
    position: { x: 300, y: 0 },
    data: { loopId: 1 }, // the end node woudle have to have the same loop id, this needs to be inforced from the add menus as well
  },
];

export const debugEdges: Edge[] = [
  {
    id: "loop-1-edge",
    type: "straight",
    source: FORSTART,
    target: FOREND,
    sourceHandle: LOOP_CONNECTOR_OUT,
    targetHandle: LOOP_CONNECTOR_IN,
    animated: true,
    deletable: false,
    selectable: false,
    style: {
      strokeWidth: 2,
      stroke: "var(--color-emerald-300)",
    },
  },
];
