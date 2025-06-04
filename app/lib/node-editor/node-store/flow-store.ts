import { type Edge, type Node } from "@xyflow/react";
import { create } from "zustand";

import type { LEVELS } from "~/lib/game/core/levels";
import { toast } from "../editor-components/Toast";

type HighlightType = "cycle" | "duplicate";

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  highlightNodes: Map<HighlightType, string[]>;
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
  setEdges: (updater: (edges: Edge[]) => Edge[]) => void;
  resetHighlight: (type: HighlightType) => void;
  highlightNode: (id: string, type: HighlightType, color: string) => void;
  highlightDuplicateNodes: () => void;
  init: (level: keyof typeof LEVELS) => void;
  save: () => void;
  reset: () => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  highlightNodes: new Map(),
  setNodes: (updater) =>
    set((state) => ({
      nodes: updater(state.nodes),
    })),
  setEdges: (updater) =>
    set((state) => ({
      edges: updater(state.edges),
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
  init: () => {
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const stored = localStorage.getItem(`flow-store-${levelId}`);
    if (!stored) return get().reset();

    const flowStoreData = JSON.parse(stored);
    set({
      nodes: flowStoreData.nodes || [],
      edges: flowStoreData.edges || [],
      highlightNodes: flowStoreData.highlightNodes
        ? new Map(flowStoreData.highlightNodes)
        : new Map(),
    });
  },
  save: () => {
    const state = get();
    const levelId = localStorage.getItem("level")!; // we can be sure a level has been loaded
    const flowStoreData = {
      nodes: state.nodes.map((node) => ({
        ...node,
        selected: false,
        dragging: false,
      })),
      edges: state.edges,
      highlightNodes: Array.from(state.highlightNodes),
    };
    localStorage.setItem(
      `flow-store-${levelId}`,
      JSON.stringify(flowStoreData)
    );
  },
  reset: () => set({ nodes: [], highlightNodes: new Map(), edges: [] }),
}));
