import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  ReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import { create } from "zustand";

enum Mark {
  Temporary,
  Permanent,
}

export type nodeInputs = Map<
  string, // targetHandleId
  { sourceNode: AppNode; sourceHandleId: string; edgeId: string }
>;

export type nodeResults = Map<string, number>;

export class AppNode {
  inputs: nodeInputs = new Map();
  outputs: Map<
    string, // edgeId
    { targetNode: AppNode; targetHandleId: string; sourceHandleId: string }
  > = new Map();
  data: Map<string, number> = new Map(); //TODO: is this needed?
  results: nodeResults = new Map(); // string: handle-id of corresponding output handle
  mark: Mark | null = null; // TODO: null or undefined
  nodeId: string;

  compute?: (inputs: nodeInputs, results: nodeResults) => void;

  constructor(nodeId: string, data: Record<string, unknown>) {
    this.nodeId = nodeId;
    this.updateData(data);
  }

  updateData(data: Record<string, unknown>) {
    Object.entries(data).forEach(([key, entry]) => {
      if (key === "compute") {
        this.compute = entry as (
          inputs: nodeInputs,
          results: nodeResults
        ) => void;
      }
    });
  }

  getResult(key: string): number | undefined {
    return this.results.get(key);
  }
}

interface NodeStoreState {
  /**
   * sorted in reverse order
   */
  nodeMap: Map<string, AppNode>;
  replaceNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Connection) => void;
  removeEdge: (edgeId: string) => void;
  debugPrint: () => void;
}

export const useNodeStore = create<NodeStoreState>((set) => ({
  nodeMap: new Map<string, AppNode>(),
  replaceNode: (node: Node) => {
    set((state) => {
      if (state.nodeMap.has(node.id)) {
        state.nodeMap.get(node.id)?.updateData(node.data);
      } else {
        state.nodeMap.set(node.id, new AppNode(node.id, node.data));
      }

      console.log("compute replace");
      computeMap(state.nodeMap);

      return state;
    });
  },
  removeNode: (nodeId: string) => {
    set((state) => {
      state.nodeMap.delete(nodeId);

      console.log("compute remove");
      computeMap(state.nodeMap);

      return state;
    });
  },
  addEdge: (edge: Connection) => {
    set((state) => {
      const source = state.nodeMap.get(edge.source);
      const target = state.nodeMap.get(edge.target);

      if (source && target && edge.targetHandle && edge.sourceHandle) {
        const edgeId = connectionToEdgeId(edge);

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
        nodeMap: orderMap(state.nodeMap),
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

      console.log("compute remove edge");
      computeMap(state.nodeMap);

      return state;
    });
  },
  debugPrint: () => {
    set((state) => {
      state.nodeMap.forEach((node) => {
        console.log(node);
      });
      return state;
    });
  },
}));

// edge source, edge source handle, edge target, edge target handle
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

function connectionToEdgeId(edge: Connection): string {
  return (
    "xy-edge__" +
    edge.source +
    edge.sourceHandle +
    "-" +
    edge.target +
    edge.targetHandle
  );
}

function computeMap(map: Map<string, AppNode>) {
  const reverseMap = Array.from(map).reverse();
  reverseMap.forEach(([_, node]) => {
    if (!node.compute) {
      throw new Error("Compute is not defined");
    }
    node.compute(node.inputs, node.results);
  });
}

function orderMap(map: Map<string, AppNode>): Map<string, AppNode> {
  // remove all marks
  map.forEach((node) => {
    node.mark = null;
  });

  // map to contain sorted nodes
  let sortedMap = new Map<string, AppNode>();

  // TODO: this while loop is inefficient
  // because it loops over marked nodes
  while (sortedMap.size != map.size) {
    map.forEach((node) => {
      if (!node.mark) {
        visit(node, sortedMap);
      }
    });
  }

  console.log("compute order");
  computeMap(sortedMap);
  return sortedMap;
}

function visit(node: AppNode, sortedMap: Map<string, AppNode>) {
  if (node.mark == Mark.Permanent) {
    return;
  }
  if (node.mark == Mark.Temporary) {
    throw new Error("Cycle");
  }

  node.mark = Mark.Temporary;

  node.outputs.forEach(({ targetNode }) => {
    visit(targetNode, sortedMap);
  });

  node.mark = Mark.Permanent;
  sortedMap.set(node.nodeId, node);
}
