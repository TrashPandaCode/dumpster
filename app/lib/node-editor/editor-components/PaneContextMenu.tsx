import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Panel, useReactFlow, type Edge, type Node } from "@xyflow/react";
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

  const { screenToFlowPosition } = useReactFlow();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const [filteredTypes, setFilteredTypes] = useState<
    { parent: string; data: string; computeType?: string }[]
  >(
    Object.keys(nodeTypes).map((t) => {
      return { parent: "", data: t };
    })
  );
  useEffect(() => {
    const types = Object.keys(nodeTypes)
      .filter((type) => type.toLowerCase().includes(nodeSearch.toLowerCase()))
      .map((t) => {
        return { parent: "", data: t };
      });

    if (nodeSearch === "") return setFilteredTypes(types);

    const matchedTypes = MathFloatComputeTypes.filter((type) =>
      type.toLowerCase().includes(nodeSearch.toLowerCase())
    ).map((t) => {
      return { parent: "Math", data: "MathFloat", computeType: t };
    });

    setFilteredTypes([...types, ...matchedTypes]);
  }, [nodeSearch]);

  const handleAddNode = (type: string, computeType?: string) => {
    addNodes({
      id: uuidv4(),
      type,
      position: screenToFlowPosition({ x, y }),
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
            spellCheck="false"
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
          {filteredTypes.map((type, index) => (
            <button
              key={`add_node_${type}_${index}`}
              className="w-full rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-700"
              onClick={() => handleAddNode(type.data, type.computeType)}
            >
              {type.computeType ? (
                <span>
                  <span className="text-slate-400">{type.data}</span>
                  <ChevronRightIcon className="inline-block h-4 w-4" />
                  <span className="">{type.computeType}</span>
                </span>
              ) : (
                <>{type.data}</>
              )}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
};

export default PaneContextMenu;
