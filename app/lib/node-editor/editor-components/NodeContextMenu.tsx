import {
  Panel,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
} from "@xyflow/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { nodeTypes } from "../nodes/node-types";

type NodeContextMenuProps = {
  nodeId: string;
  x: number;
  y: number;
  onClose: () => void;
};

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  nodeId,
  x,
  y,
  onClose,
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
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <Panel className="w-65 space-y-2 rounded bg-slate-800 p-2 pt-2 pb-2 shadow-lg outline-1 outline-slate-700 outline-solid">
        <button
          className="w-full rounded p-2 text-left text-sm text-white hover:bg-slate-700"
          onClick={duplicateNode}
        >
          Duplicate
        </button>
        <button
          className="w-full rounded p-2 text-left text-sm text-white hover:bg-slate-700"
          onClick={deleteNode}
        >
          Delete
        </button>
      </Panel>
    </div>
  );
};

export default NodeContextMenu;
