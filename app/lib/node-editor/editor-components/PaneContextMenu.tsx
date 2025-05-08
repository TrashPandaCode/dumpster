import { ChevronRightIcon } from "@radix-ui/react-icons";
import { Panel, useReactFlow } from "@xyflow/react";
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

  const { addNodes, screenToFlowPosition } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  const [nodeSearch, setNodeSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredTypes, setFilteredTypes] = useState<
    { parent: string; nodeType: string; computeType?: string }[]
  >(
    Object.keys(nodeTypes).map((t) => {
      return { parent: "", nodeType: t };
    })
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const types = Object.keys(nodeTypes)
      .filter((type) => type.toLowerCase().includes(nodeSearch.toLowerCase()))
      .map((t) => {
        return { parent: "", nodeType: t };
      });

    if (nodeSearch === "") return setFilteredTypes(types);

    const matchedTypes = MathFloatComputeTypes.filter((type) =>
      type.toLowerCase().includes(nodeSearch.toLowerCase())
    ).map((t) => {
      return { parent: "Math", nodeType: "MathFloat", computeType: t };
    });

    const combined = [...types, ...matchedTypes];
    setFilteredTypes(combined);
    setSelectedIndex(0);
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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredTypes.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredTypes.length) % filteredTypes.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = filteredTypes[selectedIndex];
      if (selected) {
        handleAddNode(selected.nodeType, selected.computeType);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredTypes, selectedIndex]);

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
          />
        </div>

        <div>
          {filteredTypes.map((type, index) => (
            <button
              key={`add_node_${type}_${index}`}
              className={`w-full rounded px-2 py-1 text-left text-sm text-white ${
                selectedIndex === index ? "bg-slate-700" : "hover:bg-slate-700"
              }`}
              onClick={() => handleAddNode(type.nodeType, type.computeType)}
            >
              {type.computeType ? (
                <span>
                  <span className="text-slate-400">{type.nodeType}</span>
                  <ChevronRightIcon className="inline-block h-4 w-4 text-slate-400" />
                  <span className="">{type.computeType}</span>
                </span>
              ) : (
                <>{type.nodeType}</>
              )}
            </button>
          ))}
        </div>
      </Panel>
    </div>
  );
};

export default PaneContextMenu;
