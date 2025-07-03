/*
 * Authors: Philipp Wendt
 *
 * Purpose:
 * This utility function collects all relevant nodes for copy/duplicate operations
 * in a node editor. It ensures that when copying or duplicating nodes, all related
 * nodes are included, such as group members and loop nodes.
 */
import type { Node } from "@xyflow/react";

// Helper function to collect all relevant nodes for copy/duplicate operations
// This ensures consistent behavior between single node and multi-node selections
export function collectRelevantNodes(
  nodeIds: string[],
  allNodes: Node[]
): Node[] {
  const relevantNodes = new Set<Node>();

  nodeIds.forEach((nodeId) => {
    const node = allNodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Always include the node itself
    relevantNodes.add(node);

    // If the node is a group, include all its children
    if (node.type === "Group") {
      const children = allNodes.filter((n) => n.parentId === node.id);
      children.forEach((child) => relevantNodes.add(child));
    }

    // If node is part of a loop, include both start and end nodes + all children
    if (
      node.data &&
      typeof node.data === "object" &&
      "loopId" in node.data &&
      node.data.loopId !== undefined
    ) {
      const loopNodes = allNodes.filter(
        (n) =>
          (n.data &&
            typeof n.data === "object" &&
            "loopId" in n.data &&
            n.data.loopId === node.data.loopId) || // start/end nodes of the same loop
          (n.data &&
            typeof n.data === "object" &&
            "parentLoopId" in n.data &&
            n.data.parentLoopId === node.data.loopId) // children of this loop
      );
      loopNodes.forEach((loopNode) => relevantNodes.add(loopNode));
    }
  });

  return Array.from(relevantNodes);
}
