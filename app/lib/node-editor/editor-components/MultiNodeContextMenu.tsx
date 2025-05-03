import { Panel, useReactFlow, type Edge, type Node } from "@xyflow/react";
import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

type MultiNodeContextMenuProps = {
  nodeIds: string[];
  x: number;
  y: number;
  onClose: () => void;
};

const MultiNodeContextMenu: React.FC<MultiNodeContextMenuProps> = ({
  nodeIds,
  x,
  y,
  onClose,
}) => {
  const {
    getNode,
    getNodes,
    getEdges,
    addNodes,
    addEdges,
    setNodes,
    setEdges,
  } = useReactFlow();

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
        selected: true,
        dragging: false,
      };
    });

    const newEdges: Edge[] = allEdges
      .filter((e) => idMap.has(e.source) && idMap.has(e.target))
      .map((e) => ({
        ...e,
        id: uuidv4(),
        source: idMap.get(e.source)!,
        target: idMap.get(e.target)!,
        selected: false,
      }));

    addNodes(newNodes);
    addEdges(newEdges);

    // Neue Nodes selektieren
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
      <Panel
        className="w-65 space-y-2 rounded bg-slate-800 p-2 shadow-lg"
        onClick={onClose}
      >
        <button
          className="w-full rounded p-2 text-left text-sm text-white hover:bg-slate-700"
          onClick={duplicateNodes}
        >
          Duplicate {nodeIds.length} nodes
        </button>
        <button
          className="w-full rounded p-2 text-left text-sm text-white hover:bg-slate-700"
          onClick={deleteNodes}
        >
          Delete {nodeIds.length} nodes
        </button>
      </Panel>
    </div>
  );
};

export default MultiNodeContextMenu;
