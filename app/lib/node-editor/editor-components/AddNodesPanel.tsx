import { ChevronRightIcon } from "@radix-ui/react-icons";
import {
  Panel,
  useReactFlow,
  type Edge,
  type Node,
  type PanelPosition,
  type XYPosition,
} from "@xyflow/react";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { connectionToEdgeId } from "../node-store/utils";
import { LOOP_CONNECTOR, MAIN_LOOP_CONNECTOR } from "../nodes/constants";
import { TYPES } from "../nodes/math-float/types";
import { searchNodeTypes } from "../nodes/node-types";
import { uuidToColor } from "../utils";

const AddNodesPanel = ({
  x,
  y,
  onClose,
  position,
  parentLoopId,
  children,
}: {
  x: number;
  y: number;
  onClose: () => void;
  position?: PanelPosition;
  parentLoopId?: string;
  children?: React.ReactNode;
}) => {
  const MathFloatComputeTypes = Object.values(TYPES).flat();

  const { addNodes, addEdges, screenToFlowPosition, getNodes } = useReactFlow();
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

    if (nodeSearch === "") return setFilteredTypes(types);

    const mathTypes = MathFloatComputeTypes.filter((type) =>
      type.toLowerCase().includes(nodeSearch.toLowerCase())
    ).map((t) => {
      return { nodeType: "MathFloat", computeType: t };
    });

    const combined = [...types, ...mathTypes];
    setFilteredTypes(combined);
    setSelectedIndex(0);
  }, [nodeSearch]);

  const handleAddNode = (type: string, computeType?: string) => {
    // Create nodes based on type
    const ids =
      type === "ForLoop"
        ? createForLoop(
            addNodes,
            screenToFlowPosition,
            x,
            y,
            addEdges,
            parentLoopId
          )
        : [createSingleNode(type, computeType)];

    // Connect nodes if inside a loop
    if (parentLoopId) {
      connectNodesToLoop(ids, parentLoopId);
    }

    onClose();
  };

  // Helper function to create a single node and return its ID
  const createSingleNode = (type: string, computeType?: string) => {
    const id = uuidv4();
    addNodes({
      id,
      type,
      position: screenToFlowPosition({ x, y }),
      data: {
        initialComputeType: computeType,
        parentLoopId,
      },
    });
    return id;
  };

  // Helper function to connect nodes to loop connectors
  const connectNodesToLoop = (nodeIds: string[], loopId: string) => {
    const loopNodes = getNodes().filter((node) => node.data.loopId === loopId);

    nodeIds.forEach((nodeId) => {
      loopNodes.forEach((loopNode) => {
        const isSource = loopNode.data.loopStart;
        const sourceId = isSource ? loopNode.id : nodeId;
        const targetId = isSource ? nodeId : loopNode.id;
        const sourceHandle = isSource ? MAIN_LOOP_CONNECTOR : LOOP_CONNECTOR;
        const targetHandle = isSource ? LOOP_CONNECTOR : MAIN_LOOP_CONNECTOR;

        const edgeId = connectionToEdgeId({
          source: sourceId,
          sourceHandle,
          target: targetId,
          targetHandle,
        });

        addEdges({
          id: edgeId,
          type: "straight",
          source: sourceId,
          target: targetId,
          sourceHandle,
          targetHandle,
          animated: true,
          selectable: false,
          style: {
            opacity: 0.5,
            strokeWidth: 1,
            stroke: uuidToColor(loopId),
          },
        });
      });
    });
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
    <Panel
      position={position}
      className="flex w-65 flex-col gap-2 rounded bg-slate-800 p-2 font-mono shadow-lg outline-1 outline-slate-700 outline-solid"
    >
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
      {nodeSearch === "" && <>{children}</>}
    </Panel>
  );
};

export default AddNodesPanel;

function createForLoop(
  addNodes: (payload: Node | Node[]) => void,
  screenToFlowPosition: (
    clientPosition: XYPosition,
    options?: {
      snapToGrid: boolean;
    }
  ) => XYPosition,
  x: number,
  y: number,
  addEdges: (payload: Edge | Edge[]) => void,
  parentLoopId?: string
) {
  const startId = uuidv4();
  const endId = uuidv4();
  const loopId = uuidv4();
  const edgeId = connectionToEdgeId({
    source: startId,
    sourceHandle: MAIN_LOOP_CONNECTOR,
    target: endId,
    targetHandle: MAIN_LOOP_CONNECTOR,
  });
  addNodes([
    {
      id: startId,
      type: "ForStart",
      position: screenToFlowPosition({ x, y }),
      data: { loopId, parentLoopId },
    },
    {
      id: endId,
      type: "ForEnd",
      position: screenToFlowPosition({ x: x + 300, y }),
      data: { loopId, parentLoopId },
    },
  ]);
  addEdges({
    id: edgeId,
    type: "straight",
    source: startId,
    target: endId,
    sourceHandle: MAIN_LOOP_CONNECTOR,
    targetHandle: MAIN_LOOP_CONNECTOR,
    animated: true,
    selectable: false,
    style: {
      strokeWidth: 2,
      stroke: uuidToColor(loopId),
    },
  });
  return [startId, endId];
}
