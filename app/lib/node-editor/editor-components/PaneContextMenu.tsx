import {
  Panel,
  useReactFlow,
  useStore,
  type Edge,
  type Node,
} from "@xyflow/react";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { TYPES } from "../nodes/math-float/types";
import { nodeTypes } from "../nodes/node-types";

type PaneContextMenuProps = {
  x: number;
  y: number;
  onClose: () => void;
};

const PaneContextMenu: React.FC<PaneContextMenuProps> = ({ x, y, onClose }) => {
  const MathFloatComputeTypes = Object.values(TYPES).flat();

  const { addNodes } = useReactFlow<Node, Edge>();
  const inputRef = useRef<HTMLInputElement>(null);
  const [nodeSearch, setNodeSearch] = useState("");

  const [offsetX, offsetY, zoom] = useStore((s) => s.transform);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAddNode = (type: string, computeType?: string) => {
    const canvasElement = document.getElementById("node-editor");
    if (!canvasElement) {
      console.error("Canvas element with ID 'node-editor' not found.");
      return;
    }
    const canvasRect = canvasElement.getBoundingClientRect();

    const nodeX = (x - offsetX) / zoom - canvasRect.left / zoom;
    const nodeY = (y - offsetY) / zoom - canvasRect.top / zoom;

    addNodes({
      id: uuidv4(),
      type,
      position: { x: nodeX, y: nodeY },
      data: { initialComputeType: computeType },
    });

    onClose();
  };

  return (
    <div style={{ position: "absolute", top: y, left: x, zIndex: 1000 }}>
      <Panel className="w-65 space-y-2 rounded bg-slate-800 p-2 py-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
        <div className="w-64 pr-4 shadow">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search"
            className="w-full rounded bg-slate-900 p-2 text-sm text-white focus:border-gray-300 focus:ring-0 focus:outline-none"
            onChange={(e) => setNodeSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const filteredTypes = Object.keys(nodeTypes).filter((type) =>
                  type.toLowerCase().includes(nodeSearch.toLowerCase())
                );
                if (filteredTypes.length > 0) {
                  handleAddNode(filteredTypes[0]);
                } else {
                  const matchedType = MathFloatComputeTypes.find((type) =>
                    type.toLowerCase().includes(nodeSearch.toLowerCase())
                  );
                  if (matchedType) {
                    handleAddNode("MathFloat", matchedType);
                  }
                }
              }
            }}
          />
        </div>

        <div>
          {Object.keys(nodeTypes)
            .filter((type) =>
              type.toLowerCase().includes(nodeSearch.toLowerCase())
            )
            .map((type, index) => (
              <button
                key={`add_node_${type}_${index}`}
                className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
                onClick={() => handleAddNode(type)}
              >
                {type}
              </button>
            ))}
        </div>
      </Panel>
    </div>
  );
};

export default PaneContextMenu;
