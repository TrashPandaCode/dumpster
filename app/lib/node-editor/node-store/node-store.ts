import { type Connection, type Edge, type Node } from "@xyflow/react";
import { create } from "zustand";

import { toast } from "../editor-components/Toast";
import { connectionToEdgeId } from "../utils/edges";
import { useFlowStore } from "./flow-store";

/**
 * Represents the current state of a loop execution in the node graph.
 * Used to manage loop iterations and pass data between loop start and end nodes.
 */
export type LoopStatus = {
  // just externally manage loops (from the compute Map function) using this object to which the end node can write to (and start node read from)
  iter: number; // when iter > 0 then use loopResults as inputs, this also allows us to pass an index to the ForStart resutls
  looping: boolean; //we could use this for while loops
  loopResults: nodeResults; //map handleIds to result
};

/**
 * Represents a loop construct in the node graph, containing metadata about
 * the loop's starting position, identifier, and current execution status.
 */
type Loop = {
  startIndex: number; // index of start node
  loopId: string;
  loopStatus: LoopStatus;
};

/**
 * Tracks error states that can occur during node graph processing.
 */
type MapErrors = {
  cycle: boolean;
};

/**
 * Enumeration used for topological sorting to mark nodes during cycle detection.
 * Temporary marks indicate nodes currently being visited, permanent marks indicate completed nodes.
 */
enum Mark {
  Temporary,
  Permanent,
}

/**
 * Maps target handle IDs to their corresponding source node information.
 */
export type nodeInputs = Map<
  string, // targetHandleId
  { sourceNode: AppNode; sourceHandleId: string; edgeId: string }
>;

/**
 * Maps handle IDs to their computed numeric values.
 * Stores the results of node computations for each output handle.
 */
export type nodeResults = Map<string, number>;

/**
 * Represents a computational node in the node graph system.
 * Manages inputs, outputs, computation results, and loop-related metadata.
 * Each node can perform computations based on its inputs and store results for connected nodes.
 */
export class AppNode {
  inputs: nodeInputs = new Map();
  outputs: Map<
    string, // edgeId
    { targetNode: AppNode; targetHandleId: string; sourceHandleId: string }
  > = new Map();
  results: nodeResults = new Map(); // string: handle-id of corresponding output handle
  mark: Mark | null = null;
  nodeId: string;

  /**
   * Performs the node's computational logic using provided inputs and stores results.
   * Must be implemented in the node components.
   *
   * @param inputs - Map of input handle IDs to their source node information
   * @param results - Map to store computed results by handle ID
   * @param loopStatus - Optional loop state information for nodes within loops
   */
  compute(
    inputs: nodeInputs,
    results: nodeResults,
    loopStatus?: LoopStatus
  ): void {}

  loopStart = false;
  loopEnd = false;
  loopId: string | undefined = undefined;

  type: string | undefined = "";

  /**
   * Creates a new AppNode instance with the specified ID, data, and type.
   * Initializes the node's properties and calls updateData to process the provided data.
   *
   * @param nodeId - Unique identifier for the node
   * @param data - Object containing node-specific data and configuration
   * @param type - The type/category of the node (used for debugging)
   */
  constructor(
    nodeId: string,
    data: Record<string, unknown>,
    type: string | undefined
  ) {
    this.nodeId = nodeId;
    this.updateData(data);
    this.type = type;
  }

  /**
   * Updates the node's properties based on the provided data object.
   * Handles special properties like compute function, loop flags, and loop ID.
   *
   * @param data - Object containing node data
   */
  updateData(data: Record<string, unknown>) {
    Object.entries(data).forEach(([key, entry]) => {
      if (key === "compute") {
        this.compute = entry as (
          inputs: nodeInputs,
          results: nodeResults
        ) => void;
      } else if (key === "loopStart") {
        this.loopStart = entry as boolean;
      } else if (key === "loopEnd") {
        this.loopEnd = entry as boolean;
      } else if (key === "loopId") {
        this.loopId = entry as string;
      }
    });
  }

  /**
   * Retrieves the computed result for a specific output handle.
   *
   * @param key - The handle ID to get the result for
   * @returns The numeric result if available, undefined otherwise
   */
  getResult(key: string): number | undefined {
    return this.results.get(key);
  }

