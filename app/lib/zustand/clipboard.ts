import type { Node } from "@xyflow/react";
import { create } from "zustand";

interface ClipboardState {
  copiedNodes: Node[];
  setCopiedNodes: (nodes: Node[]) => void;
  clearClipboard: () => void;
  hasCopiedNodes: () => boolean;
}

export const useClipboardStore = create<ClipboardState>((set, get) => ({
  copiedNodes: [],
  setCopiedNodes: (nodes: Node[]) => set({ copiedNodes: nodes }),
  clearClipboard: () => set({ copiedNodes: [] }),
  hasCopiedNodes: () => get().copiedNodes.length > 0,
}));
