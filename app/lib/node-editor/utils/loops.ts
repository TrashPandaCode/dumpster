/*
 * Authors: Jonathan Kron, Milan Jezovsek
 *
 * Purpose:
 * This code offers helper functions to create for loops and connect nodes to for loops.
 */
import type { Edge, Node, XYPosition } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

import { LOOP_CONNECTOR, MAIN_LOOP_CONNECTOR } from "../nodes/constants";
import { uuidToColor } from "./colors";
import { connectionToEdgeId } from "./edges";

export function createForLoop(
  startPos: XYPosition,
  endPos: XYPosition,
  parentLoopId?: string,
  startParentId?: string,
  endParentId?: string
) {
  const startId = uuidv4();
  const endId = uuidv4();
  const loopId = uuidv4();
  const edgeId = connectionToEdgeId({
    source: startId,
    sourceHandle: MAIN_LOOP_CONNECTOR,
    target: endId,
    targetHandle: MAIN_LOOP_CONNECTOR,
  });

  return {
    id: loopId,
    startId,
    endId,
    nodes: [
      {
        id: startId,
        type: "ForStart",
        parentId: startParentId,
        position: startPos,
        data: { loopId, parentLoopId, loopStart: true, loopEnd: false },
        selectable: true,
        selected: false,
        draggable: true,
        dragging: false,
      },
      {
        id: endId,
        type: "ForEnd",
        parentId: endParentId ?? startParentId, // fallback to startParentId if endParentId is not provided
        position: endPos,
        data: { loopId, parentLoopId, loopStart: false, loopEnd: true },
        selectable: true,
        selected: false,
        draggable: true,
        dragging: false,
      },
    ],
    mainConnectorEdge: {
      id: edgeId,
      type: "straight",
      source: startId,
      target: endId,
      sourceHandle: MAIN_LOOP_CONNECTOR,
      targetHandle: MAIN_LOOP_CONNECTOR,
      animated: true,
      selectable: false,
      style: {
        strokeWidth: 2,
        stroke: uuidToColor(loopId),
      },
    },
  } as {
    id: string;
    startId: string;
    endId: string;
    nodes: Node[];
    mainConnectorEdge: Edge;
  };
}

// Helper function to connect nodes to loop connectors
export function connectNodesToLoop(parentNodes: Node[], nodeIds: string[]) {
  const newEdges: Edge[] = [];
  nodeIds.forEach((nodeId) => {
    parentNodes.forEach((parentNode) => {
      const isSource = parentNode.data.loopStart;
      const sourceId = isSource ? parentNode.id : nodeId;
      const targetId = isSource ? nodeId : parentNode.id;
      const sourceHandle = isSource ? MAIN_LOOP_CONNECTOR : LOOP_CONNECTOR;
      const targetHandle = isSource ? LOOP_CONNECTOR : MAIN_LOOP_CONNECTOR;

      const edgeId = connectionToEdgeId({
        source: sourceId,
        sourceHandle,
        target: targetId,
        targetHandle,
      });

      newEdges.push({
        id: edgeId,
        type: "straight",
        source: sourceId,
        target: targetId,
        sourceHandle,
        targetHandle,
        animated: true,
        selectable: false,
        style: {
          opacity: 0.5,
          strokeWidth: 1,
          stroke: uuidToColor(parentNode.data.loopId! as string),
        },
      });
    });
  });
  return newEdges;
}
