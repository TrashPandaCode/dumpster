import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import AddNodesPanel from "./AddNodesPanel";

type NodeContextMenuProps = {
  nodeId: string;
  nodeType: string | undefined;
  nodeLoopId: string | undefined;
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
}) => {
  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      {nodeType === "ForStart" || nodeType === "ForEnd" ? (
        <AddNodesPanel onClose={onClose} x={x} y={y} parentLoopId={nodeLoopId}>
          {/* TODO: this of course needs better styling */}
          <DefaultNodeContextMenu nodeId={nodeId} onClose={onClose} />
        </AddNodesPanel>
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
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId);
    if (!node) return;

    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: uuidv4(),
      position,
    });

    onClose();
  }, [nodeId, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
    onClose();
  }, [nodeId, setNodes, setEdges]);

  return (
    <>
      <button
        className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
        onClick={duplicateNode}
      >
        Duplicate
      </button>
      <button
        className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
        onClick={deleteNode}
      >
        Delete
      </button>
    </>
  );
};
