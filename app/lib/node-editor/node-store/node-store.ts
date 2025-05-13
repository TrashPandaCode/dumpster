import { type Connection, type Edge, type Node } from "@xyflow/react";
import { create } from "zustand";

export type LoopStatus = {
  // just externally manage loops (from the compute Map function) using this object to which the end node can write to (and start node read from)
  iter: number; // when iter > 0 then use loopResults as inputs, this also allows us to pass an index to the ForStart resutls
  looping: boolean; //we could use this for while loops
  loopResults: Map<string, number>; //map handleIds to result
};

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

  compute(
    inputs: nodeInputs,
    results: nodeData,
    loopStatus?: LoopStatus
  ): void {}

  loopStart = false;
  loopEnd = false;
  loopId: string | undefined = undefined; // do we even need this now? because we can set the results in the corresponding end node compute function which knows its loopId

  constructor(nodeId: string, data: Record<string, unknown>) {
    this.nodeId = nodeId;
    this.updateData(data);
  }

  updateData(data: Record<string, unknown>) {
    Object.entries(data).forEach(([key, entry]) => {
      if (key === "compute") {
        this.compute = entry as (inputs: nodeInputs, results: nodeData) => void;
      }
      // add the loop Id as well as loopstart and loop end here
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
  sortedNodes: [string, AppNode][];
  mapErrors: MapErrors;
  replaceNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Connection | Edge) => void;
  removeEdge: (edgeId: string) => void;
  compute: () => void;
  debugPrint: () => void;
}

export const useNodeStore = create<NodeStoreState>((set) => ({
  nodeMap: new Map<string, AppNode>(),
  sortedNodes: [],
  mapErrors: { cycle: false },
  replaceNode: (node: Node) => {
    set((state) => {
      if (state.nodeMap.has(node.id)) {
        state.nodeMap.get(node.id)?.updateData(node.data);
      } else {
        const newNode = new AppNode(node.id, node.data);
        state.nodeMap.set(node.id, newNode);
        state.sortedNodes.push([node.id, newNode]);
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
    set((state) => {
      computeMap(state.sortedNodes);
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

function computeMap(sortedNodes: [string, AppNode][]) {
  //external management of loops
  // we only need one of these because no two loops are beeing computed simultaneously
  const loopStatus: LoopStatus = {
    iter: 0,
    looping: true,
    loopResults: new Map(),
  };
  sortedNodes.forEach(([_, node]) => {
    // if node is a loop start node start a new queue and append itself and all following nodes.
    // if node is a loop end node start computing the queue

    // for loops in loops use an outer stack on which the loop queues are pushed

    // with the results of the loopEnd node construct a new input Map (maybe just have one ready to update in place)
    // with the correct handles (we know them from the loop id and the loop store)
    // and feed this input map into the start node so it can access the updated values after the iteration
    // THIS IS PROB OUTDATED AS WE NOW USE THE LOOPSTATUS OBJECT
    if (node.loopStart) {
      //start loop
    } else if (node.loopEnd) {
      // and loop is still looping otherwise we need to continue with the map as is
    } else {
      node.compute(node.inputs, node.results);
    }
  });
}

function orderMap(
  mapErrors: MapErrors,
  map: Map<string, AppNode>
): [string, AppNode][] {
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

  return mapErrors.cycle ? [] : Array.from(sortedMap).reverse();
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
