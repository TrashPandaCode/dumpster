import {
  Panel,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
} from "@xyflow/react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

import { nodeTypes } from "../nodes/node-types";

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { addNodes } = useReactFlow<Node, Edge>();

  const [offsetX, offsetY, zoom] = useStore((s) => s.transform);
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);

  const handleAddNode = (type: string) => {
    const canvasElement = document.getElementById("node-editor");
    if (!canvasElement) {
      console.error("Canvas element with ID 'node-editor' not found.");
      return;
    }
    const canvasRect = canvasElement?.getBoundingClientRect();

    const nodeX = (x - offsetX) / zoom - canvasRect.left / zoom;
    const nodeY = (y - offsetY) / zoom - canvasRect.top / zoom;

    addNodes([
      {
        id: uuidv4(),
        type,
        position: { x: nodeX, y: nodeY },
        data: {},
      },
    ]);

    onClose();
  };

  return (
    <div
      style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}
      onClick={onClose}
    >
      <Panel className="space-y-2 rounded bg-slate-800 p-2 shadow-lg">
        {Object.keys(nodeTypes).map((type, index) => (
          <button
            key={`add_node_${type}_${index}`}
            className="w-full rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
            onClick={() => handleAddNode(type)}
          >
            {type}
          </button>
        ))}
      </Panel>
    </div>
  );
};

export default ContextMenu;
