import type {
  Connection,
  Edge,
  Node,
  NodeChange,
  XYPosition,
} from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";

import type { nodeInputs } from "./node-store/node-store";
import { LOOP_CONNECTOR, MAIN_LOOP_CONNECTOR } from "./nodes/constants";

/*
 * This function applies changes to nodes or edges that are triggered by React Flow internally.
 * When you drag a node for example, React Flow will send a position change update.
 * This function then applies the changes and returns the updated elements.
 */
function applyChanges(changes: any[], elements: any[]): any[] {
  const updatedElements: any[] = [];
  /*
   * By storing a map of changes for each element, we can a quick lookup as we
   * iterate over the elements array!
   */
  const changesMap = new Map<any, any[]>();
  const addItemChanges: any[] = [];

  for (const change of changes) {
    if (change.type === "add") {
      addItemChanges.push(change);
      continue;
    } else if (change.type === "remove" || change.type === "replace") {
      /*
       * For a 'remove' change we can safely ignore any other changes queued for
       * the same element, it's going to be removed anyway!
       */
      changesMap.set(change.id, [change]);
    } else {
      const elementChanges = changesMap.get(change.id);

      if (elementChanges) {
        /*
         * If we have some changes queued already, we can do a mutable update of
         * that array and save ourselves some copying.
         */
        elementChanges.push(change);
      } else {
        changesMap.set(change.id, [change]);
      }
    }
  }

  for (const element of elements) {
    const changes = changesMap.get(element.id);

    /*
     * When there are no changes for an element we can just push it unmodified,
     * no need to copy it.
     */
    if (!changes) {
      updatedElements.push(element);
      continue;
    }

    // If we have a 'remove' change queued, it'll be the only change in the array
    if (changes[0].type === "remove") {
      continue;
    }

    if (changes[0].type === "replace") {
      updatedElements.push({ ...changes[0].item });
      continue;
    }

    /**
     * For other types of changes, we want to start with a shallow copy of the
     * object so React knows this element has changed. Sequential changes will
     * each _mutate_ this object, so there's only ever one copy.
     */
    const updatedElement = { ...element };

    for (const change of changes) {
      applyChange(change, updatedElement);
    }

    updatedElements.push(updatedElement);
  }

  /*
   * we need to wait for all changes to be applied before adding new items
   * to be able to add them at the correct index
   */
  if (addItemChanges.length) {
    addItemChanges.forEach((change) => {
      if (change.index !== undefined) {
        updatedElements.splice(
          change.item.type === "Group" ? 0 : change.index, // if we add a group it is prepended
          0,
          { ...change.item }
        );
      } else {
        updatedElements.push({ ...change.item });
      }
    });
  }

  return updatedElements;
}

// Applies a single change to an element. This is a *mutable* update.
function applyChange(change: any, element: any): any {
  switch (change.type) {
    case "select": {
      element.selected = change.selected;
      break;
    }

    case "position": {
      if (typeof change.position !== "undefined") {
        element.position = change.position;
      }

      if (typeof change.dragging !== "undefined") {
        element.dragging = change.dragging;
      }

      break;
    }

    case "dimensions": {
      if (typeof change.dimensions !== "undefined") {
        element.measured ??= {};
        element.measured.width = change.dimensions.width;
        element.measured.height = change.dimensions.height;

        if (change.setAttributes) {
          if (
            change.setAttributes === true ||
            change.setAttributes === "width"
          ) {
            element.width = change.dimensions.width;
          }
          if (
            change.setAttributes === true ||
            change.setAttributes === "height"
          ) {
            element.height = change.dimensions.height;
          }
        }
      }

      if (typeof change.resizing === "boolean") {
        element.resizing = change.resizing;
      }

      break;
    }
  }
}

