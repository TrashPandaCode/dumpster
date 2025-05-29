import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

import { useLoopStore } from "../node-store/loop-store";
import { duplicateNodes } from "../utils";
import AddNodes from "./AddNodes";

type NodeContextMenuProps = {
  nodeId: string;
  nodeType: string | undefined;
  nodeLoopId: string | undefined;
  nodeParentId: string | undefined;
  x: number;
  y: number;
  onClose: () => void;
};

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  nodeType,
  nodeLoopId,
  x,
  y,
  onClose,
  nodeParentId,
}) => {
  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      {nodeType === "ForStart" || nodeType === "ForEnd" ? (
        <AddNodes
          onClose={onClose}
          x={x}
          y={y}
          parentLoopId={nodeLoopId}
          parentId={nodeParentId}
        >
          <hr className="mx-auto h-1 w-44 rounded-sm border-0 bg-slate-700" />
          <DefaultNodeContextMenu nodeId={nodeId} onClose={onClose} />
        </AddNodes>
      ) : (
        <div className="flex w-36 flex-col gap-1 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
          <DefaultNodeContextMenu nodeId={nodeId} onClose={onClose} />
        </div>
      )}
    </div>
  );
};

export default NodeContextMenu;

const DefaultNodeContextMenu = ({
  nodeId,
  onClose,
}: {
  nodeId: string;
  onClose: () => void;
}) => {
  const { getNode, getNodes, getEdges, setNodes, setEdges } = useReactFlow();

  // handle node duplication
  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId);
    if (!node) return;

    const nodesToDuplicate = getNodes().filter(
      (n) =>
        n.id === node.id || // always duplicate the node itself
        n.parentId === node.id || // if the node is a group, duplicate all its children
        ((n.data.loopId === node.data.loopId || // if node is part of a loop, duplicate both start and end nodes
          n.data.parentLoopId === node.data.loopId) && // also get all children if its a loop node
          node.data.loopId != undefined) // ensure we are dealing with a loop node
    );

    duplicateNodes(nodesToDuplicate, getEdges, getNodes, setEdges, setNodes);

    onClose();
  }, [getEdges, getNode, getNodes, nodeId, onClose, setEdges, setNodes]);

  const deleteNode = useCallback(() => {
    const idsToDelete = [nodeId];
    if (getNode(nodeId)?.type === "Group") {
      // if the node is a group, delete all its children
      const children = getNodes().filter((n) => n.parentId === nodeId);
      const parent = getNode(nodeId);

      setNodes((nodes) => {
        return nodes.map((node) => {
          if (children.some((child) => child.id === node.id)) {
            return {
              ...node,
              position: {
                x: parent
                  ? node.position.x + parent.position.x
                  : node.position.x,
                y: parent
                  ? node.position.y + parent.position.y
                  : node.position.y,
              },
              parentId: undefined, // remove parentId to ungroup the children
            };
          }
          return node;
        });
      });
    }

    // remove all nodes with the ids in idsToDelete
    setNodes((nodes) => nodes.filter((node) => !idsToDelete.includes(node.id)));
    // remove all edges that connect to the nodes with the ids in idsToDelete
    setEdges((edges) =>
      edges.filter(
        (edge) =>
          !(
            idsToDelete.includes(edge.source) ||
            idsToDelete.includes(edge.target)
          )
      )
    );

    onClose();
  }, [nodeId, getNode, setNodes, setEdges, onClose, getNodes]);

  return (
    <>
      <button
        className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
        onClick={duplicateNode}
      >
        <span>Duplicate</span>
        <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
          Ctrl+D
        </span>
      </button>
      <button
        className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
        onClick={deleteNode}
      >
        <span>Delete</span>
        <span className="ml-2 rounded bg-slate-600 px-1.5 py-0.5 font-mono text-xs text-gray-300">
          Del
        </span>
      </button>
    </>
  );
};
