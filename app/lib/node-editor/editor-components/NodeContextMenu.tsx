import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

import { connectNodesToLoop, createForLoop } from "../utils";
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
          <hr className="mx-auto h-1 w-44 rounded-sm border-0 bg-slate-700" />
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
  const { getNode, getNodes, setNodes, addNodes, setEdges, addEdges } =
    useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(nodeId);
    if (!node) return;

    const position = {
      x: node.position.x + 50,
      y: node.position.y + 50,
    };

    if (node.data.loopStart || node.data.loopEnd) {
      createForLoop(addNodes, position.x, position.y, addEdges);
    } else {
      const id = uuidv4();
      addNodes({
        ...node,
        selected: false,
        dragging: false,
        id: id,
        position,
      });
      console.log(node.data.parentLoopId);

      if (node.data.parentLoopId)
        connectNodesToLoop(
          getNodes,
          addEdges,
          [id],
          node.data.parentLoopId as string
        );
    }

    onClose();
  }, [getNode, nodeId, onClose, addNodes, addEdges, getNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));
    onClose();
  }, [setNodes, setEdges, onClose, nodeId]);

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
