import { type Node } from "@xyflow/react";
import { create } from "zustand";

import { toast } from "../editor-components/Toast";
import { debugNodes } from "../solutions/debug";

type HighlightType = "cycle" | "duplicate";

interface NodeSetterState {
  nodes: Node[];
  highlightNodes: Map<HighlightType, string[]>;
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
  resetHighlight: (type: HighlightType) => void;
  highlightNode: (id: string, type: HighlightType, color: string) => void;
  highlightDuplicateNodes: () => void;
  reset: () => void;
}

export const useNodeSetterStore = create<NodeSetterState>((set, get) => ({
  nodes: debugNodes,
  highlightNodes: new Map(),
  setNodes: (updater) =>
    set((state) => ({
      nodes: updater(state.nodes),
    })),
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
        toast({
          title: "Duplicate Gameobject!",
          description:
            "You have two or more nodes that export to the same Gameobject. This can cause issues regarding its behaviour. Be careful!",
        });

        for (const node of group) {
          get().highlightNode(node.id, "duplicate", "orange");
        }
      }
    }
  },
  reset: () => set({ nodes: debugNodes, highlightNodes: new Map() }),
}));
