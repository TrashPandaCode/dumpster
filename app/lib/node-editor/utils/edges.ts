/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This code offers a helper function which converts a React Flow edge to an edge id.
 */
import type { Connection } from "@xyflow/react";

/**
 * Converts a React Flow edge to an edge id.
 * The edge id is a string that uniquely identifies the edge based on its source and target nodes and handles.
 *
 * @param edge - The React Flow edge to convert.
 * @returns A string representing the edge id.
 */
export function connectionToEdgeId(edge: Connection): string {
  return (
    "xy-edge__" +
    edge.source +
    edge.sourceHandle +
    "-" +
    edge.target +
    edge.targetHandle
  );
}
