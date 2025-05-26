import { useReactFlow, type Edge, type Node } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { connectionToEdgeId } from "../utils";

export function useNodeActions() {
  const { getNodes, getEdges, setNodes, addNodes, setEdges, addEdges } =
    useReactFlow();

  const duplicateNodes = useCallback(
    (nodeIds: string[]) => {
      const selectedNodes = getNodes().filter((n) => nodeIds.includes(n.id));
      const allEdges = getEdges();

      const idMap = new Map<string, string>();
      const newNodes: Node[] = selectedNodes.map((node) => {
        const newId = uuidv4();
        idMap.set(node.id, newId);
        return {
          ...node,
          id: newId,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          selected: false,
          dragging: false,
        };
      });

      const newEdges: Edge[] = allEdges
        .filter((e) => idMap.has(e.source) && idMap.has(e.target))
        .map((e) => {
          const newSource = idMap.get(e.source)!;
          const newTarget = idMap.get(e.target)!;
          return {
            ...e,
            id: connectionToEdgeId({
              source: newSource,
              sourceHandle: e.sourceHandle!,
              target: newTarget,
              targetHandle: e.targetHandle!,
            }),
            source: newSource,
            target: newTarget,
            selected: false,
          };
        });

      addNodes(newNodes);
      addEdges(newEdges);
      setNodes((nodes) =>
        nodes.map((n) => ({
          ...n,
          selected: newNodes.some((nn) => nn.id === n.id),
        }))
      );
    },
    [getNodes, getEdges, addNodes, addEdges, setNodes]
  );

  const deleteNodes = useCallback(
    (nodeIds: string[]) => {
      setNodes((nodes) => nodes.filter((n) => !nodeIds.includes(n.id)));
      setEdges((edges) =>
        edges.filter(
          (e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
        )
      );
    },
    [setNodes, setEdges]
  );

  return {
    duplicateNodes,
    deleteNodes,
  };
}
