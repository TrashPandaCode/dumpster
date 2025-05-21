import { type Node } from "@xyflow/react";
import { create } from "zustand";

import { debugNodes } from "../solutions/debug";

interface NodeSetterState {
  nodes: Node[];
  setNodes: (nodes: Node[]) => void;
  resetHighlight: () => void;
  highlightNode: (id: string, color: string) => void;
}

export const useNodeSetterStore = create<NodeSetterState>((set) => ({
  nodes: debugNodes,
  setNodes: (nodes) => set({ nodes }),
  resetHighlight: () =>
    set((state) => ({
      nodes: state.nodes.map((node) => ({
        ...node,
        style: {
          ...node.style,
          outline: undefined,
        },
      })),
    })),
  highlightNode: (id, color) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              style: {
                ...node.style,
                outline: "2px solid " + color,
              },
            }
          : node
      ),
    })),
}));
