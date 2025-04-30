import { type Connection, type Node } from "@xyflow/react";
import { create } from "zustand";

type MapErrors = {
  cycle: boolean;
};

enum Mark {
  Temporary,
  Permanent,
}

export type nodeInputs = Map<
  string, // targetHandleId
  { sourceNode: AppNode; sourceHandleId: string; edgeId: string }
>;

export type nodeData = Map<string, number>;

export class AppNode {
  inputs: nodeInputs = new Map();
  outputs: Map<
    string, // edgeId
    { targetNode: AppNode; targetHandleId: string; sourceHandleId: string }
  > = new Map();
  results: nodeData = new Map(); // string: handle-id of corresponding output handle
  mark: Mark | null = null; // TODO: null or undefined
  nodeId: string;

  compute?: (inputs: nodeInputs, results: nodeData) => void;

  constructor(nodeId: string, data: Record<string, unknown>) {
    this.nodeId = nodeId;
    this.updateData(data);
  }

  updateData(data: Record<string, unknown>) {
    Object.entries(data).forEach(([key, entry]) => {
      if (key === "compute") {
        this.compute = entry as (inputs: nodeInputs, results: nodeData) => void;
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
  mapErrors: MapErrors;
  replaceNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Connection) => void;
  removeEdge: (edgeId: string) => void;
  compute: () => void;
  debugPrint: () => void;
}

export const useNodeStore = create<NodeStoreState>((set) => ({
  nodeMap: new Map<string, AppNode>(),
  mapErrors: { cycle: false },
  replaceNode: (node: Node) => {
    set((state) => {
      if (state.nodeMap.has(node.id)) {
        state.nodeMap.get(node.id)?.updateData(node.data);
      } else {
        state.nodeMap.set(node.id, new AppNode(node.id, node.data));
      }
      return state;
    });
  },
  removeNode: (nodeId: string) => {
    set((state) => {
      state.nodeMap.delete(nodeId);
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
        nodeMap: orderMap(state.mapErrors, state.nodeMap),
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
        nodeMap: orderMap(state.mapErrors, state.nodeMap),
      };
    });
  },
  compute: () => {
    set((state) => {
      computeMap(state.mapErrors, state.nodeMap);
      return state;
    });
  },
  debugPrint: () => {
    set((state) => {
      console.log(state.mapErrors.cycle);

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

function computeMap(mapErrors: MapErrors, map: Map<string, AppNode>) {
  if (mapErrors.cycle) {
    console.log("Cannot compute because of cycle");
    return;
  }

  const reverseMap = Array.from(map).reverse();
  reverseMap.forEach(([_, node]) => {
    //TODO: this needs to be more efficient (precalc this reversed array)
    if (!node.compute) {
      throw new Error("Compute is not defined");
    }
    node.compute(node.inputs, node.results);
  });
}

function orderMap(
  mapErrors: MapErrors,
  map: Map<string, AppNode>
): Map<string, AppNode> {
  mapErrors.cycle = false;
  // remove all marks
  map.forEach((node) => {
    node.mark = null;
  });

  // map to contain sorted nodes
  let sortedMap = new Map<string, AppNode>();

  // TODO: this while loop is inefficient
  // because it loops over marked nodes
  map.forEach((node) => {
    if (!node.mark) {
      visit(node, sortedMap, mapErrors);
    }
  });
  return mapErrors.cycle ? map : sortedMap;
}

function visit(
  node: AppNode,
  sortedMap: Map<string, AppNode>,
  mapErrors: MapErrors
) {
  if (node.mark == Mark.Permanent) {
    return;
  }
  if (node.mark == Mark.Temporary) {
    console.log("Found cycle");
    mapErrors.cycle = true;
    return;
  }

  node.mark = Mark.Temporary;

  node.outputs.forEach(({ targetNode }) => {
    visit(targetNode, sortedMap, mapErrors);
  });

  node.mark = Mark.Permanent;
  sortedMap.set(node.nodeId, node);
}