/**
 * Drop in function that applies node changes to an array of nodes.
 * @public
 * @param changes - Array of changes to apply.
 * @param nodes - Array of nodes to apply the changes to.
 * @returns Array of updated nodes.
 * @example
 *```tsx
 *import { useState, useCallback } from 'react';
 *import { ReactFlow, applyNodeChanges, type Node, type Edge, type OnNodesChange } from '@xyflow/react';
 *
 *export default function Flow() {
 *  const [nodes, setNodes] = useState<Node[]>([]);
 *  const [edges, setEdges] = useState<Edge[]>([]);
 *  const onNodesChange: OnNodesChange = useCallback(
 *    (changes) => {
 *      setNodes((oldNodes) => applyNodeChanges(changes, oldNodes));
 *    },
 *    [setNodes],
 *  );
 *
 *  return (
 *    <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} />
 *  );
 *}
 *```
 * @remarks Various events on the <ReactFlow /> component can produce an {@link NodeChange}
 * that describes how to update the edges of your flow in some way.
 * If you don't need any custom behaviour, this util can be used to take an array
 * of these changes and apply them to your edges.
 */
export function applyNodeChanges<NodeType extends Node = Node>(
  changes: NodeChange<NodeType>[],
  nodes: NodeType[]
): NodeType[] {
  return applyChanges(changes, nodes) as NodeType[];
}

/**
 * Converts a UUID string to a CSS color optimized for visibility against a dark blue background
 * @param {string} uuid - The UUID to convert (e.g. "123e4567-e89b-12d3-a456-426614174000")
 * @param {string} format - The output format: "hex" (default), "rgb", or "hsl"
 * @returns {string} - A CSS color string in the specified format
 */
