import { type Connection, type Edge, type Node } from "@xyflow/react";
import { create } from "zustand";

export type LoopStatus = {
  // just externally manage loops (from the compute Map function) using this object to which the end node can write to (and start node read from)
  iter: number; // when iter > 0 then use loopResults as inputs, this also allows us to pass an index to the ForStart resutls
  looping: boolean; //we could use this for while loops
  loopResults: Map<string, number>; //map handleIds to result
};

type Loop = {
  startIndex: number; // index of start node
  loopId: string;
  loopStatus: LoopStatus;
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
      } else if (key === "loopStart") {
        this.loopStart = entry as boolean;
      } else if (key === "loopEnd") {
        this.loopEnd = entry as boolean;
      } else if (key === "loopId") {
        this.loopId = entry as string;
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
  sortedNodes: AppNode[];
  mapErrors: MapErrors;
  replaceNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Connection | Edge) => void;
  removeEdge: (edgeId: string) => void;
  compute: () => void;
  debugPrint: () => void;
}

export const useNodeStore = create<NodeStoreState>((set, get) => ({
  nodeMap: new Map<string, AppNode>(),
  sortedNodes: [],
  mapErrors: { cycle: false },
  replaceNode: (node: Node) => {
    const nodeMap = get().nodeMap;
    if (nodeMap.has(node.id)) {
      nodeMap.get(node.id)?.updateData(node.data);
    } else {
      const newNode = new AppNode(node.id, node.data);
      nodeMap.set(node.id, newNode);
      get().sortedNodes.push(newNode);
    }
  },
  removeNode: (nodeId: string) => {
    get().nodeMap.delete(nodeId);
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

    get().nodeMap.forEach((node) => {
      console.log(node);
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

function orderMap(mapErrors: MapErrors, map: Map<string, AppNode>): AppNode[] {
  mapErrors.cycle = false;
  // remove all marks
  map.forEach((node) => {
    node.mark = null;
  });

  // map to contain sorted nodes
  let sortedMap: AppNode[] = [];

  // TODO: this while loop is inefficient
  // because it loops over marked nodes
  map.forEach((node) => {
    if (!node.mark) {
      visit(node, sortedMap, mapErrors);
    }
  });

  return mapErrors.cycle ? [] : sortedMap;
}

function visit(node: AppNode, sortedMap: AppNode[], mapErrors: MapErrors) {
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
  sortedMap.unshift(node);
}
