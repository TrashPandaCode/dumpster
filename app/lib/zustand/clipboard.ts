import type { Node } from "@xyflow/react";
import { create } from "zustand";

interface ClipboardState {
  copiedNodes: Node[];
  lastPastePosition: { x: number; y: number } | null;
  setCopiedNodes: (nodes: Node[]) => void;
  clearClipboard: () => void;
  hasCopiedNodes: () => boolean;
}

export const useClipboardStore = create<ClipboardState>((set, get) => ({
  copiedNodes: [],
  lastPastePosition: null,
  setCopiedNodes: (nodes: Node[]) => set({ copiedNodes: nodes }),
  clearClipboard: () => set({ copiedNodes: [] }),
  hasCopiedNodes: () => get().copiedNodes.length > 0,
}));