  /**
   * Custom serialization method that converts Maps to objects and handles circular references
   */
  toJSON(): any {
    return {
      nodeId: this.nodeId,
      inputs: Object.fromEntries(
        Array.from(this.inputs.entries()).map(([key, value]) => [
          key,
          {
            sourceNodeId: value.sourceNode.nodeId, // Store only ID to avoid circular refs
            sourceHandleId: value.sourceHandleId,
            edgeId: value.edgeId,
          },
        ])
      ),
      outputs: Object.fromEntries(
        Array.from(this.outputs.entries()).map(([key, value]) => [
          key,
          {
            targetNodeId: value.targetNode.nodeId, // Store only the ID to avoid circular references
            targetHandleId: value.targetHandleId,
            sourceHandleId: value.sourceHandleId,
          },
        ])
      ),
      results: Object.fromEntries(this.results),
      mark: this.mark,
      loopStart: this.loopStart,
      loopEnd: this.loopEnd,
      loopId: this.loopId,
      type: this.type,
    };
  }

  /**
   * Static method to recreate AppNode from serialized data
   */
  static fromJSON(data: any): AppNode {
    const node = new AppNode(data.nodeId, {}, data.type);

    // Restore basic properties
    node.loopStart = data.loopStart;
    node.loopEnd = data.loopEnd;
    node.loopId = data.loopId;
    node.mark = data.mark;

    // Restore Maps
    node.inputs = new Map(Object.entries(data.inputs || {}));
    node.results = new Map(Object.entries(data.results || {}));

    // compute function will be restored by the react components which are restored by the flow store

    return node;
  }
}

/**
 * Defines the state and actions for the node store.
 * Manages the collection of nodes, their topological ordering, error states,
 * and provides methods for node graph manipulation and computation.
 */
interface NodeStoreState {
  nodeMap: Map<string, AppNode>;
  sortedNodes: AppNode[];
  mapErrors: MapErrors;
  /**
   * Adds a new node to the store or updates an existing node's data.
   * Ignores Group nodes as they are purely visual elements.
   *
   * @param node - The node to add or update
   */
  replaceNode: (node: Node) => void;
  /**
   * Removes a node from the store and updates the topological ordering.
   *
   * @param nodeId - ID of the node to remove
   */
  removeNode: (nodeId: string) => void;
  /**
   * Creates a connection between two nodes by adding an edge.
   * Updates both source and target nodes' input/output mappings and recalculates topological ordering.
   *
   * @param edge - Connection or Edge object defining the relationship between nodes
   */
  addEdge: (edge: Connection | Edge) => void;
  /**
   * Removes a connection between nodes by deleting the specified edge.
   * Updates affected nodes' input/output mappings and recalculates topological ordering.
   *
   * @param edgeId - Unique identifier of the edge to remove
   */
  removeEdge: (edgeId: string) => void;
  /**
   * Executes the computation for all nodes in the graph in topological order.
   * Handles loop constructs and manages the execution flow.
   */
  compute: () => void;
  /**
   * Outputs debug information about the current state of the node graph.
   * Logs cycle detection status and details about each node.
   */
  debugPrint: () => void;
  /**
   * Resets the store to its initial empty state.
   * Clears all nodes, sorted order, and error flags.
   *
   * Checks if level data is in local storage, if so load it.
   */
  init: () => void;
  save: () => void;
  reset: () => void;
}

