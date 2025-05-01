import {
  Panel,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
} from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { nodeTypes } from "../nodes/node-types";

type ContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose }) => {
  const { addNodes } = useReactFlow<Node, Edge>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [nodeSearch, setNodeSearch] = useState("");

  const [offsetX, offsetY, zoom] = useStore((s) => s.transform);
  const width = useStore((s) => s.width);
  const height = useStore((s) => s.height);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      <Panel className="space-y-2 rounded bg-slate-800 p-2 shadow-lg pt-2 pb-2 w-65 outline-1 outline-solid outline-slate-700">
        <div className="pr-4 shadow w-64 ">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className="p-2 w-full rounded bg-slate-900 text-white text-sm focus:outline-none focus:ring-0 focus:border-gray-300"
          onChange={(e) => setNodeSearch(e.target.value)}
          />
        </div>
        {nodeSearch.trim() === "" && (
          <div>
            {Object.keys(nodeTypes).map((type, index) => (
              <button
                key={`add_node_${type}_${index}`}
                className="w-full rounded text-sm text-white text-left hover:bg-slate-700 pl-2 pr-4"
                onClick={() => handleAddNode(type)}
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default ContextMenu;
