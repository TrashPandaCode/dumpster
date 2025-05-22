import { type Node } from "@xyflow/react";
import { create } from "zustand";

import { debugNodes } from "../solutions/debug";
import { useToastStore } from "./toast-store";

type HighlightType = "cycle" | "duplicate";

interface NodeSetterState {
  nodes: Node[];
  highlightNodes: Map<HighlightType, string[]>;
  setNodes: (nodes: Node[]) => void;
  resetHighlight: (type: HighlightType) => void;
  highlightNode: (id: string, type: HighlightType, color: string) => void;
  highlightDuplicateNodes: () => void;
}

export const useNodeSetterStore = create<NodeSetterState>((set, get) => ({
  nodes: debugNodes,
  highlightNodes: new Map(),
  setNodes: (nodes) => set({ nodes }),
  resetHighlight: (type) => {
    set((state) => {
      const highlightNodes = get().highlightNodes.get(type);
      if (!highlightNodes) return state;

      get().highlightNodes.delete(type);

      return {
        nodes: state.nodes.map((node) =>
          highlightNodes.includes(node.id)
            ? { ...node, style: { ...node.style, outline: undefined } }
            : node
        ),
      };
    });
  },
  highlightNode: (id, type, color) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === id) {
          if (state.highlightNodes.has(type)) {
            state.highlightNodes.get(type)!.push(id);
          } else state.highlightNodes.set(type, [id]);

          return {
            ...node,
            style: {
              ...node.style,
              outline: "2px solid " + color,
            },
          };
        }
        return node;
      }),
    })),
  highlightDuplicateNodes: () => {
    get().resetHighlight("duplicate");
    const exportNodes = get().nodes.filter(
      (node) => node.type === "ExportToGameobject"
    );

    const grouped: Record<string, Node[]> = {};
    const { triggerToast } = useToastStore.getState();

    for (const node of exportNodes) {
      const gameObject = (
        node.data.gameObject as { current: string } | undefined
      )?.current;
      if (!gameObject) continue;
      if (!grouped[gameObject]) {
        grouped[gameObject] = [];
      }
      grouped[gameObject].push(node);
    }

    for (const [_, group] of Object.entries(grouped)) {
      if (group.length > 1) {
        triggerToast(
          "Duplicate GameObject",
          `The GameObject ${(group[0].data.gameObject as { name: string }).name} is duplicated in the scene.`
        );
        for (const node of group) {
          get().highlightNode(node.id, "duplicate", "orange");
        }
      }
    }
  },
}));
