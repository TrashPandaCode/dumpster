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

class AppNode {
  // source
  // edge id
  // target node id
  // target handle id
  // source handle id

  // target
  // edge id
  // source node id
  // source handle id
  // target handle id
  inputs: Map<string, [string, string, string]> = new Map();
  outputs: Map<string, [string, string, string]> = new Map();
  values: Map<string, number> = new Map(); // string: handle-id of corresponding output handle

  constructor(values: Record<string, unknown>) {
    Object.entries(values).forEach(([key, entry]) => {
      this.values.set(key, Number(entry)); // TODO: boolean types???
    });
  }

  getValue(key: string): number | undefined {
    return this.values.get(key);
  }
}

interface NodeStoreState {
  nodeMap: Map<string, AppNode>;
  replaceNode: (node: Node) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: Connection) => void;
  removeEdge: (edgeId: string) => void;
}

export const useNodeStore = create<NodeStoreState>((set) => ({
  nodeMap: new Map<string, AppNode>(),
  replaceNode: (node: Node) => {
    set((state) => {
      if (state.nodeMap.has(node.id)) {
        // only replace input value
        return state;
      }
      const newNode = new AppNode(node.data);
      const newNodeMap = new Map(state.nodeMap);
      newNodeMap.set(node.id, newNode);

      // console.log("New map: ");
      // console.log(newNodeMap);

      return {
        ...state,
        nodeMap: newNodeMap,
      };
    });
  },
  removeNode: (nodeId: string) => {
    set((state) => {
      const newNodeMap = new Map(state.nodeMap);
      newNodeMap.delete(nodeId);

      // console.log("New map: ");
      // console.log(newNodeMap);

      return {
        ...state,
        nodeMap: newNodeMap,
      };
    });
  },
  addEdge: (edge: Connection) => {
    set((state) => {
      const source = state.nodeMap.get(edge.source);
      const target = state.nodeMap.get(edge.target);

      if (source && target && edge.targetHandle && edge.sourceHandle) {
        const edgeId = connectionToEdgeId(edge);

        source.outputs.set(edgeId, [
          edge.target,
          edge.targetHandle,
          edge.sourceHandle,
        ]);
        console.log(target.inputs.has(edgeId));
        target.inputs.set(edgeId, [
          edge.source,
          edge.sourceHandle,
          edge.targetHandle,
        ]);
      }

      console.log(state.nodeMap);

      return state;
    });
  },
  removeEdge: (edgeId: string) => {
    set((state) => {
      const [edgeSource, edgeSourceHandle, edgeTarget, edgeTargetHandle] =
        edgeIdParser(edgeId);
      const source = state.nodeMap.get(edgeSource);
      const target = state.nodeMap.get(edgeTarget);

      source?.outputs.delete(edgeId);
      target?.inputs.delete(edgeId);

      console.log(state.nodeMap);

      return state;
    });
  },
}));

// edge source, edge source handle, edge target, edge target handle
function edgeIdParser(edgeId: string): [string, string, string, string] {
  const regex = /^xy-edge__([0-9a-fA-F-]{36})(.*?)-([0-9a-fA-F-]{36})(.*)$/;
  const match = edgeId.match(regex);

  if (!match) {
    throw new Error("String does not match expected format");
  }

  return [match[1], match[2], match[3], match[4]];
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
