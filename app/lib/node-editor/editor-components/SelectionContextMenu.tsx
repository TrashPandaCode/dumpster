import { Panel, useReactFlow, type Edge, type Node } from "@xyflow/react";
import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { connectionToEdgeId } from "../utils";

type SelectionContextMenuProps = {
  nodeIds: string[];
  x: number;
  y: number;
  onClose: () => void;
};

const SelectionContextMenu: React.FC<SelectionContextMenuProps> = ({
  nodeIds,
  x,
  y,
  onClose,
}) => {
  const { getNodes, getEdges, addNodes, addEdges, setNodes, setEdges } =
    useReactFlow();

  const duplicateNodes = useCallback(() => {
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
        const edgeId = connectionToEdgeId({
          source: newSource,
          sourceHandle: e.sourceHandle!,
          target: newTarget,
          targetHandle: e.targetHandle!,
        });
        return {
          ...e,
          id: edgeId,
          source: newSource,
          target: newTarget,
          selected: false,
        };
      });

    addNodes(newNodes);
    addEdges(newEdges);

    setNodes((nodes) =>
      nodes.map((node) => ({
        ...node,
        selected: newNodes.some((n) => n.id === node.id),
      }))
    );

    onClose();
  }, [nodeIds, getNodes, getEdges, addNodes, addEdges, setNodes, onClose]);

  const deleteNodes = useCallback(() => {
    setNodes((nodes) => nodes.filter((n) => !nodeIds.includes(n.id)));
    setEdges((edges) =>
      edges.filter(
        (e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)
      )
    );
    onClose();
  }, [nodeIds, setNodes, setEdges, onClose]);

  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <Panel className="flex w-55 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={duplicateNodes}
        >
          <span>Duplicate {nodeIds.length} nodes </span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            Ctrl+D
          </span>
        </button>
        <button
          className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
          onClick={deleteNodes}
        >
          <span>Delete {nodeIds.length} nodes </span>
          <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
            Del
          </span>
        </button>
      </Panel>
    </div>
  );
};

export default SelectionContextMenu;