export const useNodeStore = create<NodeStoreState>((set, get) => ({
  nodeMap: new Map<string, AppNode>(),
  sortedNodes: [],
  mapErrors: { cycle: false },
  replaceNode: (node: Node) => {
    // if the node is a group, we don't want to add it to the map since they are purely visual
    if (node.type === "Group") {
      return;
    }

    const nodeMap = get().nodeMap;
    if (nodeMap.has(node.id)) {
      nodeMap.get(node.id)?.updateData(node.data);
    } else {
      const newNode = new AppNode(node.id, node.data, node.type);
      nodeMap.set(node.id, newNode);
      get().sortedNodes.push(newNode);
    }
  },
  removeNode: (nodeId: string) => {
    set((state) => {
      state.nodeMap.delete(nodeId);
      return {
        ...state,
        sortedNodes: orderMap(state.mapErrors, state.nodeMap),
      };
    });
  },
  addEdge: (edge: Connection | Edge) => {
    set((state) => {
      const source = state.nodeMap.get(edge.source);
      const target = state.nodeMap.get(edge.target);

      if (source && target && edge.targetHandle && edge.sourceHandle) {
        let edgeId = null;
        if ("id" in edge) {
          edgeId = edge.id;
        } else {
          edgeId = connectionToEdgeId(edge);
        }

        source.outputs.set(edgeId, {
          targetNode: target,
          targetHandleId: edge.targetHandle,
          sourceHandleId: edge.sourceHandle,
        });

        target.inputs.set(edge.targetHandle, {
          sourceNode: source,
          sourceHandleId: edge.sourceHandle,
          edgeId: edgeId,
        });
      }

      return {
        ...state,
        sortedNodes: orderMap(state.mapErrors, state.nodeMap),
      };
    });
  },
  removeEdge: (edgeId: string) => {
    set((state) => {
      const { edgeSource, edgeTarget } = edgeIdParser(edgeId);
      const source = state.nodeMap.get(edgeSource);
      const target = state.nodeMap.get(edgeTarget);

      source?.outputs.delete(edgeId);
      if (target)
        Array.from(target.inputs).some(
          ([key, value]) => value.edgeId === edgeId && target.inputs.delete(key)
        );

      return {
        ...state,
        sortedNodes: orderMap(state.mapErrors, state.nodeMap),
      };
    });
  },
  compute: () => {
    computeMap(get().sortedNodes);
  },
  debugPrint: () => {
    console.log(get().mapErrors.cycle);

    get().sortedNodes.forEach((node) => {
      console.log(node.type, node);
    });
  },
  init: () => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const stored = localStorage.getItem(`node-store-${levelId}`);
    if (!stored) return get().reset();

    const nodeStoreData = JSON.parse(stored);
    const { sortedNodes, nodeMap } = deserializeAppNodeArray(
      nodeStoreData.sortedNodes
    );
    set({
      sortedNodes,
      nodeMap,
      mapErrors: nodeStoreData.mapErrors,
    });
  },
  save: () => {
    const state = get();
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const nodeStoreData = {
      sortedNodes: JSON.stringify(state.sortedNodes),
      mapErrors: state.mapErrors,
    };
    localStorage.setItem(
      `node-store-${levelId}`,
      JSON.stringify(nodeStoreData)
    );
  },
  reset: () =>
    set({
      nodeMap: new Map<string, AppNode>(),
      sortedNodes: [],
      mapErrors: { cycle: false },
    }),
}));

/**
 * Parses an edge ID string to extract source and target node/handle information.
 * Uses regex to decompose the edge ID into its constituent parts.
 *
 * `edgeSource` and `edgeTarget` must be valid UUIDs, `edgeSourceHandle` and `edgeTargetHandle` must not be UUIDs.
 *
 * @param edgeId - The edge ID string to parse
 * @returns Object containing source/target node IDs and handle IDs
 * @throws Error if the edge ID format is invalid
 */
function edgeIdParser(edgeId: string): {
  edgeSource: string;
  edgeSourceHandle: string;
  edgeTarget: string;
  edgeTargetHandle: string;
} {
  const regex = /^xy-edge__([0-9a-fA-F-]{36})(.*?)-([0-9a-fA-F-]{36})(.*)$/;
  const match = edgeId.match(regex);

  if (!match) {
    throw new Error("String does not match expected format");
  }

  return {
    edgeSource: match[1],
    edgeSourceHandle: match[2],
    edgeTarget: match[3],
    edgeTargetHandle: match[4],
  };
}

/**
 * Executes computation across all nodes in topological order.
 * Handles loop constructs by managing loop state and controlling execution flow.
 * Supports nested loops and proper loop iteration management.
 *
 * @param sortedNodes - Array of nodes in topological order
 */
