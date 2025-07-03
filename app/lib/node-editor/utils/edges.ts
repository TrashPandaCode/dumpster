/*
 * Authors: Jonathan Kron
 *
 * Purpose:
 * This code offers a helper function which converts a React Flow edge to an edge id.
 */
import type { Connection } from "@xyflow/react";

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