export function uuidToColor(uuid: string, format = "hex") {
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
  const saturation = 85; // Higher saturation for more vibrant colors
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

export const getInput = (
  inputs: nodeInputs,
  handleId: string,
  fallback: number
) => {
  const input = inputs.get(handleId);
  return input?.sourceNode.getResult(input.sourceHandleId) ?? fallback;
};

export function connectionToEdgeId(edge: Connection): string {
  return (
    "xy-edge__" +
    edge.source +
    edge.sourceHandle +
    "-" +
    edge.target +
    edge.targetHandle
  );
}

export function createForLoop(
  addNodes: (payload: Node | Node[]) => void,
  addEdges: (payload: Edge | Edge[]) => void,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  parentLoopId?: string,
  parentId?: string,
  screenToFlowPosition?: (
    clientPosition: XYPosition,
    options?: {
      snapToGrid: boolean;
    }
  ) => XYPosition,
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
      parentId,
      position: screenToFlowPosition
        ? screenToFlowPosition({ x: x1, y: y1 })
        : { x: x1, y: y1 },
      data: { loopId, parentLoopId },
    },
    {
      id: endId,
      type: "ForEnd",
      parentId,
      position: screenToFlowPosition
        ? screenToFlowPosition({ x: x2, y: y2 })
        : { x: x2, y: y2 },
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
  return [startId, endId, loopId];
}

// Helper function to connect nodes to loop connectors
export function connectNodesToLoop(
  getNodes: () => Node[],
  addEdges: (payload: Edge | Edge[]) => void,
  nodeIds: string[],
  loopId: string,
) {
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
}

export function handleUUID() {
  return uuidv4().replace(/-/g, "");
}

export function getContextMenuPosition(event: MouseEvent | React.MouseEvent): {
  x: number;
  y: number;
} {
  //Specific numbers for ContextMenu size might need to be changed later depending on if the ContextMenu receives any changes
  //TODO: if this is really needed, calculate the size of the ContextMenu dynamically
  const x =
    (event as React.MouseEvent).clientX > window.innerWidth - 274
      ? window.innerWidth - 274
      : (event as React.MouseEvent).clientX;
  const y =
    (event as React.MouseEvent).clientY > window.innerHeight - 284
      ? window.innerHeight - 284
      : (event as React.MouseEvent).clientY;
  return { x: x - 15, y: y - 15 };
}

// this accepts a list of nodes and duplicates them
// loops and groups will be handled automatically, just include them and their children
export function duplicateNodes(
  nodes: Node[],
  addNodes: (payload: Node | Node[]) => void,
  addEdges: (payload: Edge | Edge[]) => void,
  getNodes: () => Node[],
  getEdges: () => Edge[],
  setNodes: (payload: Node[] | ((nodes: Node[]) => Node[])) => void,
  screenToFlowPosition?: (
    clientPosition: XYPosition,
    options?: {
      snapToGrid: boolean;
    }
  ) => XYPosition,
) {

  // if this is called with no nodes, return
  if (!nodes) return;

  // this map will keep track of which new parent ids should be assigned to children
  const oldToNewIdMap = new Map<string, string>();
  const newNodes: Node[] = [];
  const newEdges: Edge[] = [];
  // create copies of group nodes
  const groupNodes: Node[] = nodes.filter((node) => node.type === "Group");
  newNodes.push(...groupNodes.map((node) => {
    const newId = uuidv4();
    oldToNewIdMap.set(node.id, newId);

    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: {
        ...node.data,
      },
    };
  }));

  // loop nodes and how they are nested
  const loopStartNodes: Node[] = nodes.filter((node) => node.type === "ForStart");
  const loopEndNodes: Node[] = nodes.filter((node) => node.type === "ForEnd");

  type loop = {start: Node, end: Node};
  const loops: loop[] = [];
  loopStartNodes.forEach((node) => {
    const endNode = loopEndNodes.find((endNode) => endNode.data.loopId === node.data.loopId);
    if (endNode) {
      loops.push({start: node, end: endNode});
    }
  });

  // duplicate the loops with createLoop()
  loops.forEach((loop) => {
    const startId = uuidv4();
    const endId = uuidv4();
    const loopId = uuidv4();
    const parentLoopId = oldToNewIdMap.get(loop.start.data.parentLoopId as string);
    const parentIdStart = loop.start.parentId ? oldToNewIdMap.get(loop.start.parentId) : undefined;
    const parentIdEnd = loop.end.parentId ? oldToNewIdMap.get(loop.end.parentId) : undefined;
    const edgeId = connectionToEdgeId({
      source: startId,
      sourceHandle: MAIN_LOOP_CONNECTOR,
      target: endId,
      targetHandle: MAIN_LOOP_CONNECTOR,
    });

    newNodes.push(...[
      {
        id: startId,
        type: "ForStart",
        parentId: parentIdStart,
        position: {
            x: loop.start.parentId ? loop.start.position.x : loop.start.position.x + 50,
            y: loop.start.parentId ? loop.start.position.y : loop.start.position.y + 50,
          },
        data: { loopId, parentLoopId, loopStart: true, loopEnd: false },
      },
      {
        id: endId,
        type: "ForEnd",
        parentId: parentIdEnd,
        position: {
          x: loop.end.parentId ? loop.end.position.x : loop.end.position.x + 50,
          y: loop.end.parentId ? loop.end.position.y : loop.end.position.y + 50,
        },
        data: { loopId, parentLoopId, loopStart: false, loopEnd: true },
      },
    ])

    newEdges.push({
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

    oldToNewIdMap.set(loop.start.id, startId);
    oldToNewIdMap.set(loop.end.id, endId);
    oldToNewIdMap.set(loop.start.data.loopId as string, loopId);
  })

  // handles special loop edges
  // this is not using connectNodesToLoop() because of weird update behaviour with addNodes and getNodes
  loops.forEach((loop) => {
    const newLoopId = oldToNewIdMap.get(loop.start.data.loopId as string);

    if(!newLoopId) return;
    const loopChildrenIds = newNodes
      .filter((node) => node.data.parentLoopId === newLoopId)
      .map((node) => { return node.id })

    if(loopChildrenIds.length === 0) return;

    const loopNodes: Node[] = [
        newNodes.find((node) => node.id === oldToNewIdMap.get(loop.start.id))!,
        newNodes.find((node) => node.id === oldToNewIdMap.get(loop.end.id))!
      ];
    loopChildrenIds.forEach((nodeId) => {
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

        newEdges.push({
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
            stroke: uuidToColor(newLoopId),
          },
        });
      });
    });
  })

  addNodes(newNodes);
  addEdges(newEdges);


  // set all new nodes as selected
  setNodes((nodes) => {
    return nodes.map((node) => ({
      ...node,
      selected: Array.from(oldToNewIdMap.values()).includes(node.id),
    }));
  })
}
