import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  useReactFlow,
  type Edge,
  type Node,
  type XYPosition,
} from "@xyflow/react";
import classnames from "classnames";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { LEVELS } from "~/lib/game/core/levels";
import { useGameStore } from "~/lib/zustand/game";
import { INITIAL_GROUP_SIZE } from "../nodes/constants";
import { TYPES } from "../nodes/math-float/types";
import { connectNodesToLoop, createForLoop } from "../utils/loops";

import { useTelemetryStore } from "~/lib/zustand/telemetry";

const AddNodes = ({
  x,
  y,
  onClose,
  parentLoopId,
  children,
  parentId,
}: {
  x: number;
  y: number;
  onClose: () => void;
  parentLoopId?: string;
  children?: React.ReactNode;
  parentId?: string;
}) => {
  const logNodeTelemetry = useTelemetryStore((state) => state.logNode);
  
  const level = useGameStore((state) => state.currentLevel);
  const searchNodeTypes = LEVELS[level].availableNodes;

  const MathComputeTypes = Object.values(TYPES).flat();

  const { addNodes, addEdges, screenToFlowPosition, getNodes, getNode } =
    useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  const [nodeSearch, setNodeSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [filteredTypes, setFilteredTypes] = useState<
    { nodeType: string; computeType?: string }[]
  >(
    searchNodeTypes.map((t) => {
      return { nodeType: t };
    })
  );

  const parentNode = getNode(parentId ?? "");

  // focus the input field when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // filter node types based on search input
  // if the search input is empty, only show node types
  // if the search input is not empty, include math sub-types as well
  useEffect(() => {
    const types = searchNodeTypes
      .filter((type) => type.toLowerCase().includes(nodeSearch.toLowerCase()))
      .map((t) => {
        return { nodeType: t };
      });

    if (nodeSearch === "" || !searchNodeTypes.some((type) => type === "Math"))
      return setFilteredTypes(types);

    const mathTypes = MathComputeTypes.filter((type) =>
      type.toLowerCase().includes(nodeSearch.toLowerCase())
    ).map((t) => {
      return { nodeType: "Math", computeType: t };
    });

    const combined = [...types, ...mathTypes];
    setFilteredTypes(combined);
    setSelectedIndex(0);
  }, [nodeSearch]);

  const handleAddNode = (type: string, computeType?: string) => {
    const sFPosition = screenToFlowPosition({
      x,
      y,
    });

    const startPos: XYPosition = {
      x: parentNode ? sFPosition.x - parentNode.position.x : sFPosition.x,
      y: parentNode ? sFPosition.y - parentNode.position.y : sFPosition.y,
    };

    const endPos: XYPosition = {
      x: parentNode
        ? sFPosition.x - parentNode.position.x + 300
        : sFPosition.x + 300,
      y: parentNode ? sFPosition.y - parentNode.position.y : sFPosition.y,
    };

    // Create nodes and edges based on type
    const newEdges: Edge[] = [];
    const newNodes: Node[] = [];
    if (type === "ForLoop") {
      const loopBox = createForLoop(startPos, endPos, parentLoopId, parentId);

      newEdges.push(loopBox.mainConnectorEdge);
      newNodes.push(...loopBox.nodes);
    } else newNodes.push(createSingleNode(type, computeType));

    addNodes(newNodes);

    // Connect nodes if inside a loop
    if (parentLoopId) {
      const parentLoop = getNodes().filter(
        (n) => n.data.loopId === parentLoopId
      );
      newEdges.push(
        ...connectNodesToLoop(
          parentLoop,
          newNodes.map((n) => n.id)
        )
      );
    }
    addEdges(newEdges);

    // Log node in Telemetry
    logNodeTelemetry(type);

    onClose();
  };

  // Helper function to create a single node and return it
  const createSingleNode = (type: string, computeType?: string) => {
    const id = uuidv4();
    const sFPosition = screenToFlowPosition({
      x,
      y,
    });
    const position = {
      x: parentNode ? sFPosition.x - parentNode.position.x : sFPosition.x,
      y: parentNode ? sFPosition.y - parentNode.position.y : sFPosition.y,
    };

    return {
      id,
      type,
      position: position,
      parentId,
      data: {
        initialComputeType: computeType,
        parentLoopId,
      },
      height: type === "Group" ? INITIAL_GROUP_SIZE.height : undefined,
      width: type === "Group" ? INITIAL_GROUP_SIZE.width : undefined,
      selected: false,
      dragging: false,
    } as Node;
  };

  // handle keyboard navigation
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

  // attach event listener to the window to handle keyboard navigation
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredTypes, selectedIndex]);

  return (
    <div className="flex w-65 flex-col gap-2 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid">
      <div className="shadow">
        <input
          ref={inputRef}
          type="text"
          spellCheck="false"
          placeholder="Search"
          className="w-full rounded bg-slate-900 p-2 text-sm text-white focus:border-gray-300 focus:ring-0 focus:outline-none"
          onChange={(e) => setNodeSearch(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1">
        {filteredTypes.map((type, index) => (
          <button
            key={`add_node_${type}_${index}`}
            className={classnames(
              "w-full cursor-pointer rounded px-2 py-1 text-left text-sm text-white",
              selectedIndex === index ? "bg-slate-700" : "hover:bg-slate-700"
            )}
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
      {nodeSearch === "" && <>{children}</>}
    </div>
  );
};

export default AddNodes;
