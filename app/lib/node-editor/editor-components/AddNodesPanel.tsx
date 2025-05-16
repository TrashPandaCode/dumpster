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

import { connectionToEdgeId } from "../node-store/node-store";
import { LOOP_CONNECTOR, MAIN_LOOP_CONNECTOR } from "../nodes/constants";
import { TYPES } from "../nodes/math-float/types";
import { searchNodeTypes } from "../nodes/node-types";

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
    // TODO: this can be simplified a lot more!
    if (parentLoopId) {
      let ids = [];
      if (type === "ForLoop") {
        const { startId, endId } = createForLoop(
          addNodes,
          screenToFlowPosition,
          x,
          y,
          addEdges,
          parentLoopId
        );
        ids = [startId, endId];
      } else {
        const id = uuidv4();
        addNodes({
          id,
          type,
          position: screenToFlowPosition({ x, y }),
          data: { initialComputeType: computeType, parentLoopId },
        });
        ids = [id];
      }
      const loopNodes = getNodes().filter(
        (node) => node.data.loopId === parentLoopId
      );

      ids.forEach((id) => {
        loopNodes.forEach((node) => {
          const edgeId = connectionToEdgeId({
            source: node.data.loopStart ? node.id : id,
            sourceHandle: node.data.loopStart
              ? MAIN_LOOP_CONNECTOR
              : LOOP_CONNECTOR,
            target: node.data.loopStart ? id : node.id,
            targetHandle: node.data.loopStart
              ? LOOP_CONNECTOR
              : MAIN_LOOP_CONNECTOR,
          });
          addEdges({
            id: edgeId,
            type: "straight",
            source: node.data.loopStart ? node.id : id,
            target: node.data.loopStart ? id : node.id,
            sourceHandle: node.data.loopStart
              ? MAIN_LOOP_CONNECTOR
              : LOOP_CONNECTOR,
            targetHandle: node.data.loopStart
              ? LOOP_CONNECTOR
              : MAIN_LOOP_CONNECTOR,
            animated: true,
            deletable: false,
            selectable: false,
            style: {
              opacity: 0.5,
              strokeWidth: 1,
              stroke: uuidToColor(parentLoopId),
            },
          });
        });
      });
    } else if (type === "ForLoop") {
      createForLoop(addNodes, screenToFlowPosition, x, y, addEdges);
    } else {
      addNodes({
        id: uuidv4(),
        type,
        position: screenToFlowPosition({ x, y }),
        data: { initialComputeType: computeType },
      });
    }

    onClose();
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
      {children}
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
    deletable: false,
    selectable: false,
    style: {
      strokeWidth: 2,
      stroke: uuidToColor(loopId),
    },
  });
  return { startId, endId };
}

/**
 * Converts a UUID string to a CSS color optimized for visibility against a dark blue background
 * @param {string} uuid - The UUID to convert (e.g. "123e4567-e89b-12d3-a456-426614174000")
 * @param {string} format - The output format: "hex" (default), "rgb", or "hsl"
 * @returns {string} - A CSS color string in the specified format
 */
function uuidToColor(uuid: string, format = "hex") {
  // Remove dashes and non-hex characters from UUID
  const cleanUuid = uuid.replace(/[^a-f0-9]/gi, "");

  // Handle invalid UUID input
  if (cleanUuid.length < 6) {
    throw new Error("Invalid UUID format");
  }

  // Generate a hue value from the first 4 chars (0-360)
  const hueValue = parseInt(cleanUuid.substring(0, 4), 16) % 360;

  // For dark blue backgrounds, avoid blue hues (200-250),
  // increase lightness and saturation for better contrast
  let adjustedHue = hueValue;
  let saturation = 85; // Higher saturation for more vibrant colors
  let lightness = 65; // Brighter for better visibility on dark background

  // Adjust colors in the blue range to avoid blending with the dark blue background
  if (adjustedHue >= 200 && adjustedHue <= 250) {
    // Shift blues to either cyan or purple
    adjustedHue =
      adjustedHue < 225
        ? adjustedHue - 40 // Shift toward cyan
        : adjustedHue + 40; // Shift toward purple
  }

  // For colors similar to blue, boost lightness even more
  if (
    (adjustedHue >= 170 && adjustedHue <= 270) ||
    adjustedHue >= 330 ||
    adjustedHue <= 30
  ) {
    lightness = 70; // Increase lightness for colors that might get lost on dark blue
  }

  // Generate the color in HSL first
  const r = hslToRgb(adjustedHue / 360, saturation / 100, lightness / 100);

  // Format based on preference
  if (format === "hsl") {
    return `hsl(${adjustedHue}, ${saturation}%, ${lightness}%)`;
  } else if (format === "rgb") {
    return `rgb(${r[0]}, ${r[1]}, ${r[2]})`;
  } else {
    // Default: hex
    return rgbToHex(r[0], r[1], r[2]);
  }
}

/**
 * Convert HSL color values to RGB
 * @param {number} h - Hue (0 to 1)
 * @param {number} s - Saturation (0 to 1)
 * @param {number} l - Lightness (0 to 1)
 * @returns {array} - RGB values as [r, g, b] (0-255)
 */
function hslToRgb(h: number, s: number, l: number) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Convert RGB values to a hex color string
 * @param {number} r - Red (0-255)
 * @param {number} g - Green (0-255)
 * @param {number} b - Blue (0-255)
 * @returns {string} - Hex color string (e.g., "#ff9900")
 */
function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