function computeMap(sortedNodes: AppNode[]) {
  const loops: Loop[] = [];

  for (let index = 0; index < sortedNodes.length; ) {
    const node = sortedNodes[index];

    if (node.loopStart) {
      if (loops.length == 0 || loops.at(-1)!.loopId !== node.loopId) {
        const loop: Loop = {
          startIndex: index,
          loopId: node.loopId!,
          loopStatus: {
            iter: 0,
            looping: true,
            loopResults: new Map(),
          },
        };
        loops.push(loop);
      }

      node.compute(node.inputs, node.results, loops.at(-1)!.loopStatus);
      index++;
    } else if (node.loopEnd) {
      const loop = loops.at(-1)!;
      node.compute(node.inputs, node.results, loop.loopStatus);
      if (loop.loopStatus.looping) index = loop.startIndex;
      else {
        loops.pop();
        index++;
      }
    } else {
      node.compute(node.inputs, node.results);
      index++;
    }
  }
}

/**
 * Performs topological sorting of the node graph using depth-first search.
 * Detects cycles and sets appropriate error states and visual highlights.
 *
 * @param mapErrors - Object to store detected error states
 * @param map - Map of all nodes to sort
 * @returns Array of nodes in topological order, or empty array if cycles detected
 */
function orderMap(mapErrors: MapErrors, map: Map<string, AppNode>): AppNode[] {
  mapErrors.cycle = false;
  useFlowStore.getState().resetHighlight("cycle");
  // remove all marks
  map.forEach((node) => {
    node.mark = null;
  });

  // map to contain sorted nodes
  const sortedMap: AppNode[] = [];

  map.forEach((node) => {
    if (!node.mark) {
      visit(node, sortedMap, mapErrors);
    }
  });

  return mapErrors.cycle ? [] : sortedMap;
}

/**
 * Recursive helper function for topological sorting using depth-first search.
 * Implements cycle detection using temporary and permanent marks.
 * Highlights nodes involved in cycles and shows error notifications.
 *
 * @param node - Current node being visited
 * @param sortedMap - Array to store nodes in topological order
 * @param mapErrors - Object to track error states during sorting
 */
function visit(node: AppNode, sortedMap: AppNode[], mapErrors: MapErrors) {
  if (node.mark == Mark.Permanent) {
    return;
  }
  if (node.mark == Mark.Temporary) {
    useFlowStore.getState().highlightNode(node.nodeId, "cycle", "red");
    toast({
      title: "Cycle!",
      description:
        "A cycle was detected in the node graph. Your graph won't execute unless you remove the cyclic connection.",
    });
    mapErrors.cycle = true;
    return;
  }

  node.mark = Mark.Temporary;

  node.outputs.forEach(({ targetNode }) => {
    visit(targetNode, sortedMap, mapErrors);
  });

  node.mark = Mark.Permanent;
  sortedMap.unshift(node);
}

/**
 * Deserializes JSON string back to nodeMap and sorted Nodes
 * @param jsonString - The serialized JSON string
 */
export function deserializeAppNodeArray(jsonString: string): {
  sortedNodes: AppNode[];
  nodeMap: Map<string, AppNode>;
} {
  const data = JSON.parse(jsonString);
  const nodeMap = new Map<string, AppNode>();

  // create all nodes
  const sortedNodes = data.map((nodeData: any) => {
    const node = AppNode.fromJSON(nodeData);
    nodeMap.set(node.nodeId, node);
    return node;
  });

  // reconstruct inputs and outputs with proper AppNode references
  data.forEach((nodeData: any, index: number) => {
    const node = sortedNodes[index];

    // Reconstruct inputs Map
    if (nodeData.inputs) {
      node.inputs = new Map(
        Object.entries(nodeData.inputs).map(([key, value]: [string, any]) => [
          key,
          {
            sourceNode: nodeMap.get(value.sourceNodeId)!,
            sourceHandleId: value.sourceHandleId,
            edgeId: value.edgeId,
          },
        ])
      ) as nodeInputs;
    }

    // Reconstruct outputs Map
    if (nodeData.outputs) {
      node.outputs = new Map(
        Object.entries(nodeData.outputs).map(([key, value]: [string, any]) => [
          key,
          {
            targetNode: nodeMap.get(value.targetNodeId)!,
            targetHandleId: value.targetHandleId,
            sourceHandleId: value.sourceHandleId,
          },
        ])
      );
    }
  });

  return { sortedNodes, nodeMap };
}
